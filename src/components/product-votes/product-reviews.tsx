"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, Image as ImageIcon, X } from "lucide-react"
import type { Review } from "../product-ranking/types"
import { toast } from "sonner"

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/reviews?productId=${productId}`)
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setReviews(data.reviews)
      } catch (error) {
        console.error("Failed to fetch reviews", error)
        toast.error("Failed to fetch reviews")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  const handleImageClick = (image: string) => {
    setSelectedImage(image)
  }

  const closeImagePopup = () => {
    setSelectedImage(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Be the first to review this product and share your experience with others
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100">
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-white">
        <h3 className="text-lg font-medium flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
          Customer Reviews
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {reviews.map((review) => (
          <div key={review.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {review.author.client?.imageUrl ? (
                    <img
                      src={review.author.client.imageUrl}
                      alt={review.author.client.username || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : review.author.image ? (
                    <img
                      src={review.author.image}
                      alt={review.author.name || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {(review.author.client?.username || review.author.name || review.author.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.author.client?.username || review.author.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.content && <p className="mt-2 text-gray-700">{review.content}</p>}
                {review.images && review.images.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {review.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(image)}
                      >
                        <img src={image} alt={`Review image ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all">
                          <ImageIcon className="h-5 w-5 text-white opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {review.metadata?.skinType && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {review.metadata.skinType.map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={closeImagePopup}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Review image full size"
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

