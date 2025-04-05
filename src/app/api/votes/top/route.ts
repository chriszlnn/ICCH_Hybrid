import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const subcategory = searchParams.get("subcategory")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10

    // Get current week and year
    const now = new Date()
    const week = Math.floor((now.getDate() - 1) / 7) + 1
    const year = now.getFullYear()

    // Build the where clause for the products query
    const whereClause: Prisma.ProductWhereInput = {
      ...(category && { 
        category: {
          equals: category,
          mode: 'insensitive'
        }
      }),
      ...(subcategory && { 
        subcategory: {
          equals: subcategory,
          mode: 'insensitive'
        }
      }),
    }

    // Get all products that match the category/subcategory filter
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        ProductVote: {
          where: {
            week,
            year,
          },
          select: {
            id: true,
          },
        },
      },
    })

    // Map the products to include vote count
    const productsWithVotes = products.map((product) => {
      return {
        ...product,
        voteCount: product.ProductVote.length,
      }
    })

    // Sort by vote count
    productsWithVotes.sort((a, b) => b.voteCount - a.voteCount)

    // Apply limit if specified
    const limitedProducts = limit ? productsWithVotes.slice(0, limit) : productsWithVotes

    return NextResponse.json({ products: limitedProducts })
  } catch (error) {
    console.error("Error fetching top voted products:", error)
    return NextResponse.json({ error: "Failed to fetch top voted products" }, { status: 500 })
  }
} 