import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

// Helper function to get current week and year
function getCurrentWeekAndYear() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000
  return {
    week: Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7),
    year: now.getFullYear()
  }
}

// GET /api/product - Get ranked products by category/subcategory
// GET /api/product - Updated to handle empty ranks
export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category')
      const subcategory = searchParams.get('subcategory')
      const limit = searchParams.get('limit') || '3'
  
      if (!category) {
        return NextResponse.json(
          { error: 'Category is required' },
          { status: 400 }
        )
      }
  
      const products = await prisma.product.findMany({
        where: {
            category: { equals: category, mode: 'insensitive' }, // This fixes it
            subcategory: { equals: subcategory, mode: 'insensitive' }
          },
        orderBy: [
          { rank: 'asc' }, // Sort by rank if exists
          { createdAt: 'desc' } // Fallback to creation date
        ],
        take: parseInt(limit),
        include: {
          reviews: true,
          productLikes: true,
          ProductVote: true
        }
      })
  
      const productsWithStats = products.map(product => ({
        ...product,
        rank: product.rank || 999, // Default rank for unranked products
        rating: product.reviews.length > 0 
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length 
          : 0,
        reviewCount: product.reviews.length,
        likes: product.productLikes.length
      }))

  
      return NextResponse.json(productsWithStats)
    } catch (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }
  }

// POST /api/product/vote - Submit a vote for a product
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { productId } = await request.json()
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { week, year } = getCurrentWeekAndYear()

    // Check if user already voted for this product this week
    const existingVote = await prisma.productVote.findFirst({
      where: {
        userEmail: session.user.email,
        productId,
        week,
        year
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this product this week' },
        { status: 400 }
      )
    }

    // Create new vote
    const vote = await prisma.productVote.create({
      data: {
        userEmail: session.user.email,
        productId,
        week,
        year
      }
    })

    // Update product's vote count (you might want to do this in a transaction)
    await prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}