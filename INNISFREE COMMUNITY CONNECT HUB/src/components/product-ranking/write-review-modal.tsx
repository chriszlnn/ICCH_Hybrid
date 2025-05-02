/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Star, Send, Upload, X } from "lucide-react"
import type { Review } from "./types"
import { useToast } from "../ui/toast/use-toast"
import { useUploadThing } from "@/lib/utils/uploadthing"

interface WriteReviewModalProps {
  productId: string
  onClose: () => void
  onReviewAdded: (review: Review) => void
}

export function WriteReviewModal({ productId, onClose, onReviewAdded }: WriteReviewModalProps) {
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: "",
    skinType: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewImages, setReviewImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const { toast } = useToast()
  const { startUpload: uploadThing } = useUploadThing("imageUploader")

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
    setNewReview(prev => ({
      ...prev,
      skinType: prev.skinType.includes(type)
        ? prev.skinType.filter(t => t !== type)
        : [...prev.skinType, type]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check total size (limit to 5MB per image)
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `${file.name} is too large (max 5MB)`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    // Limit to 3 images
    const filesToAdd = validFiles.slice(0, 3 - reviewImages.length)
    if (filesToAdd.length === 0) return

    // Create previews
    const newPreviews: string[] = []
    filesToAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        newPreviews.push(event.target?.result as string)
        if (newPreviews.length === filesToAdd.length) {
          setPreviewImages([...previewImages, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    // Store the file objects
    setReviewImages([...reviewImages, ...filesToAdd])
  }

  const removeImage = (index: number) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index))
    setReviewImages(reviewImages.filter((_, i) => i !== index))
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setIsSubmitting(true)

      // Upload images first using UploadThing
      let imageUrls: string[] = []
      if (reviewImages.length > 0) {
        try {
          const uploadResponse = await uploadThing(reviewImages)
          if (!uploadResponse || uploadResponse.length === 0) {
            throw new Error("Upload failed - no response from server")
          }
          imageUrls = uploadResponse.map(result => result.url)
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError)
          toast({
            title: "Error",
            description: "Failed to upload images. Please try again.",
            variant: "destructive",
          })
          return
        }
      }

      // Submit review data
      const response = await fetch(`/api/product/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newReview.rating,
          content: newReview.content.trim() || null,
          skinType: newReview.skinType,
          images: imageUrls,
        }),
      })

      // Parse the response body only once
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit review')
      }

      // Use the already parsed response data
      onReviewAdded(responseData)
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      })
      onClose()
    } catch (err) {
      console.error("Failed to submit review", err)
      setError(err instanceof Error ? err.message : "Failed to submit review. Please try again.")
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
            <label htmlFor="content" className="block text-gray-700 mb-2 font-medium">
              Your Review  (Optional)
            </label>
            <textarea
              id="content"
              rows={4}
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                error ? "border-red-500" : "border-gray-300"
              } transition-colors`}
              placeholder="Share your experience with this product..."
              disabled={isSubmitting}
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Add Photos (Optional)</label>

            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-1 -mr-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {previewImages.length < 3 && (
              <div className="mb-2">
                <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
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
                    multiple
                  />
                </label>
              </div>
            )}
            <p className="text-xs text-gray-500">Max 3 images, 5MB each. Supported formats: JPG, PNG</p>
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

