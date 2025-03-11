import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// In a real app, this would be a database


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // `params` is a Promise, so we need to await it
) {
  try {
    const resolvedParams = await context.params; // ✅ Await the params
    console.log("Resolved Params:", resolvedParams);

    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "Params not found or ID missing" }, { status: 400 });
    }

    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const post = await prisma.beautyInfoPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}









export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    const { title, images, file } = await request.json()

    const updatedPost = await prisma.beautyInfoPost.update({
      where: { id },
      data: { title, images, file, updatedAt: new Date() },
    })

    return NextResponse.json(updatedPost, { status: 200 })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    console.log("Deleting post with ID:", id);

    if (isNaN(id)) {
      console.error("Invalid ID:", params.id);
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










