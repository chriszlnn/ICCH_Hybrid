/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import BeautyPost from "@/components/beauty-info/beauty-post";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import BeautyPostSkeleton from "@/components/beauty-info/BeautyPostSkeleton";
import useSWR from "swr";

interface PostData {
  id: number;
  title: string;
  images: string[];
  file: string;
  likes: number;
  userLiked: boolean;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<PostData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
};

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postId = Number(id);
  const router = useRouter();
  const { data: session } = useSession();

  // Use SWR for data fetching with caching
  const { data: post, error, mutate } = useSWR<PostData>(
    `/api/posts/${postId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 30000, // Refresh every 30 seconds
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  const handleLike = async () => {
    if (!post || !session?.user?.email) return;

    const newLikedStatus = !post.userLiked;
    const newLikesCount = newLikedStatus ? post.likes + 1 : post.likes - 1;

    // Optimistically update the UI
    mutate({ ...post, likes: newLikesCount, userLiked: newLikedStatus }, false);

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
  };

  if (error) return <div className="container mx-auto py-6 px-4 text-center text-red-500">Error: {error.message}</div>;
  if (!post) return <BeautyPostSkeleton />;

  return (
    <div className="container mx-auto py-6 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <BeautyPost
        post={post}
        isDetailView
        onLike={handleLike}
        likesLoading={false}
      />
    </div>
  );
}
