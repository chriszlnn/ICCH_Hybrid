/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { CategoryTabs } from "./category-tabs"
import { ProductList } from "./product-list"
import { categoryOptions } from "./mock-data" // Keep this for category options
import type { Category, Product, Review } from "./types"
import { useToast } from "@/components/ui/toast/use-toast"

// Define a type for vote objects that may come from the API
interface VoteWithTimestamp {
  createdAt: string;
  // Avoid using any
  userId?: string;
  productId?: string;
  rating?: number;
  [key: string]: unknown;
}

// Extended product interface to handle votes as array from API
interface ProductWithVotesArray extends Omit<Product, 'votes'> {
  votes?: VoteWithTimestamp[];
}

// Type guard to check if a product has votes as an array
function hasVotesArray(product: Product | ProductWithVotesArray): product is ProductWithVotesArray {
  return Array.isArray((product as ProductWithVotesArray).votes);
}

export function ProductRanking() {
  // Set default category to the first one in the list (skincare)
  const [selectedCategory, setSelectedCategory] = useState<Category>(categoryOptions[0].id)
  const [products, setProducts] = useState<Product[]>([])
  // Set default subcategory to the first subcategory of the selected category
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(categoryOptions[0].subcategories[0].id)

  const [isLoading, setIsLoading] = useState(true)
  const [isRankLoading, setIsRankLoading] = useState(false) // New state for rank-specific loading
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null) // Track which product is being updated
  const [error, setError] = useState<string | null>(null)
  const [likedProductIds, setLikedProductIds] = useState<string[]>([])
  const { toast } = useToast()

  // Clean up expired votes when the component mounts
  useEffect(() => {
    const cleanupExpiredVotes = async () => {
      try {
        console.log('Cleaning up expired votes...');
        const response = await fetch('/api/product/cleanup-votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Vote cleanup result:', result);
        } else {
          console.error('Failed to clean up votes:', await response.json());
        }
      } catch (error) {
        console.error('Error cleaning up votes:', error);
      }
    };
    
    cleanupExpiredVotes();
  }, []);

  // Fetch products based on selected category and subcategory
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        let url = `/api/product?category=${selectedCategory}`
        if (selectedSubcategory) {
          url += `&subcategory=${selectedSubcategory}`
        }

        const response = await fetch(url)
        
        if (!response.ok) throw new Error('Failed to fetch products')
        
        // The API might return products with votes as arrays
        const data = await response.json() as (Product | ProductWithVotesArray)[]
        
        // Process products to calculate proper ranks
        const processedProducts = calculateProductRanks(data)
        setProducts(processedProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, selectedSubcategory])

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const response = await fetch('/api/product/like')
        if (response.ok) {
          const data = await response.json()
          setLikedProductIds(data.map((p: { productId: string }) => p.productId))
        }
      } catch (error) {
        console.error('Failed to fetch liked products', error)
      }
    }
    
    fetchLikedProducts()
  }, [])

  // Function to calculate ranks based on priority: votes > stars > likes
  // Also filters out expired votes (older than 1 week)
  const calculateProductRanks = (apiProducts: (Product | ProductWithVotesArray)[]): Product[] => {
    // Current date for comparing vote expiration
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log("======== RANKING CALCULATION ========");
      console.log("Filtering out votes older than:", oneWeekAgo.toISOString());
      console.log(`Processing ${apiProducts.length} products for ranking`);
    }
    
    // Process each product to handle expired votes
    const processedProducts = apiProducts.map(product => {
      let validVoteCount = 0;
      let validVotes: VoteWithTimestamp[] = [];
      
      // Use type guard to check if product has votes as an array
      if (hasVotesArray(product)) {
        const votesArray = product.votes || [];
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Product ${product.id} (${product.name}) has ${votesArray.length} total votes before filtering`);
        }
        
        // Enhanced filtering for votes:
        // 1. Check vote timestamp (not expired)
        // 2. Verify vote is for THIS product
        // 3. Ensure it has a valid user ID
        validVotes = votesArray.filter(vote => {
          if (!vote.createdAt) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`  Rejecting vote: missing timestamp for product ${product.name}`);
            }
            return false;
          }
          
          // Skip votes that don't have a productId (likely older votes)
          if (!vote.productId) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`  Warning: Vote has no productId for product ${product.name} - assuming it belongs to this product`);
            }
            // Allow votes without productId as they might be legacy data
          } else if (vote.productId !== product.id) {
            // Critical: The vote explicitly references a different product
            if (process.env.NODE_ENV === 'development') {
              console.log(`  CRITICAL: Found mismatched vote for product ${product.name} - vote.productId=${vote.productId} but product.id=${product.id}`);
            }
            return false;
          }
          
          // Check user ID - votes should have a userId
          if (!vote.userId) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`  Rejecting vote: missing userId for product ${product.name}`);
            }
            return false;
          }
          
          // Check timestamp
          const voteDate = new Date(vote.createdAt);
          const isValid = voteDate >= oneWeekAgo;
          
          if (!isValid && process.env.NODE_ENV === 'development') {
            console.log(`  Rejecting vote: expired vote from ${voteDate.toISOString()} for product ${product.name}`);
          }
          
          // Vote is valid if: it has a timestamp, is not expired, and either has no productId or matches this product's ID
          return isValid && (!vote.productId || vote.productId === product.id) && !!vote.userId;
        });
        
        validVoteCount = validVotes.length;
        if (process.env.NODE_ENV === 'development') {
          console.log(`Product ${product.id} (${product.name}) has ${validVoteCount} valid votes after filtering`);
        }
      } else {
        // For products with numeric votes
        validVoteCount = typeof product.votes === 'number' ? product.votes : 0;
        
        // If the product has a review count that's higher than votes, something might be wrong
        if (product.reviewCount > validVoteCount && process.env.NODE_ENV === 'development') {
          console.log(`WARNING: Product ${product.id} (${product.name}) has more reviews (${product.reviewCount}) than votes (${validVoteCount})`);
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Product ${product.id} (${product.name}) has ${validVoteCount} votes (numeric value)`);
        }
      }
      
      // Create a consistent product object with updated votes
      return {
        ...product,
        votes: validVoteCount,
        reviewCount: validVoteCount, // Make sure reviewCount matches votes for consistency
        // Ensure other ranking factors are numbers
        rating: typeof product.rating === 'number' ? product.rating : 0,
        likes: typeof product.likes === 'number' ? product.likes : 0
      };
    });

    // Group products by subcategory
    const productsBySubcategory: Record<string, Product[]> = {};
    
    processedProducts.forEach(product => {
      // Ensure product has a valid subcategory
      const subcategory = product.subcategory || 'uncategorized';
      
      if (!productsBySubcategory[subcategory]) {
        productsBySubcategory[subcategory] = [];
      }
      productsBySubcategory[subcategory].push(product);
    });
    
    // For each subcategory, rank products based on priority: votes > rating > likes
    Object.keys(productsBySubcategory).forEach(subcategory => {
      const subcategoryProducts = productsBySubcategory[subcategory];
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`\nCalculating ranks for subcategory: ${subcategory} (${subcategoryProducts.length} products)`);
        console.log(`Products in ${subcategory} before sorting:`);
        subcategoryProducts.forEach(p => {
          console.log(`  ${p.id} (${p.name}): votes=${p.votes}, rating=${p.rating}, likes=${p.likes}`);
        });
      }
      
      // First check what metrics are available in this subcategory
      const hasVotes = subcategoryProducts.some(p => p.votes > 0);
      const hasRatings = subcategoryProducts.some(p => p.rating > 0);
      const hasLikes = subcategoryProducts.some(p => p.likes > 0);
      
      // Sort based on the available metrics, prioritizing votes > ratings > likes
      if (hasVotes) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Subcategory ${subcategory} has products with votes - sorting by vote count`);
        }
        subcategoryProducts.sort((a, b) => {
          // Check if products have valid vote counts
          const aVotes = typeof a.votes === 'number' ? a.votes : 0;
          const bVotes = typeof b.votes === 'number' ? b.votes : 0;
          
          // Log if a product has zero votes but non-zero reviewCount (might indicate an issue)
          if (aVotes === 0 && a.reviewCount > 0 && process.env.NODE_ENV === 'development') {
            console.log(`Warning: Product ${a.id} (${a.name}) has reviewCount=${a.reviewCount} but votes=0`);
          }
          if (bVotes === 0 && b.reviewCount > 0 && process.env.NODE_ENV === 'development') {
            console.log(`Warning: Product ${b.id} (${b.name}) has reviewCount=${b.reviewCount} but votes=0`);
          }
          
          // Double-verify both products have actual votes to prevent incorrect ranking
          const aHasActualVotes = aVotes > 0;
          const bHasActualVotes = bVotes > 0;
          
          // If only one has actual votes, that one goes first
          if (aHasActualVotes && !bHasActualVotes) return -1;
          if (!aHasActualVotes && bHasActualVotes) return 1;
          
          // Otherwise, sort by vote count
          return bVotes - aVotes;
        });
      } else if (hasRatings) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Subcategory ${subcategory} has products with ratings - sorting by rating`);
        }
        subcategoryProducts.sort((a, b) => {
          return (b.rating || 0) - (a.rating || 0);
        });
      } else if (hasLikes) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Subcategory ${subcategory} has products with likes - sorting by likes`);
        }
        subcategoryProducts.sort((a, b) => {
          return (b.likes || 0) - (a.likes || 0);
        });
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Subcategory ${subcategory} has no votes, ratings, or likes - sorting by ID for stability`);
        }
        // Sort by ID for stability if no other metrics
        subcategoryProducts.sort((a, b) => {
          return (a.id || '').localeCompare(b.id || '');
        });
      }
      
      // Log sorted products
      if (process.env.NODE_ENV === 'development') {
        console.log(`Products in ${subcategory} after sorting:`);
        subcategoryProducts.forEach((p, i) => {
          console.log(`  ${i+1}. ${p.id} (${p.name}): votes=${p.votes}, rating=${p.rating}, likes=${p.likes}`);
        });
      }
      
      // Assign ranks based on the sorted order and available metrics
      subcategoryProducts.forEach((product, index) => {
        // Always assign a rank if the product has ANY ranking attribute (votes, rating, or likes)
        if (product.votes > 0 || product.rating > 0 || product.likes > 0) {
          product.rank = index + 1;
          
          // Log based on which attribute primarily determined the rank
          if (process.env.NODE_ENV === 'development') {
            if (product.votes > 0) {
              console.log(`Assigned rank ${product.rank} to product ${product.id} (${product.name}) with ${product.votes} votes`);
            } else if (product.rating > 0) {
              console.log(`Assigned rank ${product.rank} to product ${product.id} (${product.name}) with rating ${product.rating}`);
            } else {
              console.log(`Assigned rank ${product.rank} to product ${product.id} (${product.name}) with ${product.likes} likes`);
            }
          }
        } else {
          // No metrics available
          product.rank = 0;
          if (process.env.NODE_ENV === 'development') {
            console.log(`Product ${product.id} (${product.name}) has no ranking metrics - assigned rank 0`);
          }
        }
      });
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log("======== END RANKING CALCULATION ========");
    }
    
    // Return all products with updated ranks
    return processedProducts;
  };

  const getSortedProducts = () => {
    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log("Products before sorting:", products.map(p => ({
        id: p.id,
        name: p.name,
        votes: p.votes,
        rating: p.rating,
        likes: p.likes,
        rank: p.rank
      })));
    }
    
    // Normalize products to ensure all have proper values
    const normalizedProducts = products.map(p => ({
      ...p,
      votes: typeof p.votes === 'number' ? p.votes : 0,
      rating: typeof p.rating === 'number' ? p.rating : 0,
      likes: typeof p.likes === 'number' ? p.likes : 0,
      rank: typeof p.rank === 'number' ? p.rank : 0
    }));
    
    // Sort products by rank (1, 2, 3...) with unranked products (rank=0) at the end
    const sortedProducts = [...normalizedProducts].sort((a, b) => {
      // Products with rank come before products without rank
      if ((a.rank > 0) && (b.rank === 0)) return -1;
      if ((a.rank === 0) && (b.rank > 0)) return 1;
      
      // Both have ranks - sort by rank ascending (1, 2, 3...)
      if (a.rank > 0 && b.rank > 0) {
        return a.rank - b.rank;
      }
      
      // Neither has a rank - sort by votes, then rating, then likes
      if (a.votes !== b.votes) return b.votes - a.votes;
      if (a.rating !== b.rating) return b.rating - a.rating;
      return b.likes - a.likes;
    });
    
    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log("Products after sorting:", sortedProducts.map(p => ({
        id: p.id,
        name: p.name,
        votes: p.votes,
        rating: p.rating,
        likes: p.likes,
        rank: p.rank
      })));
    }
    
    return sortedProducts;
  };
  
  // Function to update ranks after user interaction
  const updateRanks = async (productId: string, action: 'like' | 'vote' | 'review') => {
    // Set rank loading state
    setIsRankLoading(true);
    setUpdatingProductId(productId);
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Updating ranks after ${action} for product ${productId}`);
      }
      
      // Add timeout handling to prevent 504 errors
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
      
      // Fetch all products in the current category and subcategory to ensure consistent ranking
      let url = `/api/product?category=${selectedCategory}`
      if (selectedSubcategory) {
        url += `&subcategory=${selectedSubcategory}`
      }
      
      const productsResponse = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!productsResponse.ok) throw new Error('Failed to fetch updated products');
      
      // Process the updated products data
      const updatedProductsData = await productsResponse.json();
      
      // Recalculate ranks with all updated products
      const recalculatedProducts = calculateProductRanks(updatedProductsData);
      
      // Update state with new product data and ranks
      setProducts(recalculatedProducts);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Ranks updated successfully after ${action}`);
      }
    } catch (error) {
      console.error(`Error updating ${action} rank:`, error);
      
      // Check if it's a timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Request Timeout",
          description: "The ranking update took too long. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to update product rankings after ${action}`,
          variant: "destructive",
        });
      }
    } finally {
      // Clear loading states after a short delay to ensure UI feedback is visible
      setTimeout(() => {
        setIsRankLoading(false);
        setUpdatingProductId(null);
      }, 500); // Short delay for better UX
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold text-center mb-6">Product Ranking</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <CategoryTabs
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          No products found in this category
        </div>
      ) : (
        <ProductList 
          products={getSortedProducts()} 
          initialLikedProductIds={likedProductIds}
          isRankLoading={isRankLoading}
          updatingProductId={updatingProductId}
          onUpdateRanks={updateRanks}
          onVoteSuccess={({ updatedProduct }) => {
            // Instead of just updating a single product in the array,
            // refresh all products to ensure consistent ranking
            setIsRankLoading(true);
            setUpdatingProductId(updatedProduct.id);
            
            console.log(`Vote success callback triggered for product: ${updatedProduct.id} (${updatedProduct.name})`);
            console.log('Updated product data:', updatedProduct);
            
            (async () => {
              try {
                // Add timeout handling to prevent 504 errors
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
                
                // Fetch all products to ensure consistency
                let url = `/api/product?category=${selectedCategory}`
                if (selectedSubcategory) {
                  url += `&subcategory=${selectedSubcategory}`
                }
                
                console.log(`Fetching all products after vote: ${url}`);
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!response.ok) throw new Error('Failed to fetch products after vote');
                
                const allProducts = await response.json();
                console.log(`Received ${allProducts.length} products after vote`);
                
                // Process and set all products with proper ranks
                const processedProducts = calculateProductRanks(allProducts);
                
                // Double-check that the product we just voted for has increased votes
                const votedProduct = processedProducts.find(p => p.id === updatedProduct.id);
                if (votedProduct) {
                  console.log(`Voted product after processing: ${votedProduct.id} (${votedProduct.name})`, {
                    votes: votedProduct.votes,
                    rank: votedProduct.rank
                  });
                  
                  // If the vote count hasn't increased, something might be wrong
                  if (votedProduct.votes < updatedProduct.votes) {
                    console.warn(`WARNING: Vote count for ${votedProduct.name} is ${votedProduct.votes}, expected at least ${updatedProduct.votes}`);
                  }
                } else {
                  console.error(`ERROR: Couldn't find product ${updatedProduct.id} in refreshed products!`);
                }
                
                setProducts(processedProducts);
                console.log(`Successfully refreshed all products after vote for ${updatedProduct.name}`);
              } catch (error) {
                console.error('Error refreshing products after vote:', error);
                
                // Check if it's a timeout error
                if (error instanceof Error && error.name === 'AbortError') {
                  toast({
                    title: "Request Timeout",
                    description: "The ranking update took too long. The page will refresh automatically.",
                    variant: "destructive",
                  });
                  
                  // Refresh the page after a short delay to get fresh data
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                } else {
                  // Fallback to just updating the single product if the full refresh fails
                  setProducts(prev => {
                    // Log the current state of the product in the array
                    const currentProduct = prev.find(p => p.id === updatedProduct.id);
                    console.log('Current product in state:', currentProduct);
                    console.log('Updated product from vote:', updatedProduct);
                    
                    // Update the product with the new data
                    const updatedProducts = prev.map(p => {
                      if (p.id === updatedProduct.id) {
                        // Process votes to ensure it's a number
                        let voteCount = 1; // Default fallback
                        
                        if (typeof updatedProduct.votes === 'number') {
                          voteCount = updatedProduct.votes;
                        } else if (updatedProduct.votes && typeof updatedProduct.votes === 'object') {
                          // Try to safely handle array-like objects
                          try {
                            const votesArray = Array.from(updatedProduct.votes as unknown as VoteWithTimestamp[]);
                            voteCount = votesArray.length;
                          } catch (e) {
                            console.error('Error converting votes to array:', e);
                          }
                        }
                        
                        // Create updated product with safe values
                        return {
                          ...updatedProduct,
                          votes: voteCount,
                          reviewCount: typeof updatedProduct.reviewCount === 'number' 
                            ? updatedProduct.reviewCount 
                            : voteCount
                        };
                      }
                      return p;
                    });
                    return calculateProductRanks(updatedProducts);
                  });
                }
              } finally {
                // Clear loading states after a short delay for better UX
                setTimeout(() => {
                  setIsRankLoading(false);
                  setUpdatingProductId(null);
                }, 500);
              }
            })();
          }}
        />
      )}
    </div>
  )
}