import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/db-utils";

export async function GET(request: Request) {
  try {
    // Get the email from the query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Use the withRetry utility to handle connection pool issues
    const reviews = await withRetry(async () => {
      return await prisma.review.findMany({
        where: {
          author: {
            email: email
          }
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    });

    // Transform the response to match the expected format in the frontend
    const transformedReviews = reviews.map(review => ({
      ...review,
      product: {
        ...review.product,
        imageUrl: review.product.image || null
      }
    }));

    return NextResponse.json({ reviews: transformedReviews });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching user reviews:", errorMessage);
    
    return NextResponse.json(
      { error: "Failed to fetch user reviews", details: errorMessage },
      { status: 500 }
    );
  }
} 