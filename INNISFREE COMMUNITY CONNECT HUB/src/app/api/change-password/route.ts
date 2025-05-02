import { NextResponse } from "next/server";
import { validateUserPassword, changeUserPassword } from "@/lib/password-cache";

// POST to change user password
export async function POST(req: Request) {
  try {
    const { email, currentPassword, newPassword } = await req.json();

    // Basic validation
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Validate current password using cached function
    const validation = await validateUserPassword(email, currentPassword);
    
    if (!validation.isValid) {
      return NextResponse.json({ message: validation.error }, { status: validation.error === "User not found" ? 404 : 401 });
    }

    // Change password using cached function
    const result = await changeUserPassword(email, newPassword);
    
    if (!result.success) {
      return NextResponse.json({ message: result.error }, { status: 500 });
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "Failed to change password", error: error.message },
      { status: 500 }
    );
  }
}
