import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";// Ensure you have a prisma client instance

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}