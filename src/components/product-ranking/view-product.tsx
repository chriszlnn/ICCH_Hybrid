"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, ArrowLeft, MessageSquare } from "lucide-react"
//import { mockProducts } from "./mock-data" // This will be replaced with API calls
import { ReviewSection } from "./review-section"
import { WriteReviewModal } from "./write-review-modal"
import { AnimatedHeart } from "../ui/animated-heart"
import { AddToRecommendationsButton } from "../product/add-to-recommendations-button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product, Review } from "./types"
import { toast } from "../ui/toast/use-toast"
//import { mockReviews } from "./review-data" // Import mock reviews

// Define a type for vote objects coming from the API
interface VoteData {
  createdAt: string;
  userId: string;
  productId: string;
  [key: string]: unknown;
}

// Define or reuse the interface for votes with timestamps
interface VoteWithTimestamp {
  createdAt: string;
  userId?: string;
  productId?: string;
  [key: string]: unknown;
}

// After the existing VoteWithTimestamp interface, add a new interface for products with vote arrays
interface ProductWithVotesArray {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  rank?: number;
  rating?: number;
  reviewCount?: number;
  likes?: number;
  votes: VoteWithTimestamp[];
  [key: string]: unknown;
}

export function ViewProduct() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [nextVoteDate, setNextVoteDate] = useState<Date | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewCallbacks, setReviewCallbacks] = useState<((review: Review) => void)[]>([])
  const reviewSectionRef = useRef<HTMLDivElement>(null)

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true)
        
        // Clean up expired votes before fetching product data
        try {
          const cleanupResponse = await fetch('/api/product/cleanup-votes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (cleanupResponse.ok) {
            console.log('Expired votes cleanup completed before loading product');
          }
        } catch (cleanupError) {
          console.error('Error cleaning up votes:', cleanupError);
          // Continue with product fetch even if cleanup fails
        }
        
        // Fetch product details
        console.log(`Fetching details for product ID: ${productId}`);
        const productResponse = await fetch(`/api/product/${productId}`)
        if (!productResponse.ok) throw new Error('Failed to fetch product')
        
        const { product: productData, hasVoted: initialHasVoted, nextVoteDate: initialNextVoteDate } = await productResponse.json()
        if (!productData) throw new Error('Product data not found')
        
        console.log('Raw product data from API:', productData);
        
        // Process votes and calculate metrics correctly
        let processedProduct: Product;
        
        // Filter votes to only include those from the past week
        if (productData && productData.votes && Array.isArray(productData.votes)) {
          const currentDate = new Date();
          const oneWeekAgo = new Date(currentDate);
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          // Type assertion for the votes array
          const votesArray = productData.votes as VoteData[];
          
          const validVotes = votesArray.filter(vote => {
            if (!vote.createdAt) return false;
            const voteDate = new Date(vote.createdAt);
            return voteDate >= oneWeekAgo;
          });
          
          // Create a new product object with the updated vote count
          processedProduct = {
            ...productData,
            votes: validVotes.length,
            reviewCount: validVotes.length
          };
        } else {
          // If votes is not an array or doesn't exist, use product as-is
          processedProduct = productData;
        }
        
        // Ensure all ranking metrics are properly set
        processedProduct = {
          ...processedProduct,
          votes: typeof processedProduct.votes === 'number' ? processedProduct.votes : 0,
          rating: typeof processedProduct.rating === 'number' ? processedProduct.rating : 0,
          likes: typeof processedProduct.likes === 'number' ? processedProduct.likes : 0,
          rank: typeof processedProduct.rank === 'number' ? processedProduct.rank : 0
        };
        
        // Now fetch all products in the same subcategory to calculate the correct rank
        // This ensures consistency with the product-ranking.tsx methodology
        if (processedProduct.subcategory) {
          console.log(`Fetching all products in subcategory: ${processedProduct.subcategory} to calculate rank`);
          
          try {
            // Construct URL to get all products in the same category/subcategory
            const categoryParam = processedProduct.category || '';
            const subcategoryParam = processedProduct.subcategory || '';
            
            let url = `/api/product?`;
            if (categoryParam) url += `category=${categoryParam}&`;
            if (subcategoryParam) url += `subcategory=${subcategoryParam}`;
            
            const subcategoryProductsResponse = await fetch(url);
            if (subcategoryProductsResponse.ok) {
              const subcategoryProducts = await subcategoryProductsResponse.json();
              
              console.log(`Found ${subcategoryProducts.length} products in the same subcategory`);
              
              // Process products in the same way as in product-ranking.tsx
              const processedProducts = subcategoryProducts.map((product: Product | ProductWithVotesArray) => {
                let validVoteCount = 0;
                
                // Handle if votes is an array
                if (product.votes && Array.isArray(product.votes)) {
                  const currentDate = new Date();
                  const oneWeekAgo = new Date(currentDate);
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  
                  const validVotes = product.votes.filter((vote: VoteWithTimestamp) => {
                    if (!vote.createdAt) return false;
                    const voteDate = new Date(vote.createdAt);
                    return voteDate >= oneWeekAgo;
                  });
                  
                  validVoteCount = validVotes.length;
                } else {
                  // For products with numeric votes
                  validVoteCount = typeof product.votes === 'number' ? product.votes : 0;
                }
                
                // Create a consistent product object with updated votes
                return {
                  ...product,
                  votes: validVoteCount,
                  reviewCount: validVoteCount,
                  rating: typeof product.rating === 'number' ? product.rating : 0,
                  likes: typeof product.likes === 'number' ? product.likes : 0
                };
              });
              
              // Sort products based on the available metrics, prioritizing votes > ratings > likes
              // This replicates the logic in product-ranking.tsx
              const hasVotes = processedProducts.some((p: Product) => p.votes > 0);
              const hasRatings = processedProducts.some((p: Product) => p.rating > 0);
              const hasLikes = processedProducts.some((p: Product) => p.likes > 0);
              
              if (hasVotes) {
                console.log(`Subcategory has products with votes - sorting by vote count`);
                processedProducts.sort((a: Product, b: Product) => {
                  const aVotes = typeof a.votes === 'number' ? a.votes : 0;
                  const bVotes = typeof b.votes === 'number' ? b.votes : 0;
                  
                  // If only one has actual votes, that one goes first
                  const aHasActualVotes = aVotes > 0;
                  const bHasActualVotes = bVotes > 0;
                  
                  if (aHasActualVotes && !bHasActualVotes) return -1;
                  if (!aHasActualVotes && bHasActualVotes) return 1;
                  
                  // Otherwise, sort by vote count
                  return bVotes - aVotes;
                });
              } else if (hasRatings) {
                console.log(`Subcategory has products with ratings - sorting by rating`);
                processedProducts.sort((a: Product, b: Product) => {
                  return (b.rating || 0) - (a.rating || 0);
                });
              } else if (hasLikes) {
                console.log(`Subcategory has products with likes - sorting by likes`);
                processedProducts.sort((a: Product, b: Product) => {
                  return (b.likes || 0) - (a.likes || 0);
                });
              }
              
              // Assign ranks based on the sorted order
              processedProducts.forEach((product: Product, index: number) => {
                if (product.votes > 0 || product.rating > 0 || product.likes > 0) {
                  product.rank = index + 1;
                } else {
                  product.rank = 0;
                }
              });
              
              // Find our product in the sorted list to get its correct rank
              const ourProductWithRank = processedProducts.find((p: Product) => p.id === productId);
              if (ourProductWithRank) {
                console.log(`Found our product with recalculated rank: ${ourProductWithRank.rank}`);
                processedProduct.rank = ourProductWithRank.rank;
              } else {
                console.warn(`Could not find our product in the subcategory products list`);
              }
            }
          } catch (subcategoryError) {
            console.error('Error fetching subcategory products for ranking:', subcategoryError);
            // Continue with the existing product data even if subcategory ranking fails
          }
        } else {
          console.log('Product has no subcategory, cannot calculate subcategory-specific rank');
          
          // Ensure rank is properly calculated for products without subcategory
          if (processedProduct.votes > 0 || processedProduct.rating > 0 || processedProduct.likes > 0) {
            // If the server provided a rank, use it; otherwise, determine a default value
            if (!processedProduct.rank || processedProduct.rank === 0) {
              processedProduct.rank = 1;
              console.log(`Assigned default rank 1 for product with ranking attributes but no server rank`);
            }
          } else {
            // Product has no ranking attributes, so rank should be 0
            processedProduct.rank = 0;
          }
        }
        
        console.log('Final processed product data:', {
          id: processedProduct.id,
          name: processedProduct.name,
          votes: processedProduct.votes,
          rating: processedProduct.rating,
          likes: processedProduct.likes,
          rank: processedProduct.rank
        });
        
        // Set product state with processed data
        setProduct(processedProduct);
        setHasVoted(initialHasVoted);
        if (initialNextVoteDate) {
          setNextVoteDate(new Date(initialNextVoteDate));
        }
        
        // Fetch reviews
        const reviewsResponse = await fetch(`/api/product/${productId}/reviews`)
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews')
        setReviews(await reviewsResponse.json())
    
        // Check like status
        const likeResponse = await fetch(`/api/product/${productId}/like`)
        if (likeResponse.ok) setIsLiked((await likeResponse.json()).isLiked)
      } catch (err) {
        console.error('Error in fetchProductData:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [productId])


  // Get the week number for vote tracking
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // BACKEND INTEGRATION POINT:
  // Replace with API call to toggle product like status
  const toggleLike = async () => {
    try {
      const response = await fetch(`/api/product/${productId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Update local state for immediate feedback
        setIsLiked(!isLiked)
        
        // Optimistically update product likes count
        if (product) {
          const updatedLikes = isLiked ? product.likes - 1 : product.likes + 1;
          
          // First update with optimistic change for better UI responsiveness
          setProduct({
            ...product,
            likes: updatedLikes
          });
          
          // Then fetch the latest product data to ensure everything is in sync
          try {
            // Clean up votes to ensure we have the most up-to-date data
            await fetch('/api/product/cleanup-votes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            // Fetch the latest product data
            console.log('Refreshing product data after like action');
            const refreshResponse = await fetch(`/api/product/${productId}`);
            if (refreshResponse.ok) {
              const { product: refreshedProduct } = await refreshResponse.json();
              
              console.log('Refreshed product data:', refreshedProduct);
              
              if (refreshedProduct) {
                // Process the refreshed product to ensure all fields are properly set
                const processedProduct = {
                  ...refreshedProduct,
                  // If the server didn't update the likes count yet, keep our optimistic update
                  likes: refreshedProduct.likes === product.likes ? updatedLikes : refreshedProduct.likes,
                  // Ensure all fields are numbers
                  votes: typeof refreshedProduct.votes === 'number' ? refreshedProduct.votes : 0,
                  rating: typeof refreshedProduct.rating === 'number' ? refreshedProduct.rating : 0,
                  reviewCount: typeof refreshedProduct.reviewCount === 'number' ? refreshedProduct.reviewCount : 0
                };
                
                // Ensure rank is proper
                // If product has metrics but no rank, assign rank 1
                if ((processedProduct.votes > 0 || processedProduct.rating > 0 || processedProduct.likes > 0) && 
                    (!processedProduct.rank || processedProduct.rank === 0)) {
                  processedProduct.rank = 1;
                }
                
                console.log('Processed product after like:', {
                  id: processedProduct.id,
                  name: processedProduct.name,
                  likes: processedProduct.likes,
                  rank: processedProduct.rank
                });
                
                setProduct(processedProduct);
              }
            }
          } catch (refreshError) {
            console.error('Error refreshing product data after like:', refreshError);
            // Keep the optimistic update even if refresh fails
          }
        }
      } else {
        throw new Error('Failed to toggle like')
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const openReviewModal = () => {
    setIsReviewModalOpen(true)
  }

  const closeReviewModal = () => {
    setIsReviewModalOpen(false)
  }

  const handleAddReview = (newReview: Review) => {
    setReviews([newReview, ...reviews])
    // Update product rating
    if (product) {
      const newTotal = (product.rating * product.reviewCount) + newReview.rating
      const newAverage = newTotal / (product.reviewCount + 1)
      setProduct({
        ...product,
        rating: newAverage,
        reviewCount: product.reviewCount + 1
      })
    }
    // Notify all review callbacks
    reviewCallbacks.forEach(callback => callback(newReview))
    closeReviewModal()

    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const subscribeToReviews = (callback: (review: Review) => void) => {
    setReviewCallbacks(prev => [...prev, callback])
    return () => {
      setReviewCallbacks(prev => prev.filter(cb => cb !== callback))
    }
  }

  const openVoteDialog = () => {
    setIsVoteDialogOpen(true)
  }

  const handleVote = async () => {
    if (!product) return;
    
    setIsVoting(true);
    try {
      console.log(`Submitting vote for product: ${productId} (${product.name})`);
      
      const response = await fetch(`/api/product/${productId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          // Include additional details to ensure correct identification
          productName: product.name
        })
      });
  
      if (response.ok) {
        const { product: updatedProduct, nextVoteDate } = await response.json();
        
        // Verify the product ID is correct
        if (updatedProduct.id !== productId) {
          console.error('Server returned wrong product ID!', {
            expected: productId,
            received: updatedProduct.id
          });
          throw new Error('Server returned incorrect product data');
        }
        
        console.log(`Vote successful for product: ${productId}`, updatedProduct);
        
        setHasVoted(true);
        setIsVoteDialogOpen(false);
        
        if (nextVoteDate) {
          setNextVoteDate(new Date(nextVoteDate));
        }
        
        // Clean up votes to ensure we have the most up-to-date data
        await fetch('/api/product/cleanup-votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Make sure we have a valid rank
        if (updatedProduct) {
          // If rank is missing, set to current rank or default to 0
          if (updatedProduct.rank === undefined) {
            updatedProduct.rank = product.rank || 0;
          }
          
          // Make sure votes and reviewCount are updated correctly
          if (Array.isArray(updatedProduct.votes)) {
            const currentDate = new Date();
            const oneWeekAgo = new Date(currentDate);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const validVotes = updatedProduct.votes.filter((vote: VoteData) => {
              if (!vote.createdAt) return false;
              const voteDate = new Date(vote.createdAt);
              return voteDate >= oneWeekAgo;
            });
            
            updatedProduct.votes = validVotes.length;
            updatedProduct.reviewCount = validVotes.length;
          } else if (typeof updatedProduct.votes === 'number') {
            // Make sure reviewCount matches votes
            updatedProduct.reviewCount = updatedProduct.votes;
          }
          
          // Fetch the latest rank for this product from the API
          try {
            const rankResponse = await fetch(`/api/product/${productId}`);
            if (rankResponse.ok) {
              const { product: latestProduct } = await rankResponse.json();
              if (latestProduct && latestProduct.rank) {
                // Use the latest rank from the API
                updatedProduct.rank = latestProduct.rank;
                console.log(`Updated product rank to ${latestProduct.rank}`);
              }
            }
          } catch (rankError) {
            console.error('Error fetching latest product rank:', rankError);
          }
          
          setProduct(updatedProduct);
        }
        
        toast({
          title: "Vote Submitted",
          description: "Thank you for your vote! You can vote again in 7 days.",
        });
      } else {
        const errorData = await response.json();
        if (errorData.nextVoteDate) {
          setNextVoteDate(new Date(errorData.nextVoteDate));
        }
        throw new Error(errorData.error || 'Failed to submit vote');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <button onClick={handleGoBack} className="px-4 py-2 bg-green-600 text-white rounded-md">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <button onClick={handleGoBack} className="flex items-center text-gray-700 hover:text-green-600">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        {/* Left Side - Product Image */}
        <div className="md:w-1/2 p-4 md:sticky md:top-20 md:self-start max-h-[calc(100vh-5rem)] overflow-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={product.image || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Side - Product Details & Reviews (Scrollable) */}
        <div className="md:w-1/2 p-4 overflow-auto">
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-green-600 font-medium mb-1">
                {product.subcategory 
                  ? capitalizeFirstLetter(product.subcategory)
                  : 'Uncategorized'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name || 'Product Name Not Available'}</h1>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium text-gray-900">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                </div>
                <span className="mx-2 text-gray-500">({product.votes || 0} votes)</span>
                {product.rank > 0 ? (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Rank #{product.rank}
                    {product.votes > 0 && <span className="ml-1 text-xs">(by votes)</span>}
                    {product.votes === 0 && product.rating > 0 && <span className="ml-1 text-xs">(by rating)</span>}
                    {product.votes === 0 && product.rating === 0 && product.likes > 0 && <span className="ml-1 text-xs">(by likes)</span>}
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    No Rank
                  </div>
                )}
                
                {/* Debug info - remove in production */}
                <div className="ml-2 text-xs text-gray-500">
                  (Likes: {product.likes}, Votes: {product.votes}, Rating: {product.rating})
                </div>
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="text-3xl font-bold text-gray-900 mb-6">RM{product.price ? product.price.toFixed(2) : '0.00'}</div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={openVoteDialog}
                    disabled={hasVoted}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {hasVoted ? 'Already Voted' : 'Vote for Product'}
                  </Button>
                  <AnimatedHeart 
                    isLiked={isLiked} 
                    onClick={toggleLike}
                    className={isLiked ? 'text-red-500' : ''}
                  />
                  <AddToRecommendationsButton productId={productId} />
                </div>
                {hasVoted && nextVoteDate && (
                  <div className="text-sm text-gray-500">
                    You can vote again on {nextVoteDate.toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center text-gray-700 hover:text-green-600"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <span>Write a Review</span>
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div ref={reviewSectionRef}>
              <ReviewSection
                productId={productId}
                productRating={product.rating}
                reviewCount={product.reviewCount}
                onWriteReviewClick={openReviewModal}
                reviews={reviews}
                onReviewAdded={subscribeToReviews}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Write Review Button (Mobile Only) - Moved up to avoid being cropped */}
      <div className="md:hidden fixed bottom-20 right-6">
        <button
          onClick={openReviewModal}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <WriteReviewModal productId={productId} onClose={closeReviewModal} onReviewAdded={handleAddReview} />
      )}

      {/* Vote Confirmation Dialog */}
      <Dialog open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              You are about to vote for {product.name}. This action cannot be undone and you can only vote once per
              week.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-3">
            <div className="bg-gray-100 p-2 rounded-md">
              <img
                src={product.image || "/placeholder.svg?height=100&width=100"}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
            </div>
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">{product.subcategory}</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsVoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleVote} 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isVoting}
            >
              {isVoting ? "Submitting..." : "Confirm Vote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

