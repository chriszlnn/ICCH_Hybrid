import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userEmail = session.user.email
  const { productId } = params

  try {
    // Check if recommendation exists
    const existingRecommendation = await prisma.userRecommendation.findUnique({
      where: {
        userEmail_productId: {
          userEmail,
          productId
        }
      }
    })

    if (!existingRecommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      )
    }

    // Delete the recommendation
    await prisma.userRecommendation.delete({
      where: {
        userEmail_productId: {
          userEmail,
          productId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing recommendation:", error)
    return NextResponse.json(
      { error: "Failed to remove recommendation" },
      { status: 500 }
    )
  }
} 