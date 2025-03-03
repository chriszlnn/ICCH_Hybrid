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

    // Merge role-specific data with user data
    const roleData = user.client || user.admin || user.staff || {};

    return NextResponse.json({ ...user, ...roleData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}

// POST to update or create user profile
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

    // Update user role-specific data
    let roleUpdate;
    if (user.role === "CLIENT") {
      roleUpdate = await prisma.client.upsert({
        where: { userId: user.id },
        update: { username, bio, imageUrl },
        create: { userId: user.id, username, bio, imageUrl },
      });
    } else if (user.role === "ADMIN") {
      roleUpdate = await prisma.admin.upsert({
        where: { userId: user.id },
        update: { username, bio, imageUrl },
        create: { userId: user.id, username, bio, imageUrl },
      });
    } else if (user.role === "STAFF") {
      roleUpdate = await prisma.staff.upsert({
        where: { userId: user.id },
        update: { username, bio, imageUrl },
        create: { userId: user.id, username, bio, imageUrl },
      });
    }

    return NextResponse.json({ ...user, ...roleUpdate }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}
