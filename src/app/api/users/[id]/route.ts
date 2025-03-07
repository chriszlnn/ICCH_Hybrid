import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Log the ID for debugging
    console.log("Deleting user with ID:", id);

    // Validate the ID
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      console.error("User not found with ID:", id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    console.log("User deleted successfully:", id);
    return NextResponse.json({ success: true }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting user:", error.message || error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}



// PUT request to update user, client, or staff
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { emailVerified, name, department } = await request.json();
  const userId = params.id; // userId is a string (cuid)

  try {
    // Fetch the user and related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: true, // Include related client data
        staff: true,  // Include related staff data
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle client updates
    if (emailVerified !== undefined && user.role === 'CLIENT') {
      if (!user.client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      // Update emailVerified in both User and Client tables
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: emailVerified === 'Verified' ? new Date() : null },
      });

      const updatedClient = await prisma.client.update({
        where: { id: user.client.id },
        data: { emailVerified: emailVerified === 'Verified' ? new Date() : null },
      });

      return NextResponse.json({ user: updatedUser, client: updatedClient });
    }

    // Handle staff updates
    if ((name !== undefined || department !== undefined) && user.role === 'STAFF') {
      if (!user.staff) {
        return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
      }

      // Update name and department in the Staff table
      const updatedStaff = await prisma.staff.update({
        where: { id: user.staff.id },
        data: {
          name: name !== undefined ? name : user.staff.name,
          department: department !== undefined ? department : user.staff.department,
        },
      });

      return NextResponse.json({ staff: updatedStaff });
    }

    // If no valid fields are provided for updating
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  } catch (error) {
    console.error('Error updating user, client, or staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST request to resend verification email
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id; // userId is a string (cuid)

  try {
    // Fetch the user's email
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a new verification token
    const verificationToken = await generateVerificationToken(user.email);

    // Send the verification email
    await sendVerificationEmail(user.email, verificationToken.token);

    return NextResponse.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}