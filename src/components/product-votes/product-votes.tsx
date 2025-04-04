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

export function ProductVotes() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch products with votes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (selectedCategory !== "all") {
          params.append("category", selectedCategory)
        }
        if (selectedSubcategory) {
          params.append("subcategory", selectedSubcategory)
        }
        const response = await fetch(`/api/votes/top?${params.toString()}`)
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setProducts(data.products)
      } catch (error) {
        console.error("Failed to fetch products", error)
        toast.error("Failed to fetch products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, selectedSubcategory])

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
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

