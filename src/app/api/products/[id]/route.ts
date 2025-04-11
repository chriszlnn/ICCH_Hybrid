 
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from "@/lib/auth";
import { withDbConnection } from "@/lib/db-utils";
import { getCachedProductById } from '@/lib/product-cache';

// Input validation schema for product updates
const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional().nullable(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).partial(); // Make all fields optional

// GET a single product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await getCachedProductById(params.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update a product by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    console.log('Received update request body:', JSON.stringify(body, null, 2));
    
    // Validate input
    let validatedData;
    try {
      validatedData = updateProductSchema.parse(body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input data', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Check if product exists before updating
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        subcategory: true,
        image: true,
        tags: true,
        updatedAt: true,
      },
    });

    console.log('Updated product:', JSON.stringify(updatedProduct, null, 2));
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE a product
export async function DELETE(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const result = await withDbConnection(async () => {
      // First, delete all related records
      await Promise.all([
        prisma.productLike.deleteMany({
          where: { productId: id },
        }),
        prisma.review.deleteMany({
          where: { productId: id },
        }),
        prisma.productVote.deleteMany({
          where: { productId: id },
        }),
        prisma.userRecommendation.deleteMany({
          where: { productId: id },
        }),
      ]);

      // Then delete the product
      const deletedProduct = await prisma.product.delete({
        where: { id },
      });

      return deletedProduct;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete product",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}