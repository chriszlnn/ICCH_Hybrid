"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/utils"

interface ImageCarouselProps {
  images: string[]
  aspectRatio?: "square" | "auto"
}

export default function ImageCarousel({ images, aspectRatio = "square" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasMultipleImages = images.length > 1

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1
    const newIndex = isLastImage ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  return (
    <div className={cn("relative w-full", aspectRatio === "square" ? "aspect-square" : "max-h-[80vh]")}>
      <Image
        src={images[currentIndex] || "/placeholder.svg"}
        alt="Beauty post image"
        fill={aspectRatio === "square"}
        width={aspectRatio === "auto" ? 1200 : undefined}
        height={aspectRatio === "auto" ? 800 : undefined}
        className={cn(
          "object-cover transition-opacity duration-300",
          aspectRatio === "auto" && "w-full h-auto max-h-[80vh] relative"
        )}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={90}
        loading="eager"
      />

      {hasMultipleImages && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 rounded-full p-1"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous image</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 rounded-full p-1"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next image</span>
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${currentIndex === index ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

