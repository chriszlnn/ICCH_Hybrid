// app/api/product/like/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

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
    
    // Check if like already exists
    const existingLike = await prisma.productLike.findFirst({
      where: {
        userEmail: session.user.email,
        productId
      }
    })

    if (existingLike) {
      // Unlike the product
      await prisma.productLike.delete({
        where: { id: existingLike.id }
      })

      // Update product like count
      await prisma.product.update({
        where: { id: productId },
        data: { likes: { decrement: 1 } }
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like the product
      await prisma.productLike.create({
        data: {
          userEmail: session.user.email,
          productId
        }
      })

      // Update product like count
      await prisma.product.update({
        where: { id: productId },
        data: { likes: { increment: 1 } }
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling product like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle product like' },
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
      const likedProducts = await prisma.productLike.findMany({
        where: {
          userEmail: session.user.email
        },
        select: {
          productId: true
        }
      })
  
      return NextResponse.json(likedProducts)
    } catch (error) {
      console.error('Error fetching liked products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch liked products' },
        { status: 500 }
      )
    }
  }