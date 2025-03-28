"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search, ArrowUpDown, Trophy, Heart, Star, Filter, Sparkles, Vote } from "lucide-react"
import type { Product } from "../product-ranking/types"

interface ProductVotesTableProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
  selectedProductId?: string
}

type SortField = "category" | "subcategory" | "votes" | "likes" | "rating"
type SortDirection = "asc" | "desc"

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
    let comparison = 0

    switch (sortField) {
      case "category":
        comparison = a.category.localeCompare(b.category)
        break
      case "subcategory":
        comparison = a.subcategory.localeCompare(b.subcategory)
        break
      case "votes":
        comparison = a.reviewCount - b.reviewCount
        break
      case "likes":
        comparison = a.likes - b.likes
        break
      case "rating":
        comparison = a.rating - b.rating
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

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
  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-amber-500" />
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-700" />
    return null
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
                <Vote className={`mr-2 h-4 w-4 ${sortField === "votes" ? "text-green-600" : "text-gray-400"}`} />
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
              <TableHead className="text-right">
                <button
                  onClick={() => handleSort("votes")}
                  className="flex items-center font-semibold ml-auto text-gray-700"
                >
                  <Vote className="mr-1 h-4 w-4 text-gray-400" />
                  Votes {getSortIcon("votes")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  onClick={() => handleSort("likes")}
                  className="flex items-center font-semibold ml-auto text-gray-700"
                >
                  <Heart className="mr-1 h-4 w-4 text-gray-400" />
                  Likes {getSortIcon("likes")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  onClick={() => handleSort("rating")}
                  className="flex items-center font-semibold ml-auto text-gray-700"
                >
                  <Star className="mr-1 h-4 w-4 text-gray-400" />
                  Rating {getSortIcon("rating")}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product, index) => (
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
                      {getRankBadge(index) || <span className="text-gray-500">#{index + 1}</span>}
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
                        <div className="text-xs text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                      {product.subcategory}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium text-gray-900 flex items-center justify-end">
                      <Vote className="h-4 w-4 mr-1 text-blue-500" />
                      {product.reviewCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-gray-900 flex items-center justify-end">
                      <Heart className="h-4 w-4 mr-1 text-red-400" />
                      {product.likes}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center">
                    <Search className="h-8 w-8 text-gray-300 mb-2" />
                    <p>No products found matching your search criteria</p>
                    <button onClick={() => setSearchTerm("")} className="mt-2 text-green-600 text-sm hover:underline">
                      Clear search
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 flex items-center">
        <div className="flex-1">Showing {sortedProducts.length} products</div>
        <div className="flex items-center">
          <Filter className="h-3 w-3 mr-1" />
          Sorted by: <span className="font-medium ml-1 text-gray-700">{sortField}</span>
        </div>
      </div>
    </div>
  )
}

