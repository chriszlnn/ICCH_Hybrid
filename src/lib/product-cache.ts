import { cache } from 'react';
import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";
import { Prisma } from '@prisma/client';

// Cache for getting all products
export const getCachedProducts = cache(async () => {
  try {
    return await withDbConnection(async () => {
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
      return products.map(product => ({
        ...product,
        rating: product.reviews.length > 0 
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length 
          : 0,
        reviewCount: product.reviews.length,
        likes: product.productLikes.length,
        votes: product.ProductVote.length
      }));
    });
  } catch (error) {
    console.error('Error fetching cached products:', error);
    return null;
  }
});

// Cache for getting a single product by ID
export const getCachedProductById = cache(async (id: string) => {
  try {
    return await withDbConnection(async () => {
      const product = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          subcategory: true,
          image: true,
          tags: true,
          reviews: {
            include: {
              author: true
            }
          },
          productLikes: true,
          ProductVote: true
        },
      });

      if (!product) return null;

      // Calculate additional fields
      const rating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length 
        : 0;

      return {
        ...product,
        rating,
        reviewCount: product.reviews.length,
        likes: product.productLikes.length,
        votes: product.ProductVote.length
      };
    });
  } catch (error) {
    console.error('Error fetching cached product:', error);
    return null;
  }
});

// Cache for getting products by category and subcategory
export const getCachedProductsByCategory = cache(async (category?: string, subcategory?: string, limit?: number) => {
  try {
    const whereClause: Prisma.ProductWhereInput = {
      ...(category && { 
        category: {
          equals: category,
          mode: 'insensitive'
        }
      }),
      ...(subcategory && { 
        subcategory: {
          equals: subcategory,
          mode: 'insensitive'
        }
      }),
    };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        productLikes: true,
        ProductVote: true
      },
      orderBy: [
        { category: 'asc' },
        { subcategory: 'asc' },
        { name: 'asc' }
      ],
      ...(limit ? { take: limit } : {})
    });

    return products.map(product => ({
      ...product,
      rating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length 
        : 0,
      reviewCount: product.reviews.length,
      likes: product.productLikes.length,
      votes: product.ProductVote.length
    }));
  } catch (error) {
    console.error('Error fetching cached products by category:', error);
    return null;
  }
}); 