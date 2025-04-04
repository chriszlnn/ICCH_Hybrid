"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface ImagePopupProps {
  imageUrl: string
  onClose: () => void
}

export function ImagePopup({ imageUrl, onClose }: ImagePopupProps) {
  // Close on escape key
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={imageUrl}
          alt="Review"
          className="w-full h-full object-contain max-h-[90vh]"
        />
      </div>
    </div>
  )
} 