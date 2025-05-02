import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json(
      { isLiked: false },
      { status: 200 }
    )
  }

  try {
    const id = (await params).id;
    const like = await prisma.productLike.findFirst({
      where: {
        productId: id,
        userEmail: session.user.email
      }
    })

    return NextResponse.json({
      isLiked: !!like
    })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json(
      { isLiked: false },
      { status: 200 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const id = (await params).id;
    // Check if like already exists
    const existingLike = await prisma.productLike.findFirst({
      where: {
        productId: id,
        userEmail: session.user.email
      }
    })

    if (existingLike) {
      // Unlike the product
      await prisma.productLike.delete({
        where: {
          id: existingLike.id
        }
      })

      // Decrement likes count
      await prisma.product.update({
        where: { id },
        data: {
          likes: {
            decrement: 1
          }
        }
      })

      return NextResponse.json({
        success: true,
        action: 'unliked'
      })
    } else {
      // Like the product
      await prisma.productLike.create({
        data: {
          productId: id,
          userEmail: session.user.email
        }
      })

      // Increment likes count
      await prisma.product.update({
        where: { id },
        data: {
          likes: {
            increment: 1
          }
        }
      })

      return NextResponse.json({
        success: true,
        action: 'liked'
      })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}