import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";

export async function GET() {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin or staff
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the user to check their role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });
    
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json(
        { message: "Unauthorized - Admin or Staff access required" },
        { status: 403 }
      );
    }
    
    // Fetch all clients with their post counts
    const clients = await withDbConnection(async () => {
      const clients = await prisma.client.findMany({
        include: {
          user: {
            select: {
              email: true,
              image: true,
            }
          },
          _count: {
            select: {
              ClientPost: true
            }
          }
        }
      });
      
      // Transform the data to match the expected format
      return clients.map(client => ({
        id: client.id,
        userId: client.userId,
        email: client.user.email,
        username: client.username || "",
        imageUrl: client.imageUrl || client.user.image || null,
        postCount: client._count.ClientPost
      }));
    });
    
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
