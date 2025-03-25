"use client"

import type React from "react"
import { useState } from "react"
import { Star, Heart, ArrowUp } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product } from "./types"

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const [likedProducts, setLikedProducts] = useState<string[]>([])
  const [votedProducts, setVotedProducts] = useState<string[]>([])
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const router = useRouter()

  const toggleLike = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation() // Prevent navigation when clicking the like button
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter((id) => id !== productId))
    } else {
      setLikedProducts([...likedProducts, productId])
    }
  }

  const navigateToProductDetail = (productId: string) => {
    router.push(`/client/rank/product/${productId}`)
  }

  const openVoteDialog = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedProduct(product)
    setIsVoteDialogOpen(true)
  }

  const handleVote = async () => {
    if (!selectedProduct) return

    try {
      // BACKEND INTEGRATION POINT:
      // Replace with actual API call to submit vote
      // Example:
      // await fetch(`/api/products/${selectedProduct.id}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // })

      // Add to voted products (only in session state, not localStorage)
      setVotedProducts([...votedProducts, selectedProduct.id])

      // Close dialog
      setIsVoteDialogOpen(false)
      setSelectedProduct(null)

      // Show success message
      alert("Thank you for your vote! Your vote has been recorded.")
    } catch (error) {
      console.error("Failed to submit vote", error)
      alert("Failed to submit your vote. Please try again.")
    }
  }

  const getRankBadge = (rank: number) => {
    const colors = {
      1: "bg-amber-400 text-white", // Gold
      2: "bg-gray-300 text-gray-800", // Silver
      3: "bg-amber-700 text-white", // Bronze
      default: "bg-gray-200 text-gray-700", // Default for ranks > 3
    }

    const badgeColor = rank <= 3 ? colors[rank as 1 | 2 | 3] : colors.default

    return (
      <div
        className={`absolute top-3 left-3 ${badgeColor} rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md z-10`}
      >
        #{rank}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        No products found matching your criteria.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigateToProductDetail(product.id)}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg?height=300&width=400"}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              {getRankBadge(product.rank)}
              <button
                onClick={(e) => toggleLike(e, product.id)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md text-gray-400 hover:text-red-500 focus:outline-none transition-colors z-10"
                aria-label={likedProducts.includes(product.id) ? "Unlike" : "Like"}
              >
                <Heart className={`h-5 w-5 ${likedProducts.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            <div className="p-4">
              <div className="text-sm text-green-600 font-medium mb-1">{product.subcategory}</div>
              <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{product.rating.toFixed(1)}</span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-600">{product.reviewCount} votes</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>{product.reviewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg mr-4">RM{product.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => openVoteDialog(e, product)}
                    className={`px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors ${
                      votedProducts.includes(product.id) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={votedProducts.includes(product.id)}
                  >
                    {votedProducts.includes(product.id) ? "Voted" : "Vote"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vote Confirmation Dialog */}
      <Dialog open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              You are about to vote for {selectedProduct?.name}. This action cannot be undone and you can only vote once
              per week.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-3">
            <div className="bg-gray-100 p-2 rounded-md">
              <img
                src={selectedProduct?.image || "/placeholder.svg?height=100&width=100"}
                alt={selectedProduct?.name}
                className="w-16 h-16 object-cover rounded"
              />
            </div>
            <div>
              <p className="font-medium">{selectedProduct?.name}</p>
              <p className="text-sm text-gray-500">{selectedProduct?.subcategory}</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsVoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVote} className="bg-green-600 hover:bg-green-700 text-white">
              Confirm Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

