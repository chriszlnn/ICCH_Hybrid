import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withRetry } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userEmail = session.user.email;

    // Use the withRetry utility to handle connection pool issues
    const review = await withRetry(async () => {
      return await prisma.review.findUnique({
        where: { id },
        include: { 
          author: true,
          product: true 
        }
      });
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to delete the review
    if (review.author.email !== userEmail && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized to delete this review" },
        { status: 403 }
      );
    }

    const productId = review.productId;

    // Delete the review with retry logic
    await withRetry(async () => {
      await prisma.review.delete({
        where: { id }
      });
    });

    // Update product review stats after deletion
    await updateProductReviewStats(productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
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