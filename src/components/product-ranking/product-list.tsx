/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import type React from "react"
import { useState , useEffect} from "react"
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
import { useToast } from "../ui/toast/use-toast"

interface ProductListProps {
  products: Product[]
  initialLikedProductIds: string[]
  onVoteSuccess: (data: { updatedProduct: Product }) => void
}

export function ProductList({ products, initialLikedProductIds, onVoteSuccess }: ProductListProps) {
  const [likedProducts, setLikedProducts] = useState<string[]>(initialLikedProductIds)
  const [votedProducts, setVotedProducts] = useState<string[]>([])
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [productsState, setProducts] = useState<Product[]>([])
  const router = useRouter()
  const { toast } = useToast()


  useEffect(() => {
    const fetchVotedProducts = async () => {
      try {
        const response = await fetch('/api/product/vote');
        if (response.ok) {
          const data = await response.json();
          setVotedProducts(data.map((v: { productId: string }) => v.productId));
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your voting history",
          variant: "destructive",
        });
      }
    };
    
    fetchVotedProducts();
  }, [toast]);

  const toggleLike = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()
    
    // Optimistic update
    const wasLiked = likedProducts.includes(productId)
    setLikedProducts(prev => 
      wasLiked 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    )

    try {
      const response = await fetch('/api/product/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })
      
      if (!response.ok) {
        // Revert if API call fails
        setLikedProducts(prev => 
          wasLiked 
            ? [...prev, productId] 
            : prev.filter(id => id !== productId)
        )
        throw new Error('Failed to toggle like')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
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
  
    setIsVoting(true)
    try {
      const response = await fetch('/api/product/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: selectedProduct.id })
      })
  
      if (response.ok) {
        const data = await response.json()
        setVotedProducts([...votedProducts, selectedProduct.id])
        
        // Pass the full updated product
        onVoteSuccess({
          updatedProduct: data.product
        })
        
        setIsVoteDialogOpen(false)
        setSelectedProduct(null)
        toast({
          title: "Vote Submitted",
          description: "Thank you for your vote! You can vote again next week.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Vote Failed",
          description: errorData.error || "Failed to submit your vote.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Failed to submit vote', error)
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  // In your ProductList component, modify the getRankBadge function:
const getRankBadge = (rank?: number) => {
  if (!rank) return null // Don't show badge if no rank
  
  const colors = {
    1: "bg-amber-400 text-white",
    2: "bg-gray-300 text-gray-800",
    3: "bg-amber-700 text-white",
  }

  const badgeColor = rank <= 3 ? colors[rank as keyof typeof colors] : "bg-gray-200 text-gray-700"

  return (
    <div className={`absolute top-3 left-3 ${badgeColor} rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md z-10`}>
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
                <span className="text-sm text-gray-600">{product.votes} votes</span>
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

