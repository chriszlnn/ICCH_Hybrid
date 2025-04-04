"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedHeartProps {
  isLiked: boolean
  onClick: () => void
  className?: string
  size?: number
}

export function AnimatedHeart({ isLiked, onClick, className, size = 24 }: AnimatedHeartProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [localIsLiked, setLocalIsLiked] = useState(isLiked)

  // Update local state when prop changes
  useEffect(() => {
    setLocalIsLiked(isLiked)
  }, [isLiked])

  const handleClick = () => {
    // Start animation
    setIsAnimating(true)
    
    // Update local state immediately for responsive UI
    setLocalIsLiked(!localIsLiked)
    
    // Call the parent's onClick handler
    onClick()
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 700) // Match this with the animation duration
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors",
        isAnimating && "scale-110",
        className
      )}
      aria-label={localIsLiked ? "Unlike" : "Like"}
    >
      <Heart 
        className={cn(
          "transition-all duration-300",
          localIsLiked ? "fill-red-500 text-red-500" : "text-gray-400",
          isAnimating && "scale-110"
        )}
        style={{ width: size, height: size }}
      />
    </button>
  )
} 