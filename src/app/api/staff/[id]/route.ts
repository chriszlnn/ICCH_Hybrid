import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const staffId = resolvedParams.id;
    const data = await request.json();

    const result = await withDbConnection(async () => {
      const updatedStaff = await prisma.staff.update({
        where: { id: staffId },
        data: {
          name: data.name,
          department: data.department,
          user: {
            update: {
              email: data.email,
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              emailVerified: true,
            },
          },
        },
      });

      return {
        id: updatedStaff.id,
        userId: updatedStaff.userId,
        email: updatedStaff.user.email,
        name: updatedStaff.name,
        department: updatedStaff.department,
        emailVerified: updatedStaff.user.emailVerified,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { error: "Failed to update staff member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const staffId = resolvedParams.id;

    const result = await withDbConnection(async () => {
      // First get the staff member to get their user ID
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        select: { userId: true },
      });

      if (!staff) {
        throw new Error("Staff member not found");
      }

      // Delete the staff record first
      await prisma.staff.delete({
        where: { id: staffId },
      });

      // Then delete the user record
      await prisma.user.delete({
        where: { id: staff.userId },
      });

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete staff member",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 