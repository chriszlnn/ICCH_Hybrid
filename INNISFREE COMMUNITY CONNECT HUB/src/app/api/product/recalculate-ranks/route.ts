import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST() {
  const session = await auth()
  
  // Only allow admin users to recalculate ranks
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Get all unique category-subcategory combinations
    const categorySubcategories = await prisma.product.findMany({
      select: {
        category: true,
        subcategory: true
      },
      distinct: ['category', 'subcategory'],
      where: {
        category: { not: '' },
        subcategory: { not: '' }
      }
    })

    // For each category-subcategory combination, recalculate ranks
    for (const { category, subcategory } of categorySubcategories) {
      if (!category || !subcategory) continue

      // Get all products in this category-subcategory combination
      const products = await prisma.product.findMany({
        where: {
          category: category,
          subcategory: subcategory
        },
        orderBy: [
          { votes: 'desc' },
          { reviewCount: 'desc' },
          { createdAt: 'desc' }
        ]
      })

      // Update ranks for products in this category-subcategory combination
      const updatePromises = products.map((product, index) => 
        prisma.product.update({
          where: { id: product.id },
          data: { rank: index + 1 } // 1-based ranking
        })
      )

      await Promise.all(updatePromises)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Ranks recalculated for all category-subcategory combinations'
    })
  } catch (error) {
    console.error('Error recalculating ranks:', error)
    return NextResponse.json(
      { error: 'Failed to recalculate ranks' },
      { status: 500 }
    )
  }
} 