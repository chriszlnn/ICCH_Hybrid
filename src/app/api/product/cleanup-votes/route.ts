import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * POST /api/product/cleanup-votes
 * Cleans up expired votes (older than a week) and updates product vote counts
 */
export async function POST() {
  try {
    // Calculate date one week ago
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    console.log(`Cleaning up votes older than: ${oneWeekAgo.toISOString()}`)
    
    // Find expired votes grouped by product
    const expiredVotesGrouped = await prisma.productVote.groupBy({
      by: ['productId'],
      where: {
        createdAt: {
          lt: oneWeekAgo
        }
      },
      _count: {
        id: true
      }
    })
    
    console.log(`Found ${expiredVotesGrouped.length} products with expired votes`)
    
    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // For each product with expired votes
      for (const productVotes of expiredVotesGrouped) {
        const { productId, _count } = productVotes
        const expiredVotesCount = _count.id

        console.log(`Product ${productId} has ${expiredVotesCount} expired votes`)
        
        // Update product votes count
        await tx.product.update({
          where: { id: productId },
          data: {
            votes: {
              decrement: expiredVotesCount
            },
            reviewCount: {
              decrement: expiredVotesCount
            }
          }
        })
        
        // Delete expired votes for this product
        await tx.productVote.deleteMany({
          where: {
            productId,
            createdAt: {
              lt: oneWeekAgo
            }
          }
        })
      }
      
      // Count total expired votes
      const totalExpiredVotes = expiredVotesGrouped.reduce(
        (total, group) => total + group._count.id, 
        0
      )
      
      return {
        productsUpdated: expiredVotesGrouped.length,
        votesDeleted: totalExpiredVotes
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Expired votes cleanup completed successfully',
      result
    })
  } catch (error) {
    console.error('Error cleaning up expired votes:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to clean up expired votes',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 