"use client"

import { useState } from "react"
import { Star, ChevronRight } from "lucide-react"
import type { Review } from "./types"

interface ReviewSectionProps {
  productId: string
  productRating: number
  reviewCount: number
  onWriteReviewClick: () => void
  reviews: Review[] // Pass reviews directly as a prop
}

export function ReviewSection({
  productId,
  productRating,
  reviewCount,
  onWriteReviewClick,
  reviews,
}: ReviewSectionProps) {
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const toggleExpandReview = (reviewId: string) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null)
    } else {
      setExpandedReview(reviewId)
    }
  }

  const handleViewAllReviews = () => {
    setShowAllReviews(true)
  }

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0] // 1-5 stars
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++
    }
  })

  // Calculate percentages for each rating
  const totalReviews = reviews.length
  const ratingPercentages = ratingCounts
    .map((count) => (totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0))
    .reverse() // Reverse to get 5-star first

  // Determine how many reviews to show
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          <span className="text-green-600">{reviewCount}</span> Reviews
        </h2>
        <button
          onClick={onWriteReviewClick}
          className="text-green-600 text-sm font-medium hover:underline flex items-center"
        >
          Write a Review
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Average Rating Section - Now at the top */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6 transform transition-transform hover:scale-[1.01]">
        <h3 className="text-xl font-bold mb-4 text-center">Average Rating</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="text-5xl font-bold mr-3">{productRating.toFixed(1)}</div>
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${star <= Math.round(productRating) ? "fill-yellow-400" : "fill-gray-200"}`}
              />
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500 mb-4 text-center">{reviewCount} Reviews</div>

        {/* Rating Distribution */}
        <div className="space-y-2 max-w-md mx-auto">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="flex items-center">
              <span className="w-3 mr-2 text-sm">{rating}</span>
              <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full" style={{ width: `${ratingPercentages[index]}%` }}></div>
              </div>
              <span className="ml-2 text-xs text-gray-500 w-8">{ratingPercentages[index]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List - Now below the average rating */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm p-6">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div
          className={`space-y-3 ${showAllReviews ? "max-h-[600px] overflow-y-auto pr-2" : ""}`}
          style={{ scrollbarWidth: "thin" }}
        >
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              id={`review-${review.id}`}
              className="bg-white rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.username}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Skin Type Tags */}
              {review.skinType && review.skinType.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {review.skinType.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}

              {/* Review Image (if any) */}
              {review.image && (
                <div className="mb-2">
                  <img
                    src={review.image || "/placeholder.svg"}
                    alt="Review"
                    className="h-20 w-20 object-cover rounded-md cursor-pointer"
                    onClick={() => {
                      if (review.image) {
                        window.open(review.image, "_blank")
                      }
                    }}
                  />
                </div>
              )}

              {/* Review Content */}
              <div className={expandedReview === review.id ? "" : "line-clamp-3"}>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>

              {review.comment.length > 150 && (
                <button
                  onClick={() => toggleExpandReview(review.id)}
                  className="text-green-600 text-xs font-medium mt-2 hover:underline"
                >
                  {expandedReview === review.id ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!showAllReviews && reviews.length > 3 && (
        <button
          onClick={handleViewAllReviews}
          className="w-full py-3 mt-4 mb-4 border border-green-600 text-green-600 rounded-md flex items-center justify-center transition-colors hover:bg-green-50"
        >
          View All Reviews
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      )}
    </div>
  )
}

