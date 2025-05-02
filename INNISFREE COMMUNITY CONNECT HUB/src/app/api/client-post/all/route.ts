import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";

export async function GET() {
  try {
    const posts = await withDbConnection(async () => {
      return prisma.clientPost.findMany({
        include: {
          client: {
            select: {
              imageUrl: true,
              username: true,
              email: true
            }
          },
          taggedProducts: {
            select: {
              productId: true
            }
          },
          likes: {
            select: {
              id: true
            }
          },
          comments: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching client posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
} 