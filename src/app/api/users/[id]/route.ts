import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';
import { withRetry } from "@/lib/db-utils";

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    // Log the ID for debugging
    console.log("Deleting user with ID:", id);

    // Validate the ID
    if (!id) {
      console.error("Invalid ID provided");
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Use the withRetry utility to handle connection pool issues
    await withRetry(async () => {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          client: true,
          staff: true,
        },
      });

      if (!user) {
        console.error("User not found with ID:", id);
        throw new Error("User not found");
      }

      // First, delete all related records to avoid foreign key constraint violations
      // This is a cascading delete approach
      
      // 1. Delete product likes
      await prisma.productLike.deleteMany({
        where: { userEmail: user.email },
      });
      
      // 2. Delete client or staff records if they exist
      if (user.client) {
        await prisma.client.delete({
          where: { id: user.client.id },
        });
      }
      
      if (user.staff) {
        await prisma.staff.delete({
          where: { id: user.staff.id },
        });
      }
      
      // 3. Delete any other related records that might exist
      // Add more delete operations here as needed
      
      // Finally, delete the user
      await prisma.user.delete({
        where: { id },
      });

      console.log("User and all related records deleted successfully:", id);
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting user:", errorMessage);
    
    // Return appropriate status code based on the error
    if (errorMessage === "User not found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "Failed to delete user", details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT request to update user, client, or staff
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { emailVerified, name, department } = await request.json();
  const userId = params.id; // userId is a string (cuid)

  try {
    // Use the withRetry utility to handle connection pool issues
    const result = await withRetry(async () => {
      // Fetch the user and related data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          client: true, // Include related client data
          staff: true,  // Include related staff data
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Handle client updates
      if (emailVerified !== undefined && user.role === 'CLIENT') {
        if (!user.client) {
          throw new Error('Client not found');
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

        return { user: updatedUser, client: updatedClient };
      }

      // Handle staff updates
      if ((name !== undefined || department !== undefined) && user.role === 'STAFF') {
        if (!user.staff) {
          throw new Error('Staff not found');
        }

        // Update name and department in the Staff table
        const updatedStaff = await prisma.staff.update({
          where: { id: user.staff.id },
          data: {
            name: name !== undefined ? name : user.staff.name,
            department: department !== undefined ? department : user.staff.department,
          },
        });

        return { staff: updatedStaff };
      }

      // If no valid fields are provided for updating
      throw new Error('No valid fields to update');
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error updating user, client, or staff:', errorMessage);
    
    // Return appropriate status code based on the error
    if (errorMessage === 'User not found' || errorMessage === 'Client not found' || errorMessage === 'Staff not found') {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    
    if (errorMessage === 'No valid fields to update') {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

// POST request to resend verification email
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id; // userId is a string (cuid)

  try {
    // Use the withRetry utility to handle connection pool issues
    await withRetry(async () => {
      // Fetch the user's email
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate a new verification token
      const verificationToken = await generateVerificationToken(user.email);

      // Send the verification email
      await sendVerificationEmail(user.email, verificationToken.token);
    });

    return NextResponse.json({ message: 'Verification email sent successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error resending verification email:', errorMessage);
    
    // Return appropriate status code based on the error
    if (errorMessage === 'User not found') {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}