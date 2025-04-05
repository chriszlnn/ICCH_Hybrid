import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get current week and year
    const now = new Date()
    const week = Math.floor((now.getDate() - 1) / 7) + 1
    const year = now.getFullYear()

    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        subcategory: true,
      },
    })

    // Get all votes for current week
    const votes = await prisma.productVote.findMany({
      where: {
        week,
        year,
      },
      select: {
        id: true,
        productId: true,
        userEmail: true,
      },
    })

    return NextResponse.json({
      debug: {
        currentWeek: week,
        currentYear: year,
        totalProducts: products.length,
        totalVotes: votes.length,
        products,
        votes,
      },
    })
  } catch (error) {
    console.error("Error in debug route:", error)
    return NextResponse.json({ error: "Failed to fetch debug info" }, { status: 500 })
  }
} 