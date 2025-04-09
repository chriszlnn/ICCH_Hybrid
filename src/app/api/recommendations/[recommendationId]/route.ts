import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ recommendationId: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userEmail = session.user.email
  
  // Properly await the params
  const { recommendationId } = await context.params

  try {
    // Use the retry mechanism for database operations
    const existingRecommendation = await withRetry(async () => {
      return await prisma.userRecommendation.findUnique({
        where: {
          id: recommendationId
        }
      });
    });

    if (!existingRecommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      )
    }

    // Verify that the recommendation belongs to the user
    if (existingRecommendation.userEmail !== userEmail) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Delete the recommendation with retry
    await withRetry(async () => {
      await prisma.userRecommendation.delete({
        where: {
          id: recommendationId
        }
      });
    });

    // Also delete any duplicate recommendations for the same product with retry
    await withRetry(async () => {
      await prisma.userRecommendation.deleteMany({
        where: {
          userEmail,
          productId: existingRecommendation.productId,
          id: {
            not: recommendationId
          }
        }
      });
    });

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing recommendation:", error)
    return NextResponse.json(
      { error: "Failed to remove recommendation" },
      { status: 500 }
    )
  }
} 