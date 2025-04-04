import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await req.json()
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get current week and year
    const now = new Date()
    const week = Math.floor((now.getDate() - 1) / 7) + 1
    const year = now.getFullYear()

    // Check if user has already voted for this product this week
    const existingVote = await prisma.productVote.findUnique({
      where: {
        userEmail_productId_week_year: {
          userEmail: session.user.email,
          productId,
          week,
          year,
        },
      },
    })

    if (existingVote) {
      return NextResponse.json({ error: "You have already voted for this product this week" }, { status: 400 })
    }

    // Create the vote
    const vote = await prisma.productVote.create({
      data: {
        userEmail: session.user.email,
        productId,
        week,
        year,
      },
    })

    // Update the product's vote count
    await prisma.product.update({
      where: { id: productId },
      data: { votes: { increment: 1 } },
    })

    return NextResponse.json({ success: true, vote })
  } catch (error) {
    console.error("Error casting vote:", error)
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")
    const week = searchParams.get("week")
    const year = searchParams.get("year")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get current week and year if not provided
    const now = new Date()
    const currentWeek = Math.floor((now.getDate() - 1) / 7) + 1
    const currentYear = now.getFullYear()

    const votes = await prisma.productVote.findMany({
      where: {
        productId,
        week: week ? parseInt(week) : currentWeek,
        year: year ? parseInt(year) : currentYear,
      },
      include: {
        User: {
          select: {
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ votes })
  } catch (error) {
    console.error("Error fetching votes:", error)
    return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 })
  }
} 