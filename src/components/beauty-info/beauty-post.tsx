import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import ImageCarousel from "./image-carousel";
import type { BeautyPost } from "@/lib/types/types";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

interface BeautyPostProps {
  post: BeautyPost;
  isDetailView?: boolean;
  onLike: () => void;
  likesLoading: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const BeautyPost = memo(function BeautyPost({ post, isDetailView = false, onLike, likesLoading }: BeautyPostProps) {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMarkdown = async () => {
      if (post.file) {
        setIsLoading(true);
        try {
          const response = await fetch(post.file);
          if (!response.ok) throw new Error("Failed to fetch markdown");
          const text = await response.text();
          if (isMounted) {
            setMarkdownContent(text);
          }
        } catch (error) {
          console.error("Error loading markdown:", error);
          if (isMounted) {
            setMarkdownContent("Error loading content.");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchMarkdown();
    
    return () => {
      isMounted = false;
    };
  }, [post.file]);

  return (
    <Card className="overflow-hidden max-w-xl mx-auto">
      <CardContent className="p-0">
        {/* Image Carousel */}
        {post.images ? (
          <ImageCarousel images={post.images} aspectRatio={isDetailView ? "auto" : "square"} />
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
          {isLoading ? (
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