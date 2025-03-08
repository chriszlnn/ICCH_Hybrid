"use client"

import { useState } from "react"
import BeautyPostPreview from "./beauty-post-preview"
import { BEAUTY_POSTS } from "@/lib/data"

export default function BeautyPostsGrid() {
  const [posts, setPosts] = useState(
    BEAUTY_POSTS.map((post) => ({
      ...post,
      liked: false,
    })),
  )

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          }
        }
        return post
      }),
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {posts.map((post) => (
        <BeautyPostPreview key={post.id} post={post} onLike={() => handleLike(post.id)} />
      ))}
    </div>
  )
}

