// app/api/product/vote/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

// Helper to get current week/year
function getCurrentWeekAndYear() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000
  return {
    week: Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7),
    year: now.getFullYear()
  }
}

export async function POST(request: Request) {
  const session = await auth();
  
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

    // Check for existing vote this week
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
    await prisma.productVote.create({
      data: {
        userEmail: session.user.email,
        productId,
        week,
        year,
        createdAt: new Date()
      }
    })

    // Update product vote count
    await prisma.product.update({
      where: { id: productId },
      data: {
        votes: { increment: 1 }
      }
    })

    // Recalculate all ranks for products in this category
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true, subcategory: true }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    // Get all products in the same category/subcategory
    const categoryProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        subcategory: product.subcategory
      },
      orderBy: [
        { votes: 'desc' },  // Primary sort by votes
        { reviewCount: 'desc' }  // Secondary sort by reviews
      ]
    })

    // Update ranks for all products in the category
    const updatePromises = categoryProducts.map((p, index) => 
      prisma.product.update({
        where: { id: p.id },
        data: { rank: index + 1 }  // 1-based ranking
      })
    )

    await Promise.all(updatePromises)

    // Return the updated product with its new rank
    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    return NextResponse.json({ 
      success: true,
      product: updatedProduct
    })
      
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}

export async function GET() {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  
    try {
      const votes = await prisma.productVote.findMany({
        where: {
          userEmail: session.user.email,
        },
        select: {
          productId: true,
          createdAt: true
        }
      })
  
      return NextResponse.json(votes)
    } catch (error) {
      console.error('Error fetching votes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      )
    }
  }