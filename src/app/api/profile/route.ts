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
      include: {
        client: true,
        admin: true,
        staff: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Determine the role-specific data
    const roleData = user.client || user.admin || user.staff || {};
    return NextResponse.json({ ...user, ...roleData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, username, bio, imageUrl } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prepare the data to update (only include fields that are provided)
    const updateData: { username?: string; bio?: string; imageUrl?: string } = {};
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    // Update role-specific data based on the user's role
    let roleUpdate;
    if (user.role === "CLIENT") {
      roleUpdate = await prisma.client.update({
        where: { userId: user.id },
        data: updateData,
      });
    } else if (user.role === "ADMIN") {
      roleUpdate = await prisma.admin.update({
        where: { userId: user.id },
        data: updateData,
      });
    } else if (user.role === "STAFF") {
      roleUpdate = await prisma.staff.update({
        where: { userId: user.id },
        data: updateData,
      });
    } else {
      return NextResponse.json({ message: "Invalid user role" }, { status: 400 });
    }

    return NextResponse.json({ ...user, ...roleUpdate }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}