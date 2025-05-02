import { PostContent } from "./post-content";
import { Suspense } from "react";
import { getCachedPost } from "@/lib/post-cache";

// Add revalidation time (e.g., 60 seconds)
export const revalidate = 60;

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const post = await getCachedPost(resolvedParams.id);

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-gray-500">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostContent post={post} />
    </Suspense>
  );
} 