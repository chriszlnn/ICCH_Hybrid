import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";

// GET function
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const id = params.id;
    
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
      const [post, userLiked] = await Promise.all([
        prisma.beautyInfoPost.findUnique({
          where: { id: postId },
          select: { likes: true },
        }),
        userEmail ? prisma.beautyInfoPostLike.findUnique({
          where: { postId_userEmail: { postId, userEmail } },
          select: { id: true },
        }) : null
      ]);

      return { post, userLiked: !!userLiked };
    });

    if (!result.post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const response = NextResponse.json({ 
      likes: result.post.likes, 
      userLiked: result.userLiked 
    });
    
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
    return response;
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

// POST function
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const id = params.id;
    
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

    const result = await withDbConnection(async () => {
      const existingLike = await prisma.beautyInfoPostLike.findUnique({
        where: { postId_userEmail: { postId, userEmail } },
        select: { id: true },
      });

      let updatedLikes;

      if (liked && !existingLike) {
        // Add like
        await prisma.beautyInfoPostLike.create({
          data: { postId, userEmail },
        });

        updatedLikes = await prisma.beautyInfoPost.update({
          where: { id: postId },
          data: { likes: { increment: 1 } },
          select: { likes: true },
        });
      } else if (!liked && existingLike) {
        // Remove like
        await prisma.beautyInfoPostLike.delete({
          where: { postId_userEmail: { postId, userEmail } },
        });

        updatedLikes = await prisma.beautyInfoPost.update({
          where: { id: postId },
          data: { likes: { decrement: 1 } },
          select: { likes: true },
        });
      } else {
        // No changes needed, fetch current likes
        updatedLikes = await prisma.beautyInfoPost.findUnique({
          where: { id: postId },
          select: { likes: true },
        });
      }

      return updatedLikes;
    });

    const response = NextResponse.json({
      liked: !!liked,
      likes: result?.likes ?? 0,
    });

    // Add caching headers
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
}