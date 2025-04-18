import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import ImageCarousel from "./image-carousel";
import type { BeautyPost as BeautyPostType } from "@/lib/types/types";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface BeautyPostProps {
  post?: BeautyPostType;
  isDetailView?: boolean;
  onLike?: () => void;
  likesLoading?: boolean;
  isLoading?: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const BeautyPost = memo(function BeautyPost({ 
  post, 
  isDetailView = false, 
  onLike, 
  likesLoading = false,
  isLoading = false
}: BeautyPostProps) {
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);

  // Reset content loading state when post changes
  useEffect(() => {
    setIsLoadingContent(true);
    setMarkdownContent(null);
  }, [post?.id]);

  // Add a key to force re-render when like status changes
  useEffect(() => {
    // This effect will run when post.userLiked or post.likes changes
    console.log("Like status changed:", post?.userLiked, post?.likes);
  }, [post?.userLiked, post?.likes]);

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (!post?.file) {
        setIsLoadingContent(false);
        return;
      }

      try {
        setIsLoadingContent(true);
        const response = await fetch(post.file);
        if (!response.ok) throw new Error("Failed to fetch markdown content");
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error("Error fetching markdown:", error);
        setMarkdownContent(null);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchMarkdown();
  }, [post?.file]);

  // If loading or no post data, show skeleton
  if (isLoading || !post) {
    return (
      <Card className="overflow-hidden max-w-xl mx-auto">
        <CardContent className="p-0">
          {/* Image Carousel Skeleton */}
          <Skeleton className="aspect-square w-full" />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 space-y-3">
          {/* Like Button and Likes Count Skeleton */}
          <div className="flex items-center w-full">
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Like Button */}
            <Skeleton className="w-10 h-4 ml-2" /> {/* Likes Count */}
          </div>

          {/* Title Skeleton */}
          <Skeleton className="h-6 w-3/4" />

          {/* Markdown Content Skeleton */}
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden max-w-xl mx-auto">
      <CardContent className="p-0">
        {/* Image Carousel with Next.js Image */}
        {post.images && post.images.length > 0 ? (
          <div className="relative w-full">
            {isDetailView ? (
              // For detail view, show a single optimized image
              <div className="relative w-full aspect-auto">
                <Image
                  src={post.images[0]}
                  alt={post.title}
                  width={800}
                  height={600}
                  className="object-cover w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              // For grid view, use the ImageCarousel component
              <ImageCarousel images={post.images} aspectRatio={isDetailView ? "auto" : "square"} />
            )}
          </div>
        ) : (
          <Skeleton className="aspect-square w-full" />
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start p-3 space-y-2">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onLike}
            className={post.userLiked ? "text-red-500" : ""}
            disabled={likesLoading}
          >
            <Heart className={`w-5 h-5 ${post.userLiked ? "fill-current text-red-500" : ""}`} />
          </Button>

          {likesLoading ? (
            <Skeleton className="w-8 h-3 ml-2" />
          ) : (
            <span className="ml-2 text-xs font-medium">{post.likes ?? 0} likes</span>
          )}
        </div>

        <h1 className="text-lg font-bold">{post.title}</h1>

        <div className="prose prose-sm text-xs">
          {isLoadingContent ? (
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ) : markdownContent ? (
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
});

export default BeautyPost;