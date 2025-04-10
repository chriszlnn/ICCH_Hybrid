// app/api/client-post/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { withDbConnection } from '@/lib/db-utils';
import { getCachedClientPosts } from '@/lib/profile-cache';
import { Prisma } from '@prisma/client';

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
        include: { client: true }
      });

      if (!user || !user.client) {
        throw new Error('User or client not found');
      }

      // Create the post
      const newPost = await prisma.clientPost.create({
        data: {
          title,
          content,
          images,
          clientId: user.client.id,
          taggedProducts: {
            create: productIds.map((productId: string) => ({
              productId
            }))
          }
        }
      });

      return newPost;
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: 'Failed to create post' },
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
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Use cached client posts
    const posts = await getCachedClientPosts(email);

    if (!posts) {
      return NextResponse.json(
        { message: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Database operation failed:', error);
    
    // Check if it's a Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code);
      console.error('Prisma error message:', error.message);
      
      if (error.code === 'P2024') {
        console.error('Connection pool timeout detected. This may be due to high traffic or database load.');
      }
    }
    
    return NextResponse.json(
      { message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
