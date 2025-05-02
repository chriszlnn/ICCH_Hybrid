import { cache } from 'react';
import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";
//import { Prisma } from '@prisma/client';

// Cache for getting user profile
export const getCachedUserProfile = cache(async (email: string) => {
  try {
    return await withDbConnection(async () => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              username: true,
              bio: true,
              imageUrl: true
            }
          },
          staff: {
            select: {
              id: true,
              email: true,
              username: true,
              bio: true,
              imageUrl: true,
              department: true,
              name: true
            }
          },
          admin: {
            select: {
              id: true,
              email: true,
              username: true,
              bio: true,
              imageUrl: true,
              department: true,
              name: true
            }
          },
          reviews: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          },
          productLikes: {
            include: {
              product: true
            },
            take: 10
          }
        }
      });
      
      return user;
    });
  } catch (error) {
    console.error('Error fetching cached user profile:', error);
    return null;
  }
});

// Cache for getting client posts
export const getCachedClientPosts = cache(async (email: string) => {
  try {
    return await withDbConnection(async () => {
      const posts = await prisma.clientPost.findMany({
        where: {
          client: {
            user: {
              email
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              username: true,
              bio: true,
              imageUrl: true,
              user: {
                select: {
                  email: true
                }
              }
            }
          },
          likes: true,
          taggedProducts: {
            select: {
              productId: true
            }
          },
          comments: {
            include: {
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
            take: 5
          }
        }
      });
      
      // Transform posts to include calculated fields
      return posts.map(post => {
        const displayName = post.client.username || post.client.user.email.split('@')[0];
        
        return {
          ...post,
          clientAvatar: post.client.imageUrl || "/blank-profile.svg",
          displayName,
          likesCount: post.likes.length,
          commentsCount: post.comments.length
        };
      });
    });
  } catch (error) {
    console.error('Error fetching cached client posts:', error);
    return null;
  }
}); 