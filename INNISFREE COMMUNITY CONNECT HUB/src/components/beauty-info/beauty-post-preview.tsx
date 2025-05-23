"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
//import type { BeautyPost } from "@/lib/types/types";

interface BeautyPostPreviewProps {
  post?: {
    id: number;
    title: string;
    images: string[];
    file: string;
    likes: number;
    userLiked: boolean; // Ensure this is included
  };
  onLike?: () => void;
  isLoading?: boolean;
  likesLoading?: boolean; // Add this prop
}

export default function BeautyPostPreview({ post, onLike, isLoading = false, likesLoading = false }: BeautyPostPreviewProps) {
  // If loading or no post data, show skeleton
  if (isLoading || !post) {
    return (
      <Card className="overflow-hidden h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1">
          <CardContent className="p-0 relative aspect-square">
            <Skeleton className="w-full h-full" />
          </CardContent>
        </div>
        <CardFooter className="flex flex-col items-start p-2 space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <div className="flex items-center w-full">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-12 ml-2" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Otherwise show the actual content
  return (
    <Card className="overflow-hidden h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/client/information/beauty-info/posts/${post.id}`} className="flex-1">
        <CardContent className="p-0 relative aspect-square">
          <Image
            src={post.images[0] || "/placeholder.svg"}
            alt={`Preview image for ${post.title}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </CardContent>
      </Link>
      <CardFooter className="flex flex-col items-start p-2 space-y-1">
        <Link href={`/client/information/beauty-info/posts/${post.id}`} className="hover:underline">
          <h2 className="font-medium text-xs line-clamp-1">{post.title}</h2>
        </Link>
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation when clicking like
              if (onLike) onLike();
            }}
            className={post.userLiked ? "text-red-500" : ""}
            disabled={likesLoading}
          >
            <Heart
              className={`w-6 h-6 ${post.userLiked ? "fill-current text-red-500" : ""}`}
            />
          </Button>
          {likesLoading ? (
            <Skeleton className="w-8 h-3 ml-2" />
          ) : (
            <span className="text-xs font-medium">{post.likes} likes</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}