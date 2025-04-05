import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";

export async function GET() {
  try {
    const clients = await withDbConnection(async () => {
      return await prisma.client.findMany({
        select: {
          id: true,
          userId: true,
          email: true,
          username: true,
          emailVerified: true,
          imageUrl: true,
        },
      });
    });
    
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
