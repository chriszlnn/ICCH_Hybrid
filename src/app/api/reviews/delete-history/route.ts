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