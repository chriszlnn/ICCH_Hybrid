/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import BeautyPost from "@/components/beauty-info/beauty-post";
import { use, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import type { BeautyPost as BeautyPostType } from "@/lib/types/types";
import { revalidateBeautyPost, revalidateAllBeautyPosts } from "@/lib/cache-utils";

// Use the BeautyPost type from our types file
type PostData = BeautyPostType;

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
  const [likesLoading, setLikesLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Use SWR for data fetching with caching
  const { data: post, error, mutate } = useSWR<PostData>(
    `/api/beauty-info/${postId}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // Refresh every 60 seconds
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
      keepPreviousData: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
      suspense: false,
      onSuccess: () => {
        setIsInitialLoading(false);
      },
      onError: () => {
        setIsInitialLoading(false);
      }
    }
  );

  // Add effect to revalidate data when component mounts or becomes visible
  useEffect(() => {
    // Revalidate data when component mounts
    mutate();
    
    // Set up visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        mutate();
      }
    };
    
    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mutate, postId]);

  const handleLike = async () => {
    if (!session?.user?.email || !post) return;

    // Set loading state immediately
    setLikesLoading(true);
    
    // Calculate new values
    const newLikedStatus = !post.userLiked;
    const newLikesCount = newLikedStatus ? post.likes + 1 : post.likes - 1;

    // Store the original post in case we need to revert
    const originalPost = { ...post };

    // Optimistically update the UI immediately
    const updatedPost = {
      ...post,
      likes: newLikesCount,
      userLiked: newLikedStatus,
    };
    
    // Update UI immediately without waiting for server
    mutate(updatedPost, false);

    try {
      // Make API request
      const response = await fetch(`/api/beauty-info/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: newLikedStatus, userEmail: session.user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      // Get the actual response data
      const responseData = await response.json();
      
      // Log the response for debugging
      console.log('Like response:', responseData);
      
      // Force a revalidation to ensure we have the latest data
      await revalidateBeautyPost(postId);
      
      // Update with the server's response to ensure consistency
      const serverUpdatedPost = {
        ...post,
        likes: responseData.likes,
        userLiked: responseData.liked,
      };
      
      // Update UI with server response
      mutate(serverUpdatedPost, false);
      
      // Also revalidate the posts list to ensure grid view is updated
      await revalidateAllBeautyPosts();
      
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert the optimistic update on error
      mutate(originalPost, false);
    } finally {
      // Always set loading to false when done
      setLikesLoading(false);
    }
  };

  // Handle back navigation with preloading
  const handleBackNavigation = useCallback(() => {
    // Set a flag in sessionStorage to indicate we're navigating back from a post
    sessionStorage.setItem('navigatingBackFromPost', 'true');
    
    // Pre-validate the beauty posts grid before navigation
    revalidateAllBeautyPosts();
    
    // Navigate back
    router.back();
  }, [router]);

  if (error) return <div className="container mx-auto py-6 px-4 text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6 px-4 pb-12">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={handleBackNavigation}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <BeautyPost
        post={post}
        isDetailView
        onLike={handleLike}
        likesLoading={likesLoading}
        isLoading={isInitialLoading}
      />
    </div>
  );
}
