import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/db-utils";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

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