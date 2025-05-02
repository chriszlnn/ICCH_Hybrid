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

// Extended product interface with points for ranking
interface ProductWithPoints extends Product {
  points?: number;
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

  // Function to fetch liked products
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

  // Fetch liked products on mount and when window regains focus
  useEffect(() => {
    fetchLikedProducts()

    // Add focus event listener to refresh likes when returning to the page
    const handleFocus = () => {
      fetchLikedProducts()
    }

    window.addEventListener('focus', handleFocus)
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Function to calculate ranks based on points system:
  // - Votes: 3 points each
  // - Rating: 2 points per star (e.g., 5.00 rating = 10 points)
  // - Likes: 1 point each
  const calculateProductRanks = (products: (Product | ProductWithVotesArray)[]): Product[] => {
    if (process.env.NODE_ENV === 'development') {
      console.log("======== START RANKING CALCULATION ========");
      console.log("Input products:", products.map(p => ({
        id: p.id,
        name: p.name,
        votes: p.votes,
        rating: p.rating,
        likes: p.likes,
        reviewCount: p.reviewCount
      })));
    }
    
    // Process each product to ensure consistent data structure
    const processedProducts = products.map(product => {
      // Process votes to ensure it's a number
      let voteCount = 0;
      let reviewCount = 0;
      
      if (typeof product.votes === 'number') {
        voteCount = product.votes;
        reviewCount = product.reviewCount || 0; // Use existing reviewCount if available
      } else if (product.votes && typeof product.votes === 'object') {
        // Handle array-like objects (votes with timestamps)
        try {
          const votesArray = Array.from(product.votes as unknown as VoteWithTimestamp[]);
          
          // Count only non-expired votes
          const validVotes = votesArray.filter(vote => {
            const voteDate = new Date(vote.createdAt);
            const now = new Date();
            const diffDays = Math.ceil((now.getTime() - voteDate.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 30; // Only count votes within the last 30 days
          });
          
          // Set voteCount to valid votes count
          voteCount = validVotes.length;
          
          // Set reviewCount to the original reviewCount or 0 if not available
          reviewCount = product.reviewCount || 0;
        } catch (e) {
          console.error('Error processing votes array:', e);
        }
      }
      
      // Create a new product object with processed values
      return {
        ...product,
        votes: voteCount,
        reviewCount: reviewCount, // Keep reviewCount separate from voteCount
        rating: typeof product.rating === 'number' ? product.rating : 0,
        likes: typeof product.likes === 'number' ? product.likes : 0,
        rank: 0 // Initialize rank
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
    
    // For each subcategory, calculate points and rank products
    Object.keys(productsBySubcategory).forEach(subcategory => {
      const subcategoryProducts = productsBySubcategory[subcategory];
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`\nCalculating ranks for subcategory: ${subcategory} (${subcategoryProducts.length} products)`);
        console.log(`Products in ${subcategory} before sorting:`);
        subcategoryProducts.forEach(p => {
          console.log(`  ${p.id} (${p.name}): votes=${p.votes}, rating=${p.rating}, likes=${p.likes}`);
        });
      }
      
      // Calculate points for each product
      subcategoryProducts.forEach(product => {
        // Calculate points based on the new system
        const votePoints = product.votes * 3; // 3 points per vote
        const ratingPoints = product.rating * 2; // 2 points per star
        const likePoints = product.likes * 1; // 1 point per like
        
        // Total points
        const totalPoints = votePoints + ratingPoints + likePoints;
        
        // Store points in the product object for sorting
        (product as ProductWithPoints).points = totalPoints;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`  ${product.id} (${product.name}): ${votePoints} vote points + ${ratingPoints} rating points + ${likePoints} like points = ${totalPoints} total points`);
        }
      });
      
      // Sort products by total points (descending)
      subcategoryProducts.sort((a, b) => {
        // Higher points should get lower rank numbers (rank 1 is the best)
        return ((a as ProductWithPoints).points || 0) - ((b as ProductWithPoints).points || 0);
      });
      
      // Log sorted products
      if (process.env.NODE_ENV === 'development') {
        console.log(`Products in ${subcategory} after sorting by points:`);
        subcategoryProducts.forEach((p, i) => {
          console.log(`  ${i+1}. ${p.id} (${p.name}): ${(p as ProductWithPoints).points} points (votes=${p.votes}, rating=${p.rating}, likes=${p.likes})`);
        });
      }
      
      // Assign ranks based on the sorted order - products with more points get lower rank numbers
      subcategoryProducts.forEach((product, index) => {
        // Rank starts from 1, with highest points getting rank 1
        const totalProducts = subcategoryProducts.length;
        product.rank = totalProducts - index; // Reverse the rank assignment
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Assigned rank ${product.rank} to product ${product.id} (${product.name}) with ${(product as ProductWithPoints).points} points`);
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
        rank: p.rank,
        points: (p as ProductWithPoints).points
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
      
      // If neither has a rank, sort by points
      const aPoints = (a as ProductWithPoints).points || 0;
      const bPoints = (b as ProductWithPoints).points || 0;
      // Higher points should come first
      return bPoints - aPoints;
    });
    
    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log("Products after sorting:", sortedProducts.map(p => ({
        id: p.id,
        name: p.name,
        votes: p.votes,
        rating: p.rating,
        likes: p.likes,
        rank: p.rank,
        points: (p as ProductWithPoints).points
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
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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