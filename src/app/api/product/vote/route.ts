// app/api/product/vote/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

// Use a singleton PrismaClient instance to prevent connection pool exhaustion
// This is the recommended approach for Next.js API routes
const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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

  // At this point we know email exists
  const userEmail = session.user.email;

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
        userEmail,
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

    // Use a transaction to ensure data consistency and improve performance
    const result = await prisma.$transaction(async (tx) => {
      // Create new vote
      await tx.productVote.create({
        data: {
          userEmail,
          productId,
          week,
          year,
          createdAt: new Date()
        }
      })

      // Update product vote count
      await tx.product.update({
        where: { id: productId },
        data: {
          votes: { increment: 1 }
        }
      })

      // Get product subcategory
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { category: true, subcategory: true }
      })

      if (!product || !product.subcategory) {
        throw new Error('Product not found or has no subcategory')
      }

      // Get all products in the same subcategory only
      const subcategoryProducts = await tx.product.findMany({
        where: {
          subcategory: product.subcategory
        },
        orderBy: [
          { votes: 'desc' },  // Primary sort by votes
          { reviewCount: 'desc' }  // Secondary sort by reviews
        ]
      })

      // Update ranks for all products in this subcategory
      // Use a more efficient approach with a single query
      const updates = subcategoryProducts.map((p, index) => ({
        id: p.id,
        rank: index + 1
      }))

      // Use a more efficient batch update approach
      if (updates.length > 0) {
        await tx.$executeRaw`
          UPDATE "Product" 
          SET "rank" = c."rank"::integer
          FROM (VALUES ${updates.map(u => `(${u.id}, ${u.rank})`).join(',')}) AS c(id, rank)
          WHERE "Product"."id" = c.id
        `
      }

      // Return the updated product with its new rank
      return await tx.product.findUnique({
        where: { id: productId }
      })
    })

    return NextResponse.json({ 
      success: true,
      product: result
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
  
    // At this point we know email exists
    const userEmail = session.user.email;
  
    try {
      const votes = await prisma.productVote.findMany({
        where: {
          userEmail,
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