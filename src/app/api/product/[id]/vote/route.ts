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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userEmail = session?.user?.email
  const id = (await params).id
  if (!userEmail) {
    return NextResponse.json(
      { hasVoted: false },
      { status: 200 }
    )
  }

  try {
    const { week, year } = getCurrentWeekAndYear()
    
    const vote = await prisma.productVote.findFirst({
      where: {
        productId: id,
        userEmail,
        week,
        year
      }
    })

    return NextResponse.json({
      hasVoted: !!vote
    })
  } catch (error) {
    console.error('Error checking vote status:', error)
    return NextResponse.json(
      { hasVoted: false },
      { status: 200 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const id = (await params).id
  const userEmail = session?.user?.email
  if (!userEmail) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { week, year } = getCurrentWeekAndYear()

    // Check if user already voted for this product this week
    const existingVote = await prisma.productVote.findFirst({
      where: {
        userEmail,
        productId: id,
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
        userEmail,
        productId: id,
        week,
        year
      }
    })

    // Update product's vote count
    await prisma.product.update({
      where: { id },
      data: {
        votes: { increment: 1 }
      }
    })

    // Recalculate ranks for products in the same subcategory only
    const product = await prisma.product.findUnique({
      where: { id },
      select: { category: true, subcategory: true }
    })

    if (product && product.subcategory) {
      // Get all products in the same subcategory only
      const subcategoryProducts = await prisma.product.findMany({
        where: {
          subcategory: product.subcategory
        },
        orderBy: [
          { votes: 'desc' },
          { reviewCount: 'desc' }
        ]
      })

      // Update ranks only for products in this subcategory
      const updatePromises = subcategoryProducts.map((p, index) => 
        prisma.product.update({
          where: { id: p.id },
          data: { rank: index + 1 }
        })
      )

      await Promise.all(updatePromises)
    }

    // Return the updated product
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
        productLikes: true
      }
    })

    if (!updatedProduct) {
      throw new Error('Product not found after update')
    }

    return NextResponse.json({
      product: {
        ...updatedProduct,
        rating: updatedProduct.reviews.length > 0 
          ? updatedProduct.reviews.reduce((sum, r) => sum + r.rating, 0) / updatedProduct.reviews.length 
          : 0,
        reviewCount: updatedProduct.reviews.length,
        likes: updatedProduct.productLikes.length,
        votes: updatedProduct.votes
      }
    })
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}