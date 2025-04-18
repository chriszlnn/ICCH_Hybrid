import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";
import type { BeautyPost } from "@/lib/types/types";

// GET function
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
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
    }, 10);

    if (!result.post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const response = NextResponse.json(result.post);
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error("Error fetching post:", error);
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const { liked, userEmail } = await request.json();
    
    if (userEmail === undefined) {
      return NextResponse.json({ error: "Missing user email" }, { status: 400 });
    }

    const result = await withDbConnection(async () => {
      const postExists = await prisma.beautyInfoPost.findUnique({
        where: { id: postId },
        select: { id: true },
      });

      if (!postExists) {
        throw new Error("Post not found");
      }

      return await prisma.$transaction(async (tx) => {
        const existingLike = await tx.beautyInfoPostLike.findUnique({
          where: { postId_userEmail: { postId, userEmail } },
          select: { id: true },
        });

        let updatedLikes;

        if (liked && !existingLike) {
          await tx.beautyInfoPostLike.create({
            data: { postId, userEmail },
          });

          updatedLikes = await tx.beautyInfoPost.update({
            where: { id: postId },
            data: { likes: { increment: 1 } },
            select: { likes: true },
          });
        } else if (!liked && existingLike) {
          await tx.beautyInfoPostLike.delete({
            where: { postId_userEmail: { postId, userEmail } },
          });

          updatedLikes = await tx.beautyInfoPost.update({
            where: { id: postId },
            data: { likes: { decrement: 1 } },
            select: { likes: true },
          });
        } else {
          updatedLikes = await tx.beautyInfoPost.findUnique({
            where: { id: postId },
            select: { likes: true },
          });
        }

        const finalLikeStatus = await tx.beautyInfoPostLike.findUnique({
          where: { postId_userEmail: { postId, userEmail } },
          select: { id: true },
        });

        return {
          likes: updatedLikes?.likes ?? 0,
          liked: !!finalLikeStatus
        };
      });
    });

    const response = NextResponse.json(result);
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error("Error updating like:", error);
    
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