/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { CategoryTabs } from "./category-tabs"
import { ProductList } from "./product-list"
import { categoryOptions } from "./mock-data" // Keep this for category options
import type { Category, Product } from "./types"

export function ProductRanking() {
  // Set default category to the first one in the list (skincare)
  const [selectedCategory, setSelectedCategory] = useState<Category>(categoryOptions[0].id)
  const [products, setProducts] = useState<Product[]>([])
  // Set default subcategory to the first subcategory of the selected category
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(categoryOptions[0].subcategories[0].id)


  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likedProductIds, setLikedProductIds] = useState<string[]>([])

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
        
        const data = await response.json()
        setProducts(data)
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

  const getSortedProducts = () => {
    // Just sort by the rank that comes from backend
    return [...products].sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity))
  }
  


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
        // In ProductRanking component
        // In ProductRanking.tsx
        // In ProductRanking.tsx
        <ProductList 
          products={getSortedProducts()} 
          initialLikedProductIds={likedProductIds}
          onVoteSuccess={({ updatedProduct }) => {
            setProducts(prev => prev.map(p => 
              p.id === updatedProduct.id ? updatedProduct : p
            ))
          }}
        />
      )}
    </div>
  )
}