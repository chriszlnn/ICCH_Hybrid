import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const id = (await params).id;
      const reviews = await prisma.review.findMany({
        where: {
          productId: id
        },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
  
      return NextResponse.json(reviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }
  }

  export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const session = await auth()
    console.log("Session in reviews API:", JSON.stringify(session, null, 2))
    
    // Check for user email instead of ID, as that's what we have in the session
    if (!session?.user?.email) {
      console.log("Unauthorized: No user email in session")
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  
    try {
      const id = (await params).id;
      
      // Parse JSON data from request body
      const { rating, content, skinType, images } = await request.json();

      // Validate input
      if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Invalid rating' },
          { status: 400 }
        )
      }
  
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (!user) {
        console.log("Unauthorized: User not found in database")
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      }
  
      // Create the review
      const review = await prisma.review.create({
        data: {
          rating,
          content: content || null,
          images: images || [],
          authorId: user.id,
          productId: id,
          metadata: {
            skinType: skinType || []
          }
        },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              image: true
            }
          }
        }
      })
  
      // Update product review count and rating
      await updateProductReviewStats(id)
  
      return NextResponse.json(review)
    } catch (error) {
      console.error('Error creating review:', error)
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      )
    }
  }

  async function updateProductReviewStats(productId: string) {
    // Get all reviews for this product
    const reviews = await prisma.review.findMany({
      where: { productId }
    })
  
    // Calculate new average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0
  
    // Update the product
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length
      }
    })
  }