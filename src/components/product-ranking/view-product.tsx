"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, ArrowLeft, MessageSquare } from "lucide-react"
//import { mockProducts } from "./mock-data" // This will be replaced with API calls
import { ReviewSection } from "./review-section"
import { WriteReviewModal } from "./write-review-modal"
import { AnimatedHeart } from "../ui/animated-heart"
import { AddToRecommendationsButton } from "../product/add-to-recommendations-button"
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
import { toast } from "../ui/toast/use-toast"
//import { mockReviews } from "./review-data" // Import mock reviews

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
  const [nextVoteDate, setNextVoteDate] = useState<Date | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewCallbacks, setReviewCallbacks] = useState<((review: Review) => void)[]>([])
  const reviewSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch product details
        const productResponse = await fetch(`/api/product/${productId}`)
        if (!productResponse.ok) throw new Error('Failed to fetch product')
        const { product: productData, hasVoted: initialHasVoted, nextVoteDate: initialNextVoteDate } = await productResponse.json()
        if (!productData) throw new Error('Product data not found')
        setProduct(productData)
        setHasVoted(initialHasVoted)
        if (initialNextVoteDate) {
          setNextVoteDate(new Date(initialNextVoteDate))
        }
    
        // Fetch reviews
        const reviewsResponse = await fetch(`/api/product/${productId}/reviews`)
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews')
        setReviews(await reviewsResponse.json())
    
        // Check like status
        const likeResponse = await fetch(`/api/product/${productId}/like`)
        if (likeResponse.ok) setIsLiked((await likeResponse.json()).isLiked)
      } catch (err) {
        console.error('Error in fetchProductData:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [productId])


  // Get the week number for vote tracking
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // BACKEND INTEGRATION POINT:
  // Replace with API call to toggle product like status
  const toggleLike = async () => {
    try {
      const response = await fetch(`/api/product/${productId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        if (product) {
          setProduct({
            ...product,
            likes: isLiked ? product.likes - 1 : product.likes + 1
          })
        }
      } else {
        throw new Error('Failed to toggle like')
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    }
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
    setReviews([newReview, ...reviews])
    // Update product rating
    if (product) {
      const newTotal = (product.rating * product.reviewCount) + newReview.rating
      const newAverage = newTotal / (product.reviewCount + 1)
      setProduct({
        ...product,
        rating: newAverage,
        reviewCount: product.reviewCount + 1
      })
    }
    // Notify all review callbacks
    reviewCallbacks.forEach(callback => callback(newReview))
    closeReviewModal()

    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const subscribeToReviews = (callback: (review: Review) => void) => {
    setReviewCallbacks(prev => [...prev, callback])
    return () => {
      setReviewCallbacks(prev => prev.filter(cb => cb !== callback))
    }
  }

  const openVoteDialog = () => {
    setIsVoteDialogOpen(true)
  }

  const handleVote = async () => {
    try {
      const response = await fetch(`/api/product/${productId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      if (response.ok) {
        const { product: updatedProduct, nextVoteDate } = await response.json()
        
        setHasVoted(true)
        setIsVoteDialogOpen(false)
        setNextVoteDate(new Date(nextVoteDate))
        
        if (updatedProduct) {
          setProduct(updatedProduct)
        }
        
        toast({
          title: "Vote Submitted",
          description: "Thank you for your vote! You can vote again in 7 days.",
        })
      } else {
        const errorData = await response.json()
        if (errorData.nextVoteDate) {
          setNextVoteDate(new Date(errorData.nextVoteDate))
        }
        throw new Error(errorData.error || 'Failed to submit vote')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit vote",
        variant: "destructive",
      })
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
              <div className="text-sm text-green-600 font-medium mb-1">{product.subcategory || 'Uncategorized'}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name || 'Product Name Not Available'}</h1>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium text-gray-900">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                </div>
                <span className="mx-2 text-gray-500">({product.votes || 0} votes)</span>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Rank #{product.rank || 'N/A'}
                </div>
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="text-3xl font-bold text-gray-900 mb-6">RM{product.price ? product.price.toFixed(2) : '0.00'}</div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={openVoteDialog}
                    disabled={hasVoted}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {hasVoted ? 'Already Voted' : 'Vote for Product'}
                  </Button>
                  <AnimatedHeart 
                    isLiked={isLiked} 
                    onClick={toggleLike}
                    className={isLiked ? 'text-red-500' : ''}
                  />
                  <AddToRecommendationsButton productId={productId} />
                </div>
                {hasVoted && nextVoteDate && (
                  <div className="text-sm text-gray-500">
                    You can vote again on {nextVoteDate.toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center text-gray-700 hover:text-green-600"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <span>Write a Review</span>
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
                onReviewAdded={subscribeToReviews}
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

