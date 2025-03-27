"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import type { Review } from "../product-ranking/types"

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const [expandedReview, setExpandedReview] = useState<string | null>(null)

  const toggleExpandReview = (reviewId: string) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null)
    } else {
      setExpandedReview(reviewId)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Client Reviews</h3>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No reviews yet for this product.</div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
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

              {/* Review Image */}
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

              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{review.likes} likes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

