import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";
import type { BeautyPost } from "@/lib/types/types";

// GET function
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Await the params object before using its properties
    const { id } = context.params;
    
    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const session = await auth();
    const userEmail = session?.user?.email || null;

    const result = await withDbConnection(async () => {
      try {
        // First fetch the post without waiting for like status
        const post = await prisma.beautyInfoPost.findUnique({
          where: { id: postId },
          select: {
            id: true,
            title: true,
            images: true,
            file: true,
            likes: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!post) {
          return { post: null, userLiked: false };
        }

        // Then fetch the user liked status separately
        let userLiked = false;
        if (userEmail) {
          try {
            const likeRecord = await prisma.beautyInfoPostLike.findUnique({
              where: { 
                postId_userEmail: { 
                  postId, 
                  userEmail 
                } 
              },
              select: { id: true },
            });
            userLiked = !!likeRecord;
          } catch (likeError) {
            console.error("Error fetching like status:", likeError);
            // Continue with userLiked as false if there's an error
          }
        }

        return { 
          post: {
            ...post,
            userLiked
          } satisfies BeautyPost
        };
      } catch (error) {
        console.error("Error in post fetch operation:", error);
        throw error;
      }
    }, 10); // Increase retries for this critical endpoint

    if (!result.post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const response = NextResponse.json(result.post);
    
    // Add caching headers with optimized settings for individual posts
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('Vary', 'Authorization'); // Vary cache by auth status
    return response;
  } catch (error) {
    console.error("Error fetching post:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("connection pool")) {
        return NextResponse.json(
          { error: "Database connection issue. Please try again." },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// POST function
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    
    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const { userEmail, liked } = await request.json();
    if (!userEmail) {
      return NextResponse.json({ error: "Missing user email" }, { status: 400 });
    }

    // Use a transaction to ensure data consistency
    const result = await withDbConnection(async () => {
      // First check if the post exists
      const postExists = await prisma.beautyInfoPost.findUnique({
        where: { id: postId },
        select: { id: true },
      });

      if (!postExists) {
        throw new Error("Post not found");
      }

      // Use a transaction to ensure all operations succeed or fail together
      return await prisma.$transaction(async (tx) => {
        const existingLike = await tx.beautyInfoPostLike.findUnique({
          where: { postId_userEmail: { postId, userEmail } },
          select: { id: true },
        });

        let updatedLikes;

        if (liked && !existingLike) {
          // Add like
          await tx.beautyInfoPostLike.create({
            data: { postId, userEmail },
          });

          updatedLikes = await tx.beautyInfoPost.update({
            where: { id: postId },
            data: { likes: { increment: 1 } },
            select: { likes: true },
          });
        } else if (!liked && existingLike) {
          // Remove like
          await tx.beautyInfoPostLike.delete({
            where: { postId_userEmail: { postId, userEmail } },
          });

          updatedLikes = await tx.beautyInfoPost.update({
            where: { id: postId },
            data: { likes: { decrement: 1 } },
            select: { likes: true },
          });
        } else {
          // No changes needed, fetch current likes
          updatedLikes = await tx.beautyInfoPost.findUnique({
            where: { id: postId },
            select: { likes: true },
          });
        }

        // Verify the like status after the operation
        const finalLikeStatus = await tx.beautyInfoPostLike.findUnique({
          where: { postId_userEmail: { postId, userEmail } },
          select: { id: true },
        });

        // Log the result for debugging
        console.log('Like operation result:', {
          postId,
          userEmail,
          requestedLike: liked,
          finalLikeStatus: !!finalLikeStatus,
          likes: updatedLikes?.likes
        });

        return {
          likes: updatedLikes?.likes ?? 0,
          liked: !!finalLikeStatus
        };
      });
    });

    const response = NextResponse.json(result);
    
    // Remove caching headers for like operations to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;
  } catch (error) {
    console.error("Error updating like:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message === "Post not found") {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
}