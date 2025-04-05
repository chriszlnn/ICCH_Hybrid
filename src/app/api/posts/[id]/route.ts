import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { withDbConnection } from "@/lib/db-utils"

// In a real app, this would be a database

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // Await the params object
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "Params not found or ID missing" }, { status: 400 });
    }
    
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { title, images, file } = await request.json();

    const updatedPost = await prisma.beautyInfoPost.update({
      where: { id },
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "Params not found or ID missing" }, { status: 400 });
    }
    
    const id = parseInt(resolvedParams.id, 10);
    console.log("Deleting post with ID:", id);

    if (isNaN(id)) {
      console.error("Invalid ID:", resolvedParams.id);
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if the post exists
    const post = await prisma.beautyInfoPost.findUnique({ where: { id } });
    if (!post) {
      console.error("Post not found with ID:", id);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete all related BeautyInfoPostLike records
    await prisma.beautyInfoPostLike.deleteMany({
      where: { postId: id },
    });
    console.log("Deleted related likes for post ID:", id);

    // Delete the post
    await prisma.beautyInfoPost.delete({ where: { id } });
    console.log("Post deleted successfully:", id);

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

// Ensure this import is correct










