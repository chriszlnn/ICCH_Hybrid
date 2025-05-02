"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Use the same props interface as BeautyPostPreview
interface BeautyPostPreviewSkeletonProps {
  post?: {
    id: number;
    title: string;
    images: string[];
    file: string;
    likes: number;
    userLiked: boolean;
  };
  onLike?: () => void;
}

export default function BeautyPostPreviewSkeleton({ post, onLike }: BeautyPostPreviewSkeletonProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow">
      <Link href={post ? `/client/information/beauty-info/posts/${post.id}` : "#"} className="flex-1">
        <CardContent className="p-0 relative aspect-square">
          {post ? (
            <Image
              src={post.images[0] || "/placeholder.svg"}
              alt={`Preview image for ${post.title}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </CardContent>
      </Link>
      <CardFooter className="flex flex-col items-start p-2 space-y-1">
        <Link href={post ? `/client/information/beauty-info/posts/${post.id}` : "#"} className="hover:underline">
          {post ? (
            <h2 className="font-medium text-xs line-clamp-1">{post.title}</h2>
          ) : (
            <Skeleton className="h-3 w-3/4" />
          )}
        </Link>
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onLike}
            disabled={!post}
            className={post?.userLiked ? "text-red-500" : ""}
          >
            <Heart
              className={`w-6 h-6 ${post?.userLiked ? "fill-current text-red-500" : ""}`}
            />
          </Button>
          {post ? (
            <span className="text-xs font-medium">{post.likes} likes</span>
          ) : (
            <Skeleton className="h-3 w-12 ml-2" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}