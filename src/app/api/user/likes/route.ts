import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ hasLiked: false });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("postId");
    
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json({ hasLiked: false });
    }
    
    // Check if the user has liked the post
    const like = await prisma.postLike.findFirst({
      where: {
        userId: user.id,
        postId: postId
      }
    });
    
    return NextResponse.json({ hasLiked: !!like });
  } catch (error) {
    console.error("Error checking if user liked post:", error);
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
  }
} 