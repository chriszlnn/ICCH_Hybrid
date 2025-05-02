import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, assignedTo, dueDate, priority, status } = body;

    const task = await prisma.task.update({
      where: {
        id: (await params).taskId,
      },
      data: {
        title,
        content,
        assignedTo,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        status,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("[TASK_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.task.delete({
      where: {
        id: (await params).taskId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[TASK_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 