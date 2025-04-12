import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { withDbConnection } from "@/lib/db-utils"

// In a real app, this would be a database

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
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
      const [post, userLiked] = await Promise.all([
        prisma.beautyInfoPost.findUnique({
          where: { id: postId },
          select: {
            id: true,
            title: true,
            images: true,
            file: true,
            likes: true,
          },
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
      ...result.post,
      userLiked: result.userLiked,
    });
    
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
    return response;
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400 });
    }
    
    const numId = Number(id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    
    const { title, images, file } = await request.json();
    const updatedPost = await prisma.beautyInfoPost.update({
      where: { id: numId },
      data: { title, images, file, updatedAt: new Date() },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400 });
    }
    
    const numId = Number(id);
    console.log("Deleting post with ID:", numId);

    if (isNaN(numId)) {
      console.error("Invalid ID:", id);
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if the post exists
    const post = await prisma.beautyInfoPost.findUnique({ where: { id: numId } });
    if (!post) {
      console.error("Post not found with ID:", numId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete all related BeautyInfoPostLike records
    await prisma.beautyInfoPostLike.deleteMany({
      where: { postId: numId },
    });
    console.log("Deleted related likes for post ID:", numId);

    // Delete the post
    await prisma.beautyInfoPost.delete({ where: { id: numId } });
    console.log("Post deleted successfully:", numId);

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

// Ensure this import is correct










