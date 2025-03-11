import { useState, useEffect } from "react";
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

export default function BeautyPost({ post, isDetailView = false, onLike, likesLoading }: BeautyPostProps) {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (post.file) {
        try {
          const response = await fetch(post.file);
          if (!response.ok) throw new Error("Failed to fetch markdown");
          const text = await response.text();
          setMarkdownContent(text);
        } catch (error) {
          console.error("Error loading markdown:", error);
          setMarkdownContent("Error loading content.");
        }
      }
    };

    fetchMarkdown();
  }, [post.file]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Image Carousel */}
        {post.images ? (
          <ImageCarousel images={post.images} aspectRatio={isDetailView ? "auto" : "square"} />
        ) : (
          <Skeleton className="aspect-square w-full" />
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 space-y-3">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onLike}
            className={post.liked ? "text-red-500" : ""} // Ensure className updates dynamically
          >
            <Heart className={`w-6 h-6 ${post.liked ? "fill-current text-red-500" : ""}`} />
          </Button>

          {likesLoading ? (
            <Skeleton className="w-10 h-4 ml-2" />
          ) : (
            <span className="ml-2 text-sm font-medium">{post.likes ?? 0} likes</span>
          )}
        </div>

        <h1 className="text-xl font-bold">{post.title}</h1>

        <div className="prose text-sm">
          {markdownContent ? <ReactMarkdown>{markdownContent}</ReactMarkdown> : <p>Loading content...</p>}
        </div>
      </CardFooter>
    </Card>
  );
}