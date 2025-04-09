import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const staff = await prisma.staff.findUnique({
      where: {
        email: params.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
      },
    });

    if (!staff) {
      return new NextResponse("Staff not found", { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.log("[STAFF_GET_BY_EMAIL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 