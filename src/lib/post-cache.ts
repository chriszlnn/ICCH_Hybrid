import { cache } from 'react';
import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";

export const getCachedPost = cache(async (id: string) => {
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
                  email: true
                }
              }
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
                  client: {
                    select: {
                      imageUrl: true
                    }
                  }
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 20
          },
          taggedProducts: {
            select: {
              id: true,
              productId: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      });

      if (!post) return null;

      // Transform comments
      const transformedComments = post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          email: comment.user.email,
          image: comment.user.client?.imageUrl || "/blank-profile.svg"
        }
      }));

      // Transform tagged products
      const transformedTaggedProducts = post.taggedProducts.map(tp => ({
        id: tp.id,
        productId: tp.productId,
        product: tp.product
      }));

      // Get display name from email
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
          email: post.client.user.email
        },
        comments: transformedComments,
        taggedProducts: transformedTaggedProducts
      };
    });
  } catch (error) {
    console.error('Error fetching cached post:', error);
    return null;
  }
}); 