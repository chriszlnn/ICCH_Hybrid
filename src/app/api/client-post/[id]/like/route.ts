import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const { userEmail, liked } = await request.json();
    if (!userEmail) {
      return NextResponse.json({ error: "Missing user email" }, { status: 400 });
    }

    const result = await withDbConnection(async () => {
      // Get the user ID from email
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true }
      });

      if (!user) {
        throw new Error("User not found");
      }

      const existingLike = await prisma.postLike.findFirst({
        where: { 
          postId: id,
          userId: user.id
        },
        select: { id: true },
      });

      if (liked && !existingLike) {
        // Add like
        await prisma.postLike.create({
          data: { 
            postId: id,
            userId: user.id
          },
        });
      } else if (!liked && existingLike) {
        // Remove like
        await prisma.postLike.delete({
          where: { id: existingLike.id },
        });
      }

      // Get updated likes count
      const updatedPost = await prisma.clientPost.findUnique({
        where: { id },
        include: {
          likes: true
        }
      });

      return updatedPost;
    });

    const response = NextResponse.json({
      liked: !!liked,
      likes: result?.likes.length ?? 0,
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