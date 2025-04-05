/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BeautyPostPreview from "./beauty-post-preview";
import { useSession } from "next-auth/react";
import BeautyPostPreviewSkeleton from "./BeautyPostPreviewSkeleton";
import useSWR from "swr";
import { useCallback } from "react";

interface BeautyPost {
  id: number;
  title: string;
  images: string[];
  file: string;
  likes: number;
  userLiked: boolean;
  userId?: string;
  email?: string;
  username?: string;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<BeautyPost[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

export default function BeautyPostsGrid() {
  const { data: session } = useSession();
  
  // Use SWR for data fetching with caching
  const { data: posts, error, mutate } = useSWR<BeautyPost[]>(
    session ? "/api/beauty-info" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 30000, // Refresh every 30 seconds
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  // Memoize the like handler
  const handleLike = useCallback(async (postId: number) => {
    if (!session?.user?.email || !posts) return;

    const post = posts.find((p: BeautyPost) => p.id === postId);
    if (!post) return;

    const newLikedStatus = !post.userLiked;
    const newLikesCount = newLikedStatus ? post.likes + 1 : post.likes - 1;

    // Optimistically update the UI
    const updatedPosts = posts.map((p: BeautyPost) =>
      p.id === postId
        ? { ...p, likes: newLikesCount, userLiked: newLikedStatus }
        : p
    );
    mutate(updatedPosts, false); // Update UI immediately without revalidation

    try {
      const response = await fetch(`/api/beauty-info/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: newLikedStatus, userEmail: session.user.email }),
      });

      if (!response.ok) throw new Error("Failed to update like");

      // Revalidate the data to ensure consistency
      mutate();
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert the optimistic update on error
      mutate();
    }
  }, [posts, session, mutate]);

  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {!posts && <BeautyPostPreviewSkeleton />}
      {posts?.map((post: BeautyPost) => (
        <BeautyPostPreview
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
        />
      ))}
    </div>
  );
}