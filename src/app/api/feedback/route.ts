import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Log the request body for debugging
    const body = await request.json();
    console.log("Request Body:", body);

    // Check if the body is empty or malformed
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body. Expected a JSON object." },
        { status: 400 }
      );
    }

    const { rating, issues, comment, email } = body;

    // Validate the input
    if (!rating || !issues || issues.length === 0 || !email) {
      return NextResponse.json(
        { error: "Rating, at least one issue, and email are required." },
        { status: 400 }
      );
    }

    // Save the feedback to the database
    const feedback = await prisma.feedback.create({
      data: {
        rating,
        issues,
        comment,
        email,
      },
    });

    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      const feedback = await prisma.feedback.findMany({
        orderBy: { createdAt: "desc" }, // Sort by most recent
      });
      return NextResponse.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }