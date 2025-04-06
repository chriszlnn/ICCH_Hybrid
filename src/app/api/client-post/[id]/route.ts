import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";
import { NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const session = await auth();
    const userEmail = session?.user?.email || null;

    const result = await withDbConnection(async () => {
      const [post, userLiked] = await Promise.all([
        prisma.clientPost.findUnique({
          where: { id },
          include: {
            taggedProducts: {
              select: {
                productId: true
              }
            },
            likes: {
              where: userEmail ? {
                user: {
                  email: userEmail
                }
              } : undefined,
              select: {
                id: true
              }
            }
          }
        }),
        userEmail ? prisma.postLike.findFirst({
          where: { 
            postId: id,
            user: {
              email: userEmail
            }
          },
          select: { id: true },
        }) : null
      ]);

      if (!post) {
        return null;
      }

      return {
        id: post.id,
        images: post.images,
        caption: post.content,
        createdAt: post.createdAt,
        productIds: post.taggedProducts.map(tp => tp.productId),
        likes: post.likes.length,
        userLiked: !!userLiked
      };
    });

    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const response = NextResponse.json(result);
    
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

export async function DELETE(
  request: NextRequest,
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

    // Get the post and check ownership
    const post = await prisma.clientPost.findUnique({
      where: { id: params.id },
      include: { client: { include: { user: true } } }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if the current user owns the post
    if (post.client.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete the post
    await prisma.clientPost.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
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

    // Get the post and check ownership
    const post = await prisma.clientPost.findUnique({
      where: { id: params.id },
      include: { client: { include: { user: true } } }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if the current user owns the post
    if (post.client.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get the request body
    const body = await request.json();
    const { title, content, images } = body;

    // Validate the request body
    if (!title || !content || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the post
    const updatedPost = await prisma.clientPost.update({
      where: { id: params.id },
      data: {
        title,
        content,
        images,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
} 