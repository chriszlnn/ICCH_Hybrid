import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";
import type { BeautyPost } from "@/lib/types/types";

export async function GET() {
    try {
      const session = await auth();
      const userEmail = session?.user?.email || null;
  
      const posts = await withDbConnection(async () => {
        try {
          // First fetch all posts without waiting for likes
          const allPosts = await prisma.beautyInfoPost.findMany({
            select: {
              id: true,
              title: true,
              images: true,
              file: true,
              likes: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 20 // Limit the number of posts to improve performance
          });
          
          // If no user is logged in, return posts without like status
          if (!userEmail) {
            return allPosts.map(post => ({
              ...post,
              userLiked: false
            })) satisfies BeautyPost[];
          }
          
          // Then fetch all likes for the current user in a single query
          const userLikes = await prisma.beautyInfoPostLike.findMany({
            where: { userEmail },
            select: { postId: true },
          });
          
          // Create a set of post IDs that the user has liked for faster lookup
          const likedPostIds = new Set(userLikes.map(like => like.postId));
          
          // Map posts to include the like status
          return allPosts.map(post => ({
            ...post,
            userLiked: likedPostIds.has(post.id)
          })) satisfies BeautyPost[];
        } catch (error) {
          console.error("Error in posts fetch operation:", error);
          throw error;
        }
      }, 10); // Increase retries for this critical endpoint
  
      // Add caching headers with optimized settings
      const response = NextResponse.json(posts);
      response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
      response.headers.set('Vary', 'Authorization'); // Vary cache by auth status
      return response;
    } catch (error) {
      console.error("Error fetching posts:", error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("connection pool")) {
          return NextResponse.json(
            { error: "Database connection issue. Please try again." },
            { status: 503 }
          );
        }
      }
      
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
  }