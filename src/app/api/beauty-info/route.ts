import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";

export async function GET() {
    try {
      const session = await auth();
      const userEmail = session?.user?.email || null;
  
      const posts = await withDbConnection(async () => {
        return prisma.beautyInfoPost.findMany({
          include: {
            beautyInfoPostLikes: {
              where: { userEmail: userEmail || undefined },
              select: { id: true },
            },
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20 // Limit the number of posts to improve performance
        });
      });
  
      const postsWithLikes = posts.map((post) => ({
        id: post.id,
        title: post.title,
        images: post.images || [],
        file: post.file,
        likes: post.likes,
        userLiked: post.beautyInfoPostLikes.length > 0, // Ensure this is correct
      }));
  
      // Add caching headers
      const response = NextResponse.json(postsWithLikes);
      response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
      return response;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
  }