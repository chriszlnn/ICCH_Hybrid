import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Helper function to retry database operations
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error);
      
      // If it's not a connection pool error, don't retry
      if (!(error instanceof Error && error.message.includes('connection pool'))) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

// GET user's recommendations
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    // Use the retry mechanism for database operations
    const recommendations = await withRetry(async () => {
      return await prisma.userRecommendation.findMany({
        where: {
          userEmail
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              category: true,
              subcategory: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    });

    // Add cache control headers to improve performance
    const response = NextResponse.json({ recommendations });
    response.headers.set('Cache-Control', 'private, max-age=60'); // Cache for 1 minute
    return response;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

// POST to add a recommendation
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure data consistency and reduce round trips
    const result = await prisma.$transaction(async (tx) => {
      // Check if product exists
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true } // Only select the ID to minimize data transfer
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Check if recommendation already exists
      const existingRecommendation = await tx.userRecommendation.findUnique({
        where: {
          userEmail_productId: {
            userEmail,
            productId
          }
        }
      });

      if (existingRecommendation) {
        throw new Error("Product already in recommendations");
      }

      // Create new recommendation
      return await tx.userRecommendation.create({
        data: {
          userEmail,
          productId
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              category: true
            }
          }
        }
      });
    });

    return NextResponse.json({ recommendation: result });
  } catch (error) {
    console.error("Error adding recommendation:", error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === "Product not found") {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      
      if (error.message === "Product already in recommendations") {
        return NextResponse.json(
          { error: "Product already in recommendations" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to add recommendation" },
      { status: 500 }
    );
  }
}

// DELETE to remove a recommendation
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    // Extract productId from URL
    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop();
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if the recommendation exists before trying to delete it
    const existingRecommendation = await prisma.userRecommendation.findUnique({
      where: {
        userEmail_productId: {
          userEmail,
          productId
        }
      }
    });

    // If the recommendation doesn't exist, return success (idempotent operation)
    if (!existingRecommendation) {
      return NextResponse.json({ success: true, message: "Recommendation not found, nothing to delete" });
    }

    // Delete the recommendation
    await prisma.userRecommendation.delete({
      where: {
        userEmail_productId: {
          userEmail,
          productId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing recommendation:", error);
    return NextResponse.json(
      { error: "Failed to remove recommendation" },
      { status: 500 }
    );
  }
} 