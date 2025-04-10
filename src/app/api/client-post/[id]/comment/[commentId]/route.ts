import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: postId, commentId } = await params;
    
    if (!postId || !commentId) {
      return NextResponse.json(
        { error: "Missing post ID or comment ID" },
        { status: 400 }
      );
    }

    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Use withDbConnection for better connection handling
    await withDbConnection(async () => {
      // Get the current user
      const currentUser = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true, role: true }
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      // Get the comment and check ownership
      const comment = await prisma.comment.findUnique({
        where: { 
          id: commentId,
          postId: postId // Verify the comment belongs to the specified post
        },
        include: { user: true }
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      // Allow deletion if user is admin or if they own the comment
      if (currentUser.role !== "ADMIN" && comment.userId !== currentUser.id) {
        throw new Error("Unauthorized");
      }

      // Delete the comment
      await prisma.comment.delete({
        where: { id: commentId }
      });
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "Comment not found") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
} 