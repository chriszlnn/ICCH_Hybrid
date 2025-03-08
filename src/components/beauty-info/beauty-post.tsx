"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import ImageCarousel from "./image-carousel"
import type { BeautyPost } from "@/lib/types/types"
interface BeautyPostProps {
  post: BeautyPost
  onLike: () => void
  isDetailView?: boolean 
}

export default function BeautyPost({ post, onLike, isDetailView = false }: BeautyPostProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <ImageCarousel images={post.images} aspectRatio={isDetailView ? "auto" : "square"} />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 space-y-3">
        <div className="flex items-center w-full">
          <Button variant="ghost" size="icon" onClick={onLike} className={post.liked ? "text-red-500" : ""}>
            <Heart className={`w-6 h-6 ${post.liked ? "fill-current" : ""}`} />
            <span className="sr-only">Like</span>
          </Button>
          <span className="ml-2 text-sm font-medium">{post.likes} likes</span>
        </div>

        <h1 className="text-xl font-bold">{post.title}</h1>

        <div className="whitespace-pre-line text-sm">
          {post.body.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

