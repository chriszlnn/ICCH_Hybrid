import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withRetry } from "@/lib/db-utils";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const reviewId = params.id;
    const userEmail = session.user.email;

    // Use the withRetry utility to handle connection pool issues
    await withRetry(async () => {
      // First check if the review exists and belongs to the user
      const review = await prisma.review.findUnique({
        where: {
          id: reviewId,
          author: {
            email: userEmail
          }
        }
      });

      if (!review) {
        throw new Error("Review not found or you don't have permission to delete it");
      }

      // Delete the review
      await prisma.review.delete({
        where: {
          id: reviewId
        }
      });

      console.log(`Deleted review: ${reviewId} for user: ${userEmail}`);
    });

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting review:", errorMessage);
    
    return NextResponse.json(
      { error: "Failed to delete review", details: errorMessage },
      { status: 500 }
    );
  }
} 