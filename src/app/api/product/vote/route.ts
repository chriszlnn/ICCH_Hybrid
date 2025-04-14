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

    // Get product subcategory first
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true, subcategory: true }
    })

    if (!product || !product.subcategory) {
      return NextResponse.json(
        { error: 'Product not found or has no subcategory' },
        { status: 404 }
      )
    }

    // Create new vote
    await prisma.productVote.create({
      data: {
        userEmail,
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

    // Get all products in the same subcategory only
    const subcategoryProducts = await prisma.product.findMany({
      where: {
        subcategory: product.subcategory
      },
      orderBy: [
        { votes: 'desc' },  // Primary sort by votes
        { reviewCount: 'desc' }  // Secondary sort by reviews
      ]
    })

    // Update ranks for all products in this subcategory
    // Use a more efficient approach to prevent timeouts
    if (subcategoryProducts.length > 0) {
      // Create a batch update using a single query with Prisma's $executeRawUnsafe
      const caseStatements = subcategoryProducts.map((p, index) => 
        `WHEN id = '${p.id}' THEN ${index + 1}`
      ).join(' ');
      
      const sql = `
        UPDATE "Product"
        SET "rank" = CASE
          ${caseStatements}
          ELSE 0
        END
        WHERE "subcategory" = '${product.subcategory}'
      `;
      
      await prisma.$executeRawUnsafe(sql);
    }

    // Get the updated product
    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

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