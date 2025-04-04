/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all products
export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        productLikes: true,
        ProductVote: true
      },
    });

    // Transform the products to include calculated fields
    const transformedProducts = products.map(product => ({
      ...product,
      rating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length 
        : 0,
      reviewCount: product.reviews.length,
      likes: product.productLikes.length,
      votes: product.ProductVote.length
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: Request) {
  try {
    const { name, description, price, category, subcategory, image } = await request.json();

    // Validate required fields
    if (!name || !price || !category || !image) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category, and image are required' },
        { status: 400 }
      );
    }

    // Validate price is a positive number
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        category,
        subcategory,
        image,
        description: description || null,
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}