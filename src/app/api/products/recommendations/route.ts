import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to retry database operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      // If this is the last attempt, don't wait
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const { skinType, skinTone, concerns = [] } = await request.json();

    // Get skincare recommendations with retry
    const skincareProducts = await retryOperation(async () => {
      return await prisma.product.findMany({
        where: {
          category: { in: ["skincare", "Skincare"] }, // Case-insensitive match
          OR: [
            // Match if product has the selected skin type
            skinType ? { tags: { has: skinType.toLowerCase() } } : {},
            // Match if product has any of the selected concerns
            concerns.length > 0 ? { tags: { hasSome: concerns.map((c: string) => c.toLowerCase()) } } : {},
            // Match if product has the universal tag
            { tags: { has: "universal" } },
            // Include products with no tags as a fallback
            { tags: { isEmpty: true } }
          ].filter(condition => Object.keys(condition).length > 0)
        },
        orderBy: [
          { rating: 'desc' },
          { reviewCount: 'desc' },
          { votes: 'desc' }
        ],
        take: 10
      });
    });

    // Get makeup recommendations with retry
    const makeupProducts = await retryOperation(async () => {
      return await prisma.product.findMany({
        where: {
          category: { in: ["makeup", "Makeup"] }, // Case-insensitive match
          OR: [
            // Match if product has the selected skin tone
            skinTone ? { tags: { has: skinTone.toLowerCase() } } : {},
            // Match if product has any of the selected concerns
            concerns.length > 0 ? { tags: { hasSome: concerns.map((c: string) => c.toLowerCase()) } } : {},
            // Match if product has the universal tag
            { tags: { has: "universal" } },
            // Include products with no tags as a fallback
            { tags: { isEmpty: true } }
          ].filter(condition => Object.keys(condition).length > 0)
        },
        orderBy: [
          { rating: 'desc' },
          { reviewCount: 'desc' },
          { votes: 'desc' }
        ],
        take: 10
      });
    });

    // Update products with default tags if they don't have any
    const productsToUpdate = [...skincareProducts, ...makeupProducts].filter(p => !p.tags || p.tags.length === 0);
    
    for (const product of productsToUpdate) {
      const defaultTags = [];
      
      // Add default tags based on category
      if (product.category.toLowerCase() === 'skincare') {
        defaultTags.push('universal');
        // Add more specific tags based on subcategory
        switch (product.subcategory?.toLowerCase()) {
          case 'cleansers':
            defaultTags.push('sensitive', 'combination');
            break;
          case 'moisturizers':
            defaultTags.push('dry', 'normal');
            break;
          case 'serums':
            defaultTags.push('dry', 'sensitive');
            break;
          case 'sunscreen':
            defaultTags.push('universal');
            break;
          default:
            defaultTags.push('normal');
        }
      } else if (product.category.toLowerCase() === 'makeup') {
        defaultTags.push('universal');
        if (product.subcategory?.toLowerCase() === 'lip') {
          defaultTags.push('neutral');
        }
      }
      
      // Update the product with default tags
      if (defaultTags.length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { tags: defaultTags }
        });
      }
    }

    return NextResponse.json({
      skincare: skincareProducts,
      makeup: makeupProducts
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    
    // Return a more specific error message
    return NextResponse.json(
      { 
        error: "Failed to fetch recommendations", 
        message: error instanceof Error ? error.message : "Unknown error",
        skincare: [],
        makeup: []
      },
      { status: 500 }
    );
  }
} 