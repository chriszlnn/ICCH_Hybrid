"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BeautyPostPreviewSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0 relative aspect-square">
        <Skeleton className="w-full h-full" />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-2 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center w-full">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-12 ml-2" />
        </div>
      </CardFooter>
    </Card>
  );
}