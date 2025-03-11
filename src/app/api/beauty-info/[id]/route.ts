import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET function
export async function GET(
  request: Request,
  { params }: { params: { id: string } } // Destructure params here
): Promise<Response> {
  try {
    // Ensure params.id is available
    if (!params?.id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const postId = Number(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // Fetch the post from the database
    const post = await prisma.beautyInfoPost.findUnique({
      where: { id: postId },
      select: { likes: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get the current session and user email
    const session = await auth();
    const userEmail = session?.user?.email || null;

    // Check if the user liked the post
    const userLiked = userEmail
      ? !!(await prisma.beautyInfoPostLike.findUnique({
          where: { postId_userEmail: { postId, userEmail } },
          select: { id: true },
        }))
      : false;

    return NextResponse.json({ likes: post.likes, userLiked });
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
  { params }: { params: { id: string } } // Destructure params here
): Promise<Response> {
  try {
    // Ensure params.id is available
    if (!params?.id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const postId = Number(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // Parse the request body
    const { userEmail, liked } = await request.json();
    if (!userEmail) {
      return NextResponse.json({ error: "Missing user email" }, { status: 400 });
    }

    // Check if the like already exists
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

    // Return the updated like status and likes count
    return NextResponse.json({
      liked: !!liked,
      likes: updatedLikes?.likes ?? 0,
    });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
}