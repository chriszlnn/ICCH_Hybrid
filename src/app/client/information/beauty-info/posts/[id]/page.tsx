"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import BeautyPost from "@/components/beauty-info/beauty-post"
import { BEAUTY_POSTS } from "@/lib/data"
import { useState } from "react"
import React from "react" // Import React to use React.use()

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()

  // Use React.use() to unwrap the params object
  const unwrappedParams = React.use(params)
  const postId = Number.parseInt(unwrappedParams.id)

  // Find the post with the matching ID
  const postData = BEAUTY_POSTS.find((post) => post.id === postId)

  const [post, setPost] = useState(postData ? { ...postData, liked: false } : null)

  if (!post) {
    return <div className="container mx-auto py-6 px-4 text-center">Post not found</div>
  }

  const handleLike = () => {
    setPost({
      ...post,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
      liked: !post.liked,
    })
  }

  return (
    <main className="container max-w-2xl mx-auto py-6 px-4">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <BeautyPost post={post} onLike={handleLike} isDetailView={true} />
    </main>
  )
}