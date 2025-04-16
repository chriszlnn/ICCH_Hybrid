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
      
      // Important: When "all" is selected, don't send any category/subcategory params
      // to ensure we get all products from all categories
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
        if (selectedSubcategory) {
          params.append("subcategory", selectedSubcategory)
        }
      }
      
      // Add a timestamp to bypass cache
      params.append("_t", Date.now().toString())
      
      // Log the request URL for debugging
      const url = `/api/votes/top?${params.toString()}`
      console.log('Fetching products from:', url);
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Log received products for debugging
      console.log('Received products:', data.products);
      console.log('Products count:', data.products.length);
      
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
    if (process.env.NODE_ENV === 'development') {
      console.log('Starting rank calculation for', apiProducts.length, 'products');
    }

    // Process each product to handle expired votes and ensure consistent data
    const processedProducts = apiProducts.map(product => {
      let validVoteCount = 0;
      
      // Use type guard to check if product has votes as an array
      if (hasVotesArray(product)) {
        const votesArray = product.votes || [];
        
        // Filter out expired votes
        const validVotes = votesArray.filter(vote => {
          if (!vote.createdAt) return false;
          const voteDate = new Date(vote.createdAt);
          const now = new Date();
          const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
          return voteDate >= oneWeekAgo;
        });
        
        validVoteCount = validVotes.length;
      } else {
        validVoteCount = typeof product.votes === 'number' ? product.votes : 0;
      }
      
      // Create a consistent product object with updated votes
      // Ensure rating is properly handled - default to 0 if undefined/null/NaN
      const rating = typeof product.rating === 'number' && !isNaN(product.rating) ? product.rating : 0;
      const likes = typeof product.likes === 'number' ? product.likes : 0;
      
      // Calculate points immediately
      const points = (validVoteCount * 3) + (rating * 2) + (likes * 1);
      
      return {
        ...product,
        votes: validVoteCount,
        reviewCount: validVoteCount,
        rating: rating,
        likes: likes,
        points: points,
        rank: 0 // Initialize rank to 0, will be set based on points
      } as Product & { points: number };
    });

    // Sort products by points and other criteria
    processedProducts.sort((a, b) => {
      // First compare points
      if (a.points !== b.points) {
        return b.points - a.points;
      }
      
      // If points are equal, compare individual metrics in priority order
      if (a.votes !== b.votes) {
        return b.votes - a.votes;
      }
      
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      
      if (a.likes !== b.likes) {
        return b.likes - a.likes;
      }
      
      // If all metrics are equal, sort alphabetically for stability
      return a.name.localeCompare(b.name);
    });

    // Assign ranks based on sorted order
    let currentRank = 1;
    let previousPoints = -1;
    
    processedProducts.forEach(product => {
      if (product.points > 0) {
        // Only increment rank if points are different from previous product
        // This ensures products with equal points get the same rank
        if (product.points !== previousPoints) {
          currentRank = processedProducts.filter(p => p.points > product.points).length + 1;
        }
        product.rank = currentRank;
        previousPoints = product.points;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Product: ${product.name} (${product.category})
            Points: ${product.points} (Rank: ${product.rank})
            - Votes: ${product.votes} (${product.votes * 3} points)
            - Rating: ${product.rating} (${product.rating * 2} points)
            - Likes: ${product.likes} (${product.likes * 1} points)`);
        }
      } else {
        product.rank = 0;
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('\nFinal Rankings:');
      processedProducts
        .filter(p => p.points > 0)
        .sort((a, b) => a.rank - b.rank)
        .forEach(p => {
          console.log(`Rank ${p.rank}: ${p.name} - ${p.points} points
            - Votes: ${p.votes} (${p.votes * 3} points)
            - Rating: ${p.rating.toFixed(1)} (${(p.rating * 2).toFixed(1)} points)
            - Likes: ${p.likes} (${p.likes} points)`);
        });
    }

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

