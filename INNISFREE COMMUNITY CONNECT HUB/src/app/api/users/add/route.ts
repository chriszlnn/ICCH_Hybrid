import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, department } = await request.json();

    if (!email || !name || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await withDbConnection(async () => {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create the user
      const user = await prisma.user.create({
        data: {
          email,
          role: "STAFF",
          staff: {
            create: {
              email,
              name,
              department,
            },
          },
        },
      });

      // Generate verification token
      const verificationToken = await generateVerificationToken(email);

      // Send verification email
      await sendVerificationEmail(email, verificationToken.token);

      return user;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error adding staff:", error);
    return NextResponse.json(
      {
        error: "Failed to add staff",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 