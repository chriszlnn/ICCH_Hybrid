import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { changeUserPassword } from "@/lib/password-cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token and new password are required" },
        { status: 400 }
      );
    }

    
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expires) {
      return NextResponse.json(
        { message: "Token has expired" },
        { status: 400 }
      );
    }

    // Use the changeUserPassword function from our password cache
    const result = await changeUserPassword(resetToken.email, newPassword);
    
    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 500 }
      );
    }
   
    await prisma.passwordResetToken.delete({
      where: {
        email_token: {
          email: resetToken.email,
          token: resetToken.token,
        },
      },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
