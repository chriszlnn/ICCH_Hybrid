/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BeautyPostPreview from "./beauty-post-preview";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useCallback, useState, useEffect, useRef } from "react";
import { revalidateBeautyPost, revalidateAllBeautyPosts } from "@/lib/cache-utils";
import { usePathname } from "next/navigation";

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [likesLoadingMap, setLikesLoadingMap] = useState<Record<number, boolean>>({});
  const [isRefreshingLikes, setIsRefreshingLikes] = useState(false);
  const pathname = usePathname();
  const isNavigatingBack = useRef(false);
  const previousPathname = useRef<string | null>(null);
  
  // Use SWR for data fetching with caching
  const { data: posts, error, mutate } = useSWR<BeautyPost[]>(
    session ? "/api/beauty-info" : null,
    fetcher,
    {
      revalidateOnFocus: true, // Enable revalidation on focus
      revalidateOnReconnect: true, // Enable revalidation on reconnect
      refreshInterval: 60000, // Refresh every 60 seconds
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
      keepPreviousData: true, // Keep showing old data while fetching
      revalidateIfStale: true,
      revalidateOnMount: true,
      suspense: false, // Disable suspense mode
      onSuccess: () => {
        setIsInitialLoading(false);
        // If we were refreshing likes, reset the state
        if (isRefreshingLikes) {
          setIsRefreshingLikes(false);
        }
      },
      onError: () => {
        setIsInitialLoading(false);
        // If we were refreshing likes, reset the state
        if (isRefreshingLikes) {
          setIsRefreshingLikes(false);
        }
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
  }, [mutate]);

  // Add effect to revalidate when navigating back to this page
  useEffect(() => {
    // Check if we're on the beauty-info page
    if (pathname === '/client/information/beauty-info') {
      // Check if we're navigating back from an individual post
      const isComingFromPost = previousPathname.current?.includes('/client/information/beauty-info/posts/') || 
                               sessionStorage.getItem('navigatingBackFromPost') === 'true';
      
      if (isComingFromPost) {
        // Set flag to indicate we're navigating back
        isNavigatingBack.current = true;
        
        // Set refreshing likes state to show loading indicators
        setIsRefreshingLikes(true);
        
        // Set all posts to loading state
        if (posts) {
          const newLikesLoadingMap: Record<number, boolean> = {};
          posts.forEach(post => {
            newLikesLoadingMap[post.id] = true;
          });
          setLikesLoadingMap(newLikesLoadingMap);
        }
        
        // Revalidate all beauty posts when navigating back to this page
        revalidateAllBeautyPosts();
        
        // Reset the flag after a short delay
        setTimeout(() => {
          isNavigatingBack.current = false;
          // Clear the sessionStorage flag
          sessionStorage.removeItem('navigatingBackFromPost');
        }, 1000);
      }
      
      // Update previous pathname
      previousPathname.current = pathname;
    }
  }, [pathname, posts]);

  // Add effect to initialize likesLoadingMap when posts are loaded
  useEffect(() => {
    if (posts) {
      // Initialize likesLoadingMap with all posts set to false
      const initialLikesLoadingMap: Record<number, boolean> = {};
      posts.forEach(post => {
        initialLikesLoadingMap[post.id] = false;
      });
      setLikesLoadingMap(initialLikesLoadingMap);
    }
  }, [posts]);

  // Memoize the like handler
  const handleLike = useCallback(async (postId: number) => {
    if (!session?.user?.email || !posts) return;

    const post = posts.find((p: BeautyPost) => p.id === postId);
    if (!post) return;

    // Set loading state for this specific post
    setLikesLoadingMap(prev => ({ ...prev, [postId]: true }));

    const newLikedStatus = !post.userLiked;
    const newLikesCount = newLikedStatus ? post.likes + 1 : post.likes - 1;

    // Store the original posts array in case we need to revert
    const originalPosts = [...posts];

    // Optimistically update the UI immediately
    const updatedPosts = posts.map((p: BeautyPost) =>
      p.id === postId
        ? { ...p, likes: newLikesCount, userLiked: newLikedStatus }
        : p
    );
    mutate(updatedPosts, false);

    try {
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
      
      // Update with the server's response to ensure consistency
      const serverUpdatedPosts = posts.map((p: BeautyPost) =>
        p.id === postId
          ? { ...p, likes: responseData.likes, userLiked: responseData.liked }
          : p
      );
      
      // Force a revalidation to ensure we have the latest data
      await revalidateBeautyPost(postId);
      
      // Update the UI with the server response
      mutate(serverUpdatedPosts, false);
      
      // Log the response for debugging
      console.log('Like response:', responseData);
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert the optimistic update on error
      mutate(originalPosts, false);
    } finally {
      // Clear loading state for this post
      setLikesLoadingMap(prev => ({ ...prev, [postId]: false }));
    }
  }, [posts, session, mutate]);

  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {isInitialLoading || !posts ? (
        // Show skeleton placeholders while loading
        Array.from({ length: 10 }).map((_, index) => (
          <BeautyPostPreview key={`skeleton-${index}`} isLoading={true} />
        ))
      ) : (
        // Show actual posts when loaded
        posts.map((post: BeautyPost) => (
          <BeautyPostPreview
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            likesLoading={likesLoadingMap[post.id] || isRefreshingLikes}
          />
        ))
      )}
    </div>
  );
}