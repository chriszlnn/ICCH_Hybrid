import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { EditPostForm } from "@/app/client/profile/posts/[id]/edit/edit-post-form";
import { withDbConnection } from "@/lib/db-utils";

async function getPost(id: string) {
  return await withDbConnection(async () => {
    const post = await prisma.clientPost.findUnique({
      where: { id },
      include: {
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
    return post;
  });
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  // Ensure params is properly awaited
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Suspense>
      <EditPostForm post={post} />
    </Suspense>
  );
} 