import { NextResponse } from "next/server";
import { generateResetPasswordToken } from "@/lib/token";
import { sendResetPasswordEmail } from "@/lib/reset-mail";
import { getUserByEmail } from "@/data/user"; // Assume you have this function to fetch user data

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const { email } = body;

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "Email does not exist" }, { status: 404 });
    }

    const token = await generateResetPasswordToken(email);
    if (!token || !token.token) {
      return NextResponse.json({ message: "Failed to generate reset token" }, { status: 500 });
    }

    await sendResetPasswordEmail(email, token.token);

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
  }
}
