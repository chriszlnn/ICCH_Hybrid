import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET user profile
export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const email = searchParams.get("email");
  
      if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
      }
  
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
    }
  }

// POST to update or create user profile
// POST to update or create user profile
export async function POST(req: Request) {
    try {
      const { email, username, bio, imageUrl } = await req.json();
  
      if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
      }
  
      const updatedUser = await prisma.user.upsert({
        where: { email },
        update: { ...(username && { username }), ...(bio && { bio }), ...(imageUrl && { imageUrl }) },
        create: { email, username: username || "", bio: bio || "", imageUrl: imageUrl || "" },
      });
      
  
      return NextResponse.json(updatedUser, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {  // ✅ Add detailed error logging
      console.error("Error updating user:", error);
      return NextResponse.json(
        { message: "Failed to update user", error: error.message }, // Include error message
        { status: 500 }
      );
    }
  }
  