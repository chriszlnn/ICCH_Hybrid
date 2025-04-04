import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await auth()
  const { id } = await context.params
  console.log('GET /api/product/[id] - Params:', { id })
  
  try {
    console.log('Fetching product with ID:', id)
    // First, fetch the product data
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            author: true
          }
        },
        productLikes: true
      }
    })

    console.log('Product data:', product)

    if (!product) {
      console.log('Product not found')
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If user is not logged in, return product with hasVoted false
    if (!session?.user?.email) {
      console.log('User not logged in')
      return NextResponse.json({
        product,
        hasVoted: false
      })
    }

    // Find the most recent vote for this product by this user
    const vote = await prisma.productVote.findFirst({
      where: {
        productId: id,
        userEmail: session.user.email
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Vote data:', vote)

    if (!vote) {
      console.log('No vote found')
      return NextResponse.json({
        product,
        hasVoted: false
      })
    }

    // Check if the vote was within the last 7 days
    const voteDate = new Date(vote.createdAt)
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const hasVoted = voteDate > oneWeekAgo
    const nextVoteDate = hasVoted ? new Date(voteDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null

    console.log('Response data:', { product, hasVoted, nextVoteDate })

    return NextResponse.json({
      product,
      hasVoted,
      nextVoteDate
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await auth()
  const { id } = await context.params
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Validate product exists
    const productExists = await prisma.product.findUnique({
      where: { id }
    })
    if (!productExists) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check for recent votes
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const existingVote = await prisma.productVote.findFirst({
      where: {
        productId: id,
        userEmail: session.user.email,
        createdAt: {
          gt: oneWeekAgo
        }
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { 
          error: 'You have already voted for this product this week',
          nextVoteDate: new Date(existingVote.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
        },
        { status: 400 }
      )
    }

    // Create new vote and update product in transaction
    const [vote, updatedProduct] = await prisma.$transaction([
      prisma.productVote.create({
        data: {
          userEmail: session.user.email,
          productId: id
        }
      }),
      prisma.product.update({
        where: { id },
        data: {
          votes: { increment: 1 }
        },
        include: {
          reviews: {
            include: {
              author: true
            }
          },
          productLikes: true
        }
      })
    ])

    // Recalculate ranks
    const categoryProducts = await prisma.product.findMany({
      where: {
        category: productExists.category,
        subcategory: productExists.subcategory
      },
      orderBy: [
        { votes: 'desc' },
        { reviewCount: 'desc' }
      ]
    })

    await prisma.$transaction(
      categoryProducts.map((p, index) => 
        prisma.product.update({
          where: { id: p.id },
          data: { rank: index + 1 }
        })
      )
    )

    return NextResponse.json({ 
      success: true,
      product: updatedProduct,
      nextVoteDate: new Date(vote.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
    })
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}