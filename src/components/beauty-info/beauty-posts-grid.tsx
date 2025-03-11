/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import BeautyPostPreview from "./beauty-post-preview";
import { useSession } from "next-auth/react";
import BeautyPostPreviewSkeleton from "./BeautyPostPreviewSkeleton";

export default function BeautyPostsGrid() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/beauty-info");
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        console.log("API Response:", data); // Log the API response
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPosts();
    }
  }, [session]);

  const handleLike = async (postId: number) => {
    const post = posts.find((post) => post.id === postId);
    if (!post) return;
  
    // Calculate the new liked status and likes count
    const newLikedStatus = !post.userLiked; // Use userLiked instead of liked
    const newLikesCount = newLikedStatus ? post.likes + 1 : post.likes - 1;
  
    // Optimistically update the local state
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: newLikesCount, userLiked: newLikedStatus }
          : post
      )
    );
  
    // Sync with the backend
    try {
      const response = await fetch(`/api/beauty-info/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: newLikedStatus, userEmail: session?.user?.email }),
      });
  
      if (!response.ok) throw new Error("Failed to update like");
  
      // Optionally, refetch posts to ensure the backend and frontend are in sync
      const updatedResponse = await fetch("/api/beauty-info");
      if (!updatedResponse.ok) throw new Error("Failed to fetch updated posts");
      const updatedData = await updatedResponse.json();
      setPosts(updatedData);
    } catch (error) {
      console.error("Error updating like:", error);
  
      // Revert the local state if the API call fails
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: post.likes, userLiked: post.userLiked }
            : post
        )
      );
    }
  };

  
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
    {loading && <BeautyPostPreviewSkeleton />}
    {!loading && posts.map((post) => (
      <BeautyPostPreview
        key={post.id}
        post={post}
        onLike={() => handleLike(post.id)}
      />
    ))}
    </div>
  );
}