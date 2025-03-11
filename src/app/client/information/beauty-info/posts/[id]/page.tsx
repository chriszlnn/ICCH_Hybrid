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

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  //const unwrappedParams = use(params); // ✅ Unwrap the Promise first
  //const postId = Number(unwrappedParams.id);

  const { id } = use(params);
  const postId = Number(id);


  const router = useRouter();
  const { data: session } = useSession();


  const [post, setPost] = useState<any>(null);
  const [likes, setLikes] = useState<number | null>(null); // Null until fully loaded
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isNaN(postId)) return;
  
      try {
        // Fetch post data first
        const postResponse = await fetch(`/api/posts/${postId}`);
        if (!postResponse.ok) throw new Error("Failed to fetch post");
        const postData = await postResponse.json();
        setPost(postData);
  
        // Fetch likes data after post data is fetched
        const likesResponse = await fetch(`/api/beauty-info/${postId}`);
        if (!likesResponse.ok) throw new Error("Failed to fetch likes");
        const likesData = await likesResponse.json();
        setLikes(likesData.likes);
        setLiked(likesData.userLiked);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [postId]);

  const handleLike = async () => {
    if (!post || !session?.user) return;

    const newLikedStatus = !liked;
    const newLikesCount = newLikedStatus ? (likes ?? 0) + 1 : (likes ?? 0) - 1;

    setLiked(newLikedStatus);
    setLikes(newLikesCount);

    try {
      const response = await fetch(`/api/beauty-info/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: newLikedStatus, userEmail: session.user.email }),
      });

      if (!response.ok) throw new Error("Failed to update like");
    } catch (error) {
      console.error("Error updating like:", error);
      setLiked(!newLikedStatus);
      setLikes(likes);
    }
  };

  //if (loading) return <div className="container mx-auto py-6 px-4 text-center">Loading post...</div>;
  if (error) return <div className="container mx-auto py-6 px-4 text-center text-red-500">Error: {error}</div>;
  //if (!post) return <div className="container mx-auto py-6 px-4 text-center">Post not found</div>;

  return (
    <main className="container max-w-2xl mx-auto py-6 px-4">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {loading ? (
        <BeautyPostSkeleton />
      ) : (
      <BeautyPost
        post={{ ...post, likes, liked }}
        onLike={handleLike}
        isDetailView={true}
        likesLoading={likes === null} // Pass loading state to child
      />
)}
    </main>
  );
}
