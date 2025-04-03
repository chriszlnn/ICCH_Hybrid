import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/product/[id] - Get product details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id
      },
      include: {
        reviews: {
          include: {
            author: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        productLikes: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate rating
    const ratingSum = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = product.reviews.length > 0 ? ratingSum / product.reviews.length : 0

    return NextResponse.json({
      ...product,
      rating: avgRating,
      reviewCount: product.reviews.length,
      likes: product.productLikes.length
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}