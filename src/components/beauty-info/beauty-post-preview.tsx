"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import type { BeautyPost } from "@/lib/types/types"

interface BeautyPostPreviewProps {
  post: BeautyPost
  onLike: () => void
}

export default function BeautyPostPreview({ post, onLike }: BeautyPostPreviewProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/client/information/beauty-info/posts/${post.id}`} className="flex-1">
        <CardContent className="p-0 relative aspect-square">
          <Image
            src={post.images[0] || "/placeholder.svg"}
            alt="Beauty post preview"
            fill
            className="object-cover"
            priority
          />
        </CardContent>
      </Link>
      <CardFooter className="flex flex-col items-start p-2 space-y-1">
        <Link href={`/client/information/beauty-info/posts/${post.id}`} className="hover:underline">
          <h2 className="font-medium text-xs line-clamp-1">{post.title}</h2>
        </Link>
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`px-1 ${post.liked ? "text-red-500" : ""}`}
            onClick={(e) => {
              e.preventDefault()
              onLike()
            }}
          >
            <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
            <span className="sr-only">Like</span>
          </Button>
          <span className="text-xs font-medium">{post.likes}</span>
        </div>
      </CardFooter>
    </Card>
  )
}