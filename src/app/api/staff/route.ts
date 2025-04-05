/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withDbConnection(async () => {
      const staff = await prisma.staff.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              emailVerified: true,
            },
          },
        },
      });

      return staff.map((staffMember) => ({
        id: staffMember.id,
        userId: staffMember.userId,
        email: staffMember.user.email,
        name: staffMember.name,
        department: staffMember.department,
        emailVerified: staffMember.user.emailVerified,
      }));
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Incoming request body:", body); // Log the request body

    const { name, email, department, password } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user first
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "STAFF",  
      },
    });

    console.log("New user created:", newUser); // Log the created user

    // Create the new staff member and associate it with the user
    const newStaff = await prisma.staff.create({
      data: {
        name,
        email,
        department,
        userId: newUser.id, // Associate with the newly created user
      },
    });

    console.log("New staff created:", newStaff); // Log the created staff member
    return NextResponse.json(newStaff, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating staff:", error.message || error); // Log the error message

    if (error.code === "P2002") { // Prisma error code for unique constraint violation
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}
