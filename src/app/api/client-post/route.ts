// app/api/client-post/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { withDbConnection } from '@/lib/db-utils';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const userEmail = session.user.email;
    const { title, images, content, productIds } = await request.json();

    // Validate required fields
    if (!title || !images || !productIds) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use withDbConnection for better connection handling
    const post = await withDbConnection(async () => {
      // Get the user and client
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { client: true },
      });

      if (!user || !user.client) {
        throw new Error('Only clients can create posts');
      }

      // Create the client post
      return prisma.clientPost.create({
        data: {
          title,
          content: content || "", // Make content optional by providing empty string if not set
          images,
          clientId: user.client.id,
          taggedProducts: {
            create: productIds.map((productId: string) => ({
              productId,
            })),
          },
        },
        include: {
          taggedProducts: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating client post:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'Only clients can create posts') {
        return NextResponse.json(
          { message: error.message },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const posts = await withDbConnection(async () => {
      return prisma.clientPost.findMany({
        where: {
          client: {
            email: email
          }
        },
        include: {
          taggedProducts: {
            select: {
              productId: true
            }
          },
          likes: {
            select: {
              id: true
            }
          },
          comments: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching client posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
