import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";
import { PostContent } from "./post-content";
import { Suspense } from "react";

async function getPost(id: string) {
  try {
    return await withDbConnection(async () => {
      const post = await prisma.clientPost.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          images: true,
          createdAt: true,
          likes: {
            select: {
              id: true,
              userId: true,
              postId: true,
              createdAt: true
            }
          },
          client: {
            select: {
              email: true,
              imageUrl: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              user: {
                select: {
                  email: true,
                  client: {
                    select: {
                      imageUrl: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 20, // Limit the number of comments fetched
          },
          taggedProducts: {
            select: {
              id: true,
              productId: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (!post) {
        return null;
      }

      // Transform comments to match the Post interface
      const transformedComments = post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          email: comment.user.email,
          image: comment.user.client?.imageUrl || "/blank-profile.svg",
        },
      }));

      // Transform tagged products to match the TaggedProduct interface
      const transformedTaggedProducts = post.taggedProducts.map(tp => ({
        id: tp.id,
        productId: tp.productId,
        product: tp.product
      }));

      // Get display name (email prefix)
      const displayName = post.client.user.email.split('@')[0];

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        likes: post.likes,
        clientAvatar: post.client.imageUrl || "/blank-profile.svg",
        displayName,
        client: {
          email: post.client.user.email,
        },
        comments: transformedComments,
        taggedProducts: transformedTaggedProducts,
      };
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

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