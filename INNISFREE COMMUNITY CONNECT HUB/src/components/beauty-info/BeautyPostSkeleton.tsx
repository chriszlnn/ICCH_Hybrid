"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BeautyPostSkeleton() {
  return (
    <Card className="overflow-hidden">
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