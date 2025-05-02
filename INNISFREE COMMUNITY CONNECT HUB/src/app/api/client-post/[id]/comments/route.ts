import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Use withDbConnection to handle database connection issues
    const comments = await withDbConnection(async () => {
      return await prisma.comment.findMany({
        where: {
          postId: id,
        },
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
          createdAt: "desc",
        },
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