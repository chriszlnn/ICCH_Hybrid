"use client"

import { useState, useEffect } from "react"
import { CategoryTabs } from "./category-tabs"
import { ProductList } from "./product-list"
import { mockProducts } from "./mock-data"
import { categoryOptions } from "./mock-data"
import type { Category, Product } from "./types"

export function ProductRanking() {
  // Set default category to the first one in the list (skincare)
  const [selectedCategory, setSelectedCategory] = useState<Category>(categoryOptions[0].id)

  // Set default subcategory to the first subcategory of the selected category
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(categoryOptions[0].subcategories[0].id)

  const [displayProducts, setDisplayProducts] = useState<Product[]>([])

  // Filter and sort products based on selected category and subcategory
  useEffect(() => {
    // Filter by category
    const filteredProducts = mockProducts.filter((product) => {
      return selectedCategory === product.category
    })

    // Filter by subcategory
    const subcategoryProducts = filteredProducts
      .filter((product) => product.subcategory.toLowerCase() === selectedSubcategory.toLowerCase())
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3)

    setDisplayProducts(subcategoryProducts)
  }, [selectedCategory, selectedSubcategory])

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

      <ProductList products={displayProducts} />
    </div>
  )
}

