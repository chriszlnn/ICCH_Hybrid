import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCachedUserProfile } from "@/lib/profile-cache";
import { withDbConnection } from "@/lib/db-utils";

// GET user profile
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Use cached profile data
    const user = await getCachedUserProfile(email);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if role-specific record exists, if not create it
    if (user.role === "CLIENT") {
      const client = await prisma.client.findUnique({
        where: { userId: user.id }
      });
      
      if (!client) {
        await prisma.client.create({
          data: {
            email: user.email,
            user: {
              connect: {
                id: user.id
              }
            }
          }
        });
      }
    } else if (user.role === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { userId: user.id }
      });
      
      if (!admin) {
        await prisma.admin.create({
          data: {
            email: user.email,
            user: {
              connect: {
                id: user.id
              }
            }
          }
        });
      }
    } else if (user.role === "STAFF") {
      const staff = await prisma.staff.findUnique({
        where: { userId: user.id }
      });
      
      if (!staff) {
        await prisma.staff.create({
          data: {
            email: user.email,
            user: {
              connect: {
                id: user.id
              }
            }
          }
        });
      }
    }

    // Prepare the response combining user data with role-specific data
    const response = { ...user };

    // Return the user data
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { email, username, bio, imageUrl } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Use withDbConnection to handle connection issues and add retry logic
    const result = await withDbConnection(async () => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          client: true,
          admin: true,
          staff: true
        }
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Prepare the data to update (only include fields that are provided)
      const updateData: { username?: string; bio?: string; imageUrl?: string } = {};
      if (username !== undefined) updateData.username = username;
      if (bio !== undefined) updateData.bio = bio;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      // Update role-specific data based on the user's role
      let roleUpdate;
      if (user.role === "CLIENT") {
        // For CLIENT role, update the client table
        roleUpdate = await prisma.client.update({
          where: { userId: user.id },
          data: updateData,
        });
        
        // Return the combined data
        return { 
          ...user,
          ...roleUpdate
        };
      } else if (user.role === "ADMIN") {
        // For ADMIN role, update the admin table
        roleUpdate = await prisma.admin.update({
          where: { userId: user.id },
          data: updateData,
        });
        
        // Return the combined data
        return { 
          ...user,
          ...roleUpdate
        };
      } else if (user.role === "STAFF") {
        // For STAFF role, update the staff table
        roleUpdate = await prisma.staff.update({
          where: { userId: user.id },
          data: updateData,
        });
        
        // Return the combined data
        return { 
          ...user,
          ...roleUpdate
        };
      } else {
        throw new Error("Invalid user role");
      }
    });

    // Log the result for debugging
    console.log("Profile update result:", result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      } else if (error.message === "Invalid user role") {
        return NextResponse.json({ message: "Invalid user role" }, { status: 400 });
      }
    }
    
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}