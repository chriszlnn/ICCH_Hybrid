"use client"

import { useState, useEffect } from "react"
import { ProductVotesTable } from "./product-votes-table"
import { ProductStats } from "./product-stats"
import { ProductReviews } from "./product-reviews"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, MessageSquare, Filter, Vote } from "lucide-react"
import type { Product, Category } from "../product-ranking/types"
import { categoryOptions } from "../product-ranking/mock-data"
import { toast } from "sonner"

// Define interfaces for handling votes with timestamps
interface VoteWithTimestamp {
  createdAt: string;
  userId?: string;
  productId?: string;
  [key: string]: unknown;
}

interface ProductWithVotesArray extends Omit<Product, 'votes'> {
  votes: VoteWithTimestamp[];
}

// Type guard to check if a product has votes as an array
function hasVotesArray(product: Product | ProductWithVotesArray): product is ProductWithVotesArray {
  return Array.isArray((product as ProductWithVotesArray).votes);
}

export function ProductVotes() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now()) // Track last update time

  // Check URL for productId parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productIdFromUrl = urlParams.get('productId');
    
    if (productIdFromUrl && products.length > 0) {
      const productFromUrl = products.find(p => p.id === productIdFromUrl);
      if (productFromUrl) {
        setSelectedProduct(productFromUrl);
        
        // Update category and subcategory filters to match the selected product
        if (productFromUrl.category) {
          setSelectedCategory(productFromUrl.category as Category);
        }
        if (productFromUrl.subcategory) {
          setSelectedSubcategory(productFromUrl.subcategory);
        }
        
        // Update URL without the parameter to prevent reselection on page refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [products]);

  // Function to refresh product data
  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      if (selectedSubcategory) {
        params.append("subcategory", selectedSubcategory)
      }
      
      // Add a timestamp to bypass cache
      params.append("_t", Date.now().toString())
      
      const response = await fetch(`/api/votes/top?${params.toString()}`)
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Process products and calculate ranks based on priority
      const processedProducts = calculateProductRanks(data.products);
      
      // Update selected product with fresh data if it exists
      if (selectedProduct) {
        const updatedSelectedProduct = processedProducts.find(p => p.id === selectedProduct.id);
        if (updatedSelectedProduct) {
          setSelectedProduct(updatedSelectedProduct);
        }
      }
      
      setProducts(processedProducts);
      console.log("Products refreshed with updated ranks");
    } catch (error) {
      console.error("Failed to refresh products", error)
      toast.error("Failed to refresh products")
    } finally {
      setIsLoading(false)
    }
  };

  // Fetch products with votes
  useEffect(() => {
    refreshProducts();
  }, [selectedCategory, selectedSubcategory, lastUpdate])
  
  // Set up a refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  // Function to calculate ranks based on priority: votes > stars > likes
  const calculateProductRanks = (apiProducts: (Product | ProductWithVotesArray)[]): Product[] => {
    // Current date for comparing vote expiration
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    console.log(`Processing ${apiProducts.length} products for ranking`);
    
    // Process each product to handle expired votes
    const processedProducts = apiProducts.map(product => {
      let validVoteCount = 0;
      
      // Use type guard to check if product has votes as an array
      if (hasVotesArray(product)) {
        const votesArray = product.votes || [];
        
        // Filter out expired votes
        const validVotes = votesArray.filter(vote => {
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
        reviewCount: validVoteCount, // Make sure reviewCount matches votes for consistency
        // Ensure other ranking factors are numbers
        rating: typeof product.rating === 'number' ? product.rating : 0,
        likes: typeof product.likes === 'number' ? product.likes : 0
      } as Product;
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
    
    // For each subcategory, rank products based on priority: votes > ratings > likes
    Object.keys(productsBySubcategory).forEach(subcategory => {
      const subcategoryProducts = productsBySubcategory[subcategory];
      
      console.log(`Calculating ranks for subcategory: ${subcategory} (${subcategoryProducts.length} products)`);
      console.log(`Products in ${subcategory} before sorting:`, subcategoryProducts.map(p => ({
        id: p.id,
        name: p.name,
        votes: p.votes,
        rating: p.rating,
        likes: p.likes
      })));
      
      // First check what metrics are available in this subcategory
      const hasVotes = subcategoryProducts.some(p => p.votes > 0);
      const hasRatings = subcategoryProducts.some(p => p.rating > 0);
      const hasLikes = subcategoryProducts.some(p => p.likes > 0);
      
      console.log(`Subcategory ${subcategory} metrics availability: hasVotes=${hasVotes}, hasRatings=${hasRatings}, hasLikes=${hasLikes}`);
      
      // Sort based on the available metrics, prioritizing votes > ratings > likes
      if (hasVotes) {
        console.log(`Subcategory ${subcategory} has products with votes - sorting by vote count`);
        subcategoryProducts.sort((a, b) => {
          // Check if products have valid vote counts
          const aVotes = typeof a.votes === 'number' ? a.votes : 0;
          const bVotes = typeof b.votes === 'number' ? b.votes : 0;
          
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
        console.log(`Subcategory ${subcategory} has products with ratings - sorting by rating`);
        subcategoryProducts.sort((a, b) => {
          return (b.rating || 0) - (a.rating || 0);
        });
      } else if (hasLikes) {
        console.log(`Subcategory ${subcategory} has products with likes - sorting by likes`);
        subcategoryProducts.sort((a, b) => {
          return (b.likes || 0) - (a.likes || 0);
        });
      } else {
        console.log(`Subcategory ${subcategory} has no votes, ratings, or likes - sorting by ID for stability`);
        // Sort by ID for stability if no other metrics
        subcategoryProducts.sort((a, b) => {
          return (a.id || '').localeCompare(b.id || '');
        });
      }
      
      console.log(`Products in ${subcategory} after sorting:`, subcategoryProducts.map((p, i) => ({
        position: i+1,
        id: p.id,
        name: p.name,
        votes: p.votes,
        rating: p.rating,
        likes: p.likes
      })));
      
      // Assign ranks based on the sorted order and available metrics
      subcategoryProducts.forEach((product, index) => {
        // Always assign a rank if the product has ANY ranking attribute (votes, rating, or likes)
        if (product.votes > 0 || product.rating > 0 || product.likes > 0) {
          product.rank = index + 1;
          console.log(`Assigned rank ${product.rank} to product ${product.id} (${product.name}) - votes: ${product.votes}, rating: ${product.rating}, likes: ${product.likes}`);
        } else {
          // No metrics available
          product.rank = 0;
          console.log(`Product ${product.id} (${product.name}) has no ranking metrics - assigned rank 0`);
        }
      });
    });
    
    // Double-check that all products with likes or ratings have proper ranks
    processedProducts.forEach(product => {
      // If a product has ANY ranking metric but didn't get a rank assigned, fix it
      if ((product.likes > 0 || product.rating > 0 || product.votes > 0) && 
          (!product.rank || product.rank === 0)) {
        console.log(`WARNING: Product ${product.id} (${product.name}) has ranking metrics but no rank assigned. Assigning rank 1.`);
        product.rank = 1;
      }
    });
    
    // Log all products with their ranks for debugging
    console.log('All products after ranking:', processedProducts.map(p => ({
      id: p.id,
      name: p.name,
      votes: p.votes,
      rating: p.rating,
      likes: p.likes,
      rank: p.rank,
      subcategory: p.subcategory
    })));
    
    // Return all products with updated ranks
    return processedProducts;
  };

  // Get the current category data
  const currentCategoryData =
    selectedCategory !== "all" ? categoryOptions.find((cat) => cat.id === selectedCategory) : null

  const handleCategoryChange = (category: Category | "all") => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
    setSelectedProduct(null)
  }

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
    setSelectedProduct(null)
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    
    // If the product has been updated (e.g., likes changed) but rank not recalculated
    if (product.likes > 0 && product.rank === 0) {
      console.log(`Selected product ${product.id} has likes but no rank - triggering refresh`);
      refreshProducts();
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
        <h1 className="text-2xl font-bold flex items-center text-gray-900">
          <Vote className="h-6 w-6 mr-2 text-green-600" />
          Product Votes Dashboard
        </h1>
        <p className="text-gray-500 mt-2">Monitor product performance, votes, and customer reviews in real-time</p>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center mb-3">
          <Filter className="h-5 w-5 mr-2 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-800">Filter by Category</h2>
        </div>

        {/* Main Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-green-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Subcategories - only show if a category is selected */}
        {currentCategoryData && (
          <div className="flex flex-wrap gap-2 mt-2">
            {currentCategoryData.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryChange(subcategory.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedSubcategory === subcategory.id
                    ? "bg-green-100 text-green-800 border border-green-600"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {subcategory.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductVotesTable
            products={products}
            onSelectProduct={handleProductSelect}
            selectedProductId={selectedProduct?.id}
          />
        </div>

        <div className="lg:col-span-1">
          {selectedProduct ? (
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="stats" className="flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Stats
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="stats" className="mt-4">
                <ProductStats product={selectedProduct} />
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <ProductReviews productId={selectedProduct.id} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 text-center">
              <Vote className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Product</h3>
              <p className="text-gray-500">Choose a product from the list to view its statistics and reviews</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

