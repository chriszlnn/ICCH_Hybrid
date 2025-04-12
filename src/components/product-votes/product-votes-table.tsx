"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search, ArrowUpDown, Trophy, Heart, Star, Filter, Sparkles, BarChart3, ThumbsUp } from "lucide-react"
import type { Product } from "../product-ranking/types"
import React from "react"
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { Badge } from "@/components/ui/badge"

interface ProductVotesTableProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
  selectedProductId?: string
}

type SortField = "category" | "subcategory" | "votes" | "likes" | "rating"
type SortDirection = "asc" | "desc"

// Function to determine what contributes most to the product's rank
function getRankSource(product: Product): { source: 'votes' | 'rating' | 'likes', icon: React.ReactElement } {
  if (product.votes > 0) {
    return {
      source: 'votes',
      icon: <BarChart3 className="h-3 w-3 text-green-700" />
    };
  } else if (product.rating > 0) {
    return {
      source: 'rating',
      icon: <Star className="h-3 w-3 text-yellow-500" />
    };
  } else {
    return {
      source: 'likes',
      icon: <ThumbsUp className="h-3 w-3 text-blue-500" />
    };
  }
}

export function ProductVotesTable({ products, onSelectProduct, selectedProductId }: ProductVotesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("votes")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  // Filter products by search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // First sort by rank to ensure 1st, 2nd, 3rd ranks appear in order
    // Products with no rank (rank = 0) should appear at the bottom
    if (a.rank !== 0 && b.rank === 0) return -1;
    if (a.rank === 0 && b.rank !== 0) return 1;
    if (a.rank !== 0 && b.rank !== 0) {
      const rankComparison = a.rank - b.rank;
      if (rankComparison !== 0) return rankComparison;
    }

    // Handle sorting based on the selected sort field
    let comparison = 0;
    
    switch (sortField) {
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      case "subcategory":
        comparison = a.subcategory.localeCompare(b.subcategory);
        break;
      case "votes":
        // Use votes directly instead of reviewCount
        comparison = (b.votes || 0) - (a.votes || 0); // Descending by default
        break;
      case "likes":
        comparison = (b.likes || 0) - (a.likes || 0); // Descending by default
        break;
      case "rating":
        comparison = (b.rating || 0) - (a.rating || 0); // Descending by default
        break;
      default:
        // If no specific sort field or if it's the default view,
        // apply the priority ranking (votes > rating > likes)
        const aVotes = typeof a.votes === 'number' ? a.votes : 0;
        const bVotes = typeof b.votes === 'number' ? b.votes : 0;
        
        if (aVotes > 0 || bVotes > 0) {
          // If only one has votes, that one goes first
          if (aVotes > 0 && bVotes === 0) return -1;
          if (aVotes === 0 && bVotes > 0) return 1;
          // If both have votes, sort by vote count
          if (aVotes !== bVotes) return bVotes - aVotes;
        }
        
        // If neither has votes or they're equal, check ratings
        const aRating = typeof a.rating === 'number' ? a.rating : 0;
        const bRating = typeof b.rating === 'number' ? b.rating : 0;
        
        if (aRating > 0 || bRating > 0) {
          // If only one has rating, that one goes first
          if (aRating > 0 && bRating === 0) return -1;
          if (aRating === 0 && bRating > 0) return 1;
          // If both have ratings, sort by rating
          if (aRating !== bRating) return bRating - aRating;
        }
        
        // Finally, check likes
        const aLikes = typeof a.likes === 'number' ? a.likes : 0;
        const bLikes = typeof b.likes === 'number' ? b.likes : 0;
        
        if (aLikes > 0 || bLikes > 0) {
          // If only one has likes, that one goes first
          if (aLikes > 0 && bLikes === 0) return -1;
          if (aLikes === 0 && bLikes > 0) return 1;
          // If both have likes, sort by likes count
          if (aLikes !== bLikes) return bLikes - aLikes;
        }
        
        // If still tied, sort by name for stability
        return a.name.localeCompare(b.name);
    }
    
    // Apply sort direction
    return sortDirection === "asc" ? comparison : -comparison;
  })
  
  // Calculate proper rank for each product based on its metrics
  // This ensures ranks are calculated even if the database value is missing
  const productsWithCalculatedRanks = [...sortedProducts];
  
  // Group products by subcategory for rank calculation
  const productsBySubcategory: Record<string, Product[]> = {};
  
  productsWithCalculatedRanks.forEach(product => {
    const subcategory = product.subcategory || 'uncategorized';
    if (!productsBySubcategory[subcategory]) {
      productsBySubcategory[subcategory] = [];
    }
    productsBySubcategory[subcategory].push(product);
  });
  
  // Process each subcategory to properly assign ranks
  Object.keys(productsBySubcategory).forEach(subcategory => {
    const subcategoryProducts = productsBySubcategory[subcategory];
    
    // Sort by priority: votes > rating > likes
    subcategoryProducts.sort((a, b) => {
      // Check votes first
      if (a.votes !== b.votes) return b.votes - a.votes;
      // Then rating
      if (a.rating !== b.rating) return b.rating - a.rating;
      // Then likes
      if (a.likes !== b.likes) return b.likes - a.likes;
      return 0;
    });
    
    // Assign ranks based on the sorted order
    subcategoryProducts.forEach((product, index) => {
      if (product.votes > 0 || product.rating > 0 || product.likes > 0) {
        // If product has any metrics, assign a rank
        product.rank = index + 1;
      } else {
        // No ranking metrics
        product.rank = 0;
      }
    });
  });
  
  // Now resort the products for display based on rank
  const finalSortedProducts = productsWithCalculatedRanks.sort((a, b) => {
    // Products with rank come before products without rank
    if ((a.rank > 0) && (b.rank === 0)) return -1;
    if ((a.rank === 0) && (b.rank > 0)) return 1;
    
    // Both have ranks - sort by rank ascending (1, 2, 3...)
    if (a.rank > 0 && b.rank > 0) {
      return a.rank - b.rank;
    }
    
    // For products without ranks, sort by the selected sort field
    let comparison = 0;
    
    switch (sortField) {
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      case "subcategory":
        comparison = a.subcategory.localeCompare(b.subcategory);
        break;
      case "votes":
        comparison = (b.votes || 0) - (a.votes || 0);
        break;
      case "likes":
        comparison = (b.likes || 0) - (a.likes || 0);
        break;
      case "rating":
        comparison = (b.rating || 0) - (a.rating || 0);
        break;
      default:
        // Default sort by name
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
    return <ArrowUpDown className={`ml-2 h-4 w-4 text-green-600 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
  }

  // Get rank badge styling based on position
  const getRankBadge = (product: Product) => {
    // Don't show rank for products with no metrics
    if (product.rank === 0) {
      return <span className="text-gray-300">-</span>;
    }
    
    // Use the getRankSource function to determine the ranking source
    const { source, icon } = getRankSource(product);
    
    // Only products with actual rank (> 0) should get badges
    if (product.rank === 1) {
      return (
        <div className="relative">
          <Trophy className={`h-5 w-5 text-amber-500`} />
          {source !== "votes" && 
            <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white flex items-center justify-center">
              {icon}
            </div>
          }
        </div>
      );
    }
    
    if (product.rank === 2) {
      return (
        <div className="relative">
          <Trophy className="h-5 w-5 text-gray-400" />
          {source !== "votes" && 
            <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white flex items-center justify-center">
              {icon}
            </div>
          }
        </div>
      );
    }
    
    if (product.rank === 3) {
      return (
        <div className="relative">
          <Trophy className="h-5 w-5 text-amber-700" />
          {source !== "votes" && 
            <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white flex items-center justify-center">
              {icon}
            </div>
          }
        </div>
      );
    }
    
    // For ranks beyond top 3, show the rank number with an indicator of the source
    return (
      <div className="flex items-center">
        <span className="text-gray-500 mr-1">#{product.rank}</span>
        <span title={`Ranked by ${source}`}>{icon}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100">
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-white">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border-gray-200 focus:border-green-500 transition-colors"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-white border-gray-200 hover:bg-gray-50">
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                Sort by <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleSort("votes")} className="cursor-pointer">
                <Trophy className={`mr-2 h-4 w-4 ${sortField === "votes" ? "text-green-600" : "text-gray-400"}`} />
                Votes {sortField === "votes" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("likes")} className="cursor-pointer">
                <Heart className={`mr-2 h-4 w-4 ${sortField === "likes" ? "text-green-600" : "text-gray-400"}`} />
                Likes {sortField === "likes" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("rating")} className="cursor-pointer">
                <Star className={`mr-2 h-4 w-4 ${sortField === "rating" ? "text-green-600" : "text-gray-400"}`} />
                Rating {sortField === "rating" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[60px] text-center">Rank</TableHead>
              <TableHead className="min-w-[220px]">
                <div className="font-semibold text-gray-700">Product</div>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("category")}
                  className="flex items-center font-semibold text-gray-700"
                >
                  Category {getSortIcon("category")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("subcategory")}
                  className="flex items-center font-semibold text-gray-700"
                >
                  Subcategory {getSortIcon("subcategory")}
                </button>
              </TableHead>
              <TableHead className="text-center">
                <button
                  onClick={() => handleSort("votes")}
                  className="flex items-center font-semibold justify-center text-gray-700"
                >
                  <Trophy className="mr-1 h-4 w-4 text-gray-400" />
                  Votes {getSortIcon("votes")}
                </button>
              </TableHead>
              <TableHead className="text-center">
                <button
                  onClick={() => handleSort("likes")}
                  className="flex items-center font-semibold justify-center text-gray-700"
                >
                  <Heart className="mr-1 h-4 w-4 text-gray-400" />
                  Likes {getSortIcon("likes")}
                </button>
              </TableHead>
              <TableHead className="text-center">
                <button
                  onClick={() => handleSort("rating")}
                  className="flex items-center font-semibold justify-center text-gray-700"
                >
                  <Star className="mr-1 h-4 w-4 text-gray-400" />
                  Rating {getSortIcon("rating")}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalSortedProducts.length > 0 ? (
              finalSortedProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    product.id === selectedProductId
                      ? "bg-green-50 border-l-4 border-l-green-500"
                      : hoveredRow === product.id
                        ? "bg-gray-50 border-l-4 border-l-transparent"
                        : "hover:bg-gray-50 border-l-4 border-l-transparent"
                  }`}
                  onClick={() => onSelectProduct(product)}
                  onMouseEnter={() => setHoveredRow(product.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell className="font-medium text-center">
                    <div className="flex items-center justify-center">
                      {getRankBadge(product)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg?height=40&width=40"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.trending && (
                          <div className="absolute top-0 right-0 bg-amber-500 p-0.5 rounded-bl">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.subcategory}</TableCell>
                  <TableCell className="text-center">{product.votes}</TableCell>
                  <TableCell className="text-center">{product.likes}</TableCell>
                  <TableCell className="text-center">{product.rating.toFixed(1)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Filter className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No Products Found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      Try adjusting your filters or search criteria to find what you&apos;re looking for
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 flex items-center">
        <div className="flex-1">Showing {finalSortedProducts.length} products</div>
        <div className="flex items-center">
          <Filter className="h-3 w-3 mr-1" />
          Sorted by: <span className="font-medium ml-1 text-gray-700">{sortField}</span>
        </div>
      </div>
    </div>
  )
}

