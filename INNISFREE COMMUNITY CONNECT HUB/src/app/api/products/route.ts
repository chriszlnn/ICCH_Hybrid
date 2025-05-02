/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getCachedProducts } from '@/lib/product-cache';

// Input validation schema for product creation
const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string(),
  subcategory: z.string().optional(),
  image: z.string(),
  tags: z.array(z.string()).optional(),
});

// GET all products
export async function GET(req: Request) {
  try {
    const products = await getCachedProducts();
    
    if (!products) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createProductSchema.parse(body);

    // Create the product
    const newProduct = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        price: validatedData.price,
        category: validatedData.category,
        subcategory: validatedData.subcategory || null,
        image: validatedData.image,
        tags: validatedData.tags || [],
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}