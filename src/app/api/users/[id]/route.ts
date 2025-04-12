import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';
import { withRetry } from "@/lib/db-utils";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (await params).id;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const result = await withDbConnection(async () => {
      // First, check if the user exists and get their role
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          staff: true,
          client: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Delete related records based on user role
      if (user.role === "STAFF" && user.staff) {
        // Delete staff-specific records first
        await prisma.staff.delete({
          where: { id: user.staff.id },
        });
      } else if (user.role === "CLIENT" && user.client) {
        // Delete client-specific records first
        await prisma.client.delete({
          where: { id: user.client.id },
        });
      }

      // Delete common related records
      await Promise.all([
        prisma.userRecommendation.deleteMany({
          where: { userEmail: user.email },
        }),
        prisma.productLike.deleteMany({
          where: { userEmail: user.email },
        }),
        prisma.beautyInfoPostLike.deleteMany({
          where: { userEmail: user.email },
        }),
      ]);

      // Finally delete the user
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });

      return deletedUser;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete user",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// PUT request to update user, client, or staff
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id; // userId is a string (cuid)
  const { emailVerified, name, department } = await request.json();

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
export async function POST(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id; // userId is a string (cuid)

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