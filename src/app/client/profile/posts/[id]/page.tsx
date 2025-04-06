import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";
import { PostContent } from "./post-content";
import { Suspense } from "react";

async function getPost(id: string) {
  return withDbConnection(async () => {
    const post = await prisma.clientPost.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        images: true,
        createdAt: true,
        likes: true,
        client: {
          select: {
            imageUrl: true,
            username: true,
            email: true
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                email: true,
                image: true
              }
            }
          }
        }
      }
    });

    if (!post) return null;

    // Transform comments to match the expected format
    const transformedComments = post.comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        email: comment.user.email,
        image: comment.user.image || undefined
      }
    }));

    // Get display name: username or email prefix
    const displayName = post.client?.username || 
      (post.client?.email ? post.client.email.split('@')[0] : "User");

    return {
      ...post,
      comments: transformedComments,
      clientAvatar: post.client?.imageUrl || "/blank-profile.svg",
      displayName
    };
  });
}

export default async function PostPage({ params }: { params: { id: string } }) {
  // Ensure params is properly awaited
  const { id } = await Promise.resolve(params);
  const post = await getPost(id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Suspense>
      <PostContent post={post} />
    </Suspense>
  );
} 