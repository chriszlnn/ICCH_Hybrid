"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, Heart, ArrowLeft, MessageSquare } from "lucide-react"
import { mockProducts } from "./mock-data" // This will be replaced with API calls
import { ReviewSection } from "./review-section"
import { WriteReviewModal } from "./write-review-modal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product, Review } from "./types"
import { mockReviews } from "./review-data" // Import mock reviews

export function ViewProduct() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const reviewSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // BACKEND INTEGRATION POINT:
    // Replace this with an API call to fetch product details
    const fetchProduct = async () => {
      try {
        setIsLoading(true)

        // Mock data fetch - replace with actual API call
        // Example: const response = await fetch(`/api/products/${productId}`)
        // const data = await response.json()
        const foundProduct = mockProducts.find((p) => p.id === productId)

        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          setError("Product not found")
        }

        // Fetch reviews for this product
        const productReviews = mockReviews[productId] || []
        setReviews(productReviews)
      } catch (err) {
        setError("Failed to load product")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()

    // Reset hasVoted state on each page load
    setHasVoted(false)
  }, [productId])

  // Get the week number for vote tracking
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // BACKEND INTEGRATION POINT:
  // Replace with API call to toggle product like status
  const toggleLike = async () => {
    // Example API call:
    // await fetch(`/api/products/${productId}/like`, {
    //   method: 'POST',
    //   body: JSON.stringify({ liked: !isLiked }),
    //   headers: { 'Content-Type': 'application/json' }
    // })

    setIsLiked(!isLiked)
  }

  const handleGoBack = () => {
    router.back()
  }

  const openReviewModal = () => {
    setIsReviewModalOpen(true)
  }

  const closeReviewModal = () => {
    setIsReviewModalOpen(false)
  }

  const handleAddReview = (newReview: Review) => {
    // Add the new review to the reviews array
    setReviews([newReview, ...reviews])
    closeReviewModal()

    // Scroll to review section
    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openVoteDialog = () => {
    setIsVoteDialogOpen(true)
  }

  const handleVote = async () => {
    try {
      // BACKEND INTEGRATION POINT:
      // Replace with actual API call to submit vote
      // Example:
      // await fetch(`/api/products/${productId}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // })

      // Update state (but don't store in localStorage)
      setHasVoted(true)

      // Close dialog
      setIsVoteDialogOpen(false)

      // Show success message
      alert("Thank you for your vote! Your vote has been recorded.")
    } catch (error) {
      console.error("Failed to submit vote", error)
      alert("Failed to submit your vote. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <button onClick={handleGoBack} className="px-4 py-2 bg-green-600 text-white rounded-md">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <button onClick={handleGoBack} className="flex items-center text-gray-700 hover:text-green-600">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        {/* Left Side - Product Image */}
        <div className="md:w-1/2 p-4 md:sticky md:top-20 md:self-start max-h-[calc(100vh-5rem)] overflow-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={product.image || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Side - Product Details & Reviews (Scrollable) */}
        <div className="md:w-1/2 p-4 overflow-auto">
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-green-600 font-medium mb-1">{product.subcategory}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium text-gray-900">{product.rating.toFixed(1)}</span>
                </div>
                <span className="mx-2 text-gray-500">({product.reviewCount} votes)</span>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Rank #{product.rank}
                </div>
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="text-3xl font-bold text-gray-900 mb-6">RM{product.price.toFixed(2)}</div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={openVoteDialog}
                  disabled={hasVoted}
                  className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-colors ${
                    hasVoted ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {hasVoted ? "Voted" : "Vote"}
                </button>
                <button
                  onClick={toggleLike}
                  className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div ref={reviewSectionRef}>
              <ReviewSection
                productId={productId}
                productRating={product.rating}
                reviewCount={product.reviewCount}
                onWriteReviewClick={openReviewModal}
                reviews={reviews}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Write Review Button (Mobile Only) - Moved up to avoid being cropped */}
      <div className="md:hidden fixed bottom-20 right-6">
        <button
          onClick={openReviewModal}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <WriteReviewModal productId={productId} onClose={closeReviewModal} onReviewAdded={handleAddReview} />
      )}

      {/* Vote Confirmation Dialog */}
      <Dialog open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              You are about to vote for {product.name}. This action cannot be undone and you can only vote once per
              week.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-3">
            <div className="bg-gray-100 p-2 rounded-md">
              <img
                src={product.image || "/placeholder.svg?height=100&width=100"}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
            </div>
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">{product.subcategory}</p>
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
    </div>
  )
}

