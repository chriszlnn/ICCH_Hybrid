import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const comments = await withDbConnection(async () => {
      return prisma.comment.findMany({
        where: { postId: id },
        include: {
          user: {
            include: {
              client: true,
              admin: true,
              staff: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    // Transform the comments to include the profile image and username
    const transformedComments = comments.map(comment => {
      const roleData = comment.user.client || comment.user.admin || comment.user.staff;
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          email: comment.user.email,
          image: roleData?.imageUrl || comment.user.image || "/blank-profile.svg",
          name: roleData?.username || comment.user.email.split('@')[0]
        }
      };
    });

    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        client: true,
        admin: true,
        staff: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const comment = await withDbConnection(async () => {
      return prisma.comment.create({
        data: {
          content: content.trim(),
          postId: id,
          userId: user.id
        },
        include: {
          user: {
            include: {
              client: true,
              admin: true,
              staff: true
            }
          }
        }
      });
    });

    // Transform the comment to include the profile image and username
    const roleData = comment.user.client || comment.user.admin || comment.user.staff;
    const transformedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        email: comment.user.email,
        image: roleData?.imageUrl || comment.user.image || "/blank-profile.svg",
        name: roleData?.username || comment.user.email.split('@')[0]
      }
    };

    return NextResponse.json(transformedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
} 