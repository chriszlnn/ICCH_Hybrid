import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

import { getCachedProductsByCategory } from '@/lib/product-cache'

const prismaClient = new PrismaClient()

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
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const limit = searchParams.get('limit') // Keep this for backward compatibility

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    const products = await getCachedProductsByCategory(
      category,
      subcategory || undefined,
      limit ? parseInt(limit) : undefined
    )

    if (!products) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json(products)
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
    const existingVote = await prismaClient.productVote.findFirst({
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
    const vote = await prismaClient.productVote.create({
      data: {
        userEmail: session.user.email,
        productId,
        week,
        year
      }
    })

    // Update product's vote count (you might want to do this in a transaction)
    await prismaClient.product.update({
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