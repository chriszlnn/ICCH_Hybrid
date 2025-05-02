import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, assignedTo, dueDate, priority } = body;

    if (!title || !content || !assignedTo || !dueDate || !priority) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        content,
        assignedTo,
        dueDate: new Date(dueDate),
        priority,
        status: "PENDING",
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("[TASKS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      include: {
        staff: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.log("[TASKS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 