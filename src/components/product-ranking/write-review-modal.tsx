"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Star, Send, Upload, X } from "lucide-react"
import type { Review } from "./types"

interface WriteReviewModalProps {
  productId: string
  onClose: () => void
  onReviewAdded: (review: Review) => void
}

export function WriteReviewModal({ productId, onClose, onReviewAdded }: WriteReviewModalProps) {
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    skinType: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewImage, setReviewImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const skinTypeOptions = [
    "Dry Skin",
    "Oily Skin",
    "Combination Skin",
    "Sensitive Skin",
    "Normal Skin",
    "Acne-Prone",
    "Aging Skin",
    "Dullness",
  ]

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleSkinTypeToggle = (type: string) => {
    if (newReview.skinType.includes(type)) {
      setNewReview({
        ...newReview,
        skinType: newReview.skinType.filter((t) => t !== type),
      })
    } else {
      setNewReview({
        ...newReview,
        skinType: [...newReview.skinType, type],
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    // Create a preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Store the file object
    setReviewImage(file)
  }

  const removeImage = () => {
    setPreviewImage(null)
    setReviewImage(null)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newReview.comment.trim()) {
      setError("Please enter a review comment")
      return
    }

    try {
      setIsSubmitting(true)

      // BACKEND INTEGRATION POINT:
      // In a real app, this would be an API call to save the review
      // For now, we'll create a mock review object to simulate the process
      const newReviewObj: Review = {
        id: `new-${Date.now()}`,
        userId: "current-user",
        username: "You",
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        skinType: newReview.skinType,
        image: previewImage,
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Pass the new review to the parent component
      onReviewAdded(newReviewObj)
    } catch (err) {
      console.error("Failed to submit review", err)
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Write a Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmitReview} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Rating</label>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="focus:outline-none mx-1 transition-transform hover:scale-110"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Your Skin Type (Optional)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skinTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSkinTypeToggle(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    newReview.skinType.includes(type)
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                  }`}
                  disabled={isSubmitting}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700 mb-2 font-medium">
              Your Review
            </label>
            <textarea
              id="comment"
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                error ? "border-red-500" : "border-gray-300"
              } transition-colors`}
              placeholder="Share your experience with this product..."
              disabled={isSubmitting}
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Add Photo (Optional)</label>

            {previewImage ? (
              <div className="relative w-32 h-32 mb-2">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Review"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mb-2">
                <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                    <span className="mt-2 block text-xs text-gray-500">Add Photo</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            )}
            <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG</p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

