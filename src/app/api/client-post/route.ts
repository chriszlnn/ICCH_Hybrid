// app/api/client-post/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, images, content, productIds } = await request.json();

  // Validate required fields
  if (!title || !images || !content || !productIds) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    // Get the user and client
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { client: true },
    });

    if (!user || !user.client) {
      return NextResponse.json(
        { message: 'Only clients can create posts' },
        { status: 403 }
      );
    }

    // Create the client post
    const post = await prisma.clientPost.create({
      data: {
        title,
        content,
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating client post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
  
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }
  
    try {
      const posts = await prisma.clientPost.findMany({
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
  
      return NextResponse.json(posts);
    } catch (error) {
      console.error('Error fetching client posts:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
