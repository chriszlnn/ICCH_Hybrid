import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.json(); // Parse JSON body
    console.log("Received data:", JSON.stringify(formData, null, 2));

    // Extract form data
    const { title, file, images } = formData; // Accept `file` instead of `body`


    if (!title || !file || !images) {
      return NextResponse.json(
        { error: "Title, body, and images are required" },
        { status: 400 }
      );
    }

    // Save post to Prisma
    const newPost = await prisma.beautyInfoPost.create({
      data: {
        title,
        images, // Save image URLs
        file, // Save markdown content to the `file` field
        likes: 0, // Default likes count
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const posts = await prisma.beautyInfoPost.findMany({
      orderBy: { createdAt: "desc" }, // Sort by newest posts first
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}