import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
      const session = await auth();
      const userEmail = session?.user?.email || null;
  
      const posts = await prisma.beautyInfoPost.findMany({
        include: {
          beautyInfoPostLikes: {
            where: { userEmail: userEmail || undefined },
            select: { id: true },
          },
        },
      });
  
      const postsWithLikes = posts.map((post) => ({
        id: post.id,
        title: post.title,
        images: post.images || [],
        file: post.file,
        likes: post.likes,
        userLiked: post.beautyInfoPostLikes.length > 0, // Ensure this is correct
      }));
  
      return NextResponse.json(postsWithLikes);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
  }