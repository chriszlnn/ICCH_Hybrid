import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withRetry } from "@/lib/db-utils";

export async function DELETE() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userEmail = session.user.email;

  try {
    // Use the withRetry utility to handle connection pool issues
    await withRetry(async () => {
      // First, get all reviews by the user to know which products need updating
      const userReviews = await prisma.review.findMany({
        where: {
          author: {
            email: userEmail
          }
        },
        select: {
          productId: true
        }
      });

      // Get unique product IDs that need updating
      const productIds = [...new Set(userReviews.map(review => review.productId))];

      // Delete all reviews by the user
      await prisma.review.deleteMany({
        where: {
          author: {
            email: userEmail
          }
        },
      });

      // Delete all product likes by the user
      await prisma.productLike.deleteMany({
        where: {
          userEmail: userEmail,
        },
      });

      // Update review counts and ratings for all affected products
      for (const productId of productIds) {
        await updateProductReviewStats(productId);
      }

      console.log(`Deleted review history for user: ${userEmail}`);
    });

    return NextResponse.json({ success: true, message: "Review history deleted successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting review history:", errorMessage);
    
    return NextResponse.json(
      { error: "Failed to delete review history", details: errorMessage },
      { status: 500 }
    );
  }
}

async function updateProductReviewStats(productId: string) {
  // Get all reviews for this product
  const reviews = await prisma.review.findMany({
    where: { productId }
  });

  // Calculate new average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  // Update the product
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: averageRating,
      reviewCount: reviews.length
    }
  });
} 