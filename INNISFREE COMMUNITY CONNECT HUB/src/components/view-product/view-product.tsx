"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Filter, X } from "lucide-react"

// Add this style block at the top of the file, after the imports
const styles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

// Define product type for backend integration
interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  subcategory?: string
}

// Category type
type Category = "All" | "skincare" | "makeup" | "hairbody"

// Sort options
type SortOption = "newest" | "price-low" | "price-high" | "name"

// Category options
const categoryOptions: CategoryOption[] = [
  {
    id: "skincare",
    label: "Skincare",
    subcategories: [
      { id: "cleansers", label: "Cleansers" },
      { id: "toners", label: "Toners & Mists" },
      { id: "serums", label: "Serums & Ampoules" },
      { id: "moisturizers", label: "Moisturizers & Creams" },
      { id: "eyecare", label: "Eye Care" },
      { id: "masks", label: "Masks & Treatments" },
      { id: "sunscreen", label: "Sunscreen & UV Protection" },
    ],
  },
  {
    id: "makeup",
    label: "Makeup",
    subcategories: [
      { id: "face", label: "Face Makeup" },
      { id: "lip", label: "Lip Products" },
      { id: "eye", label: "Eye Makeup" },
      { id: "base", label: "Makeup Base & Primers" },
      { id: "setting", label: "Setting & Finishing Products" },
    ],
  },
  {
    id: "hairbody",
    label: "Hair & Body",
    subcategories: [
      { id: "shampoo", label: "Shampoo & Conditioners" },
      { id: "treatments", label: "Hair Treatments & Oils" },
      { id: "bodywash", label: "Body Wash & Soaps" },
      { id: "lotions", label: "Body Lotions & Creams" },
      { id: "hand", label: "Hand & Foot Care" },
      { id: "scrubs", label: "Body Scrubs & Exfoliators" },
      { id: "perfumes", label: "Deodorants & Perfumes" },
    ],
  },
]

// Type for category options
type CategoryOption = {
  id: string
  label: string
  subcategories: Array<{
    id: string
    label: string
  }>
}

// Product Skeleton Component
const ProductSkeleton = () => (
  <div className="flex flex-col animate-pulse">
    <div className="bg-gray-200 rounded-lg p-2 mb-2 h-48"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="flex gap-1">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-12"></div>
    </div>
  </div>
)

export default function ViewProductPage() {
  const [products, setProducts] = useState<Product[]>([]) // State for fetched products
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("All")
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false)
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [tempMinPrice, setTempMinPrice] = useState<string>("")
  const [tempMaxPrice, setTempMaxPrice] = useState<string>("")
  const [isPriceFilterActive, setIsPriceFilterActive] = useState<boolean>(false)
  const [tempSortOption, setTempSortOption] = useState<SortOption>(sortOption)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Get available subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (activeCategory === "All") return []
    const category = categoryOptions.find((cat) => cat.id === activeCategory)
    return category ? category.subcategories : []
  }, [activeCategory])

  // Reset subcategory when category changes
  useEffect(() => {
    if (activeCategory === "All") {
      setActiveSubcategory("All")
    } else {
      // Always set to "All" when changing categories
      setActiveSubcategory("All")
    }
  }, [activeCategory])

  // Fetch products from the API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on selected category, subcategory and price range
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Apply category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((product) => product.category === activeCategory)
    }

    // Apply subcategory filter
    if (activeSubcategory !== "All") {
      filtered = filtered.filter((product) => product.subcategory === activeSubcategory)
    }

    // Apply price range filter if active
    if (isPriceFilterActive) {
      const min = minPrice ? Number.parseFloat(minPrice) : 0
      const max = maxPrice ? Number.parseFloat(maxPrice) : Number.POSITIVE_INFINITY

      filtered = filtered.filter((product) => product.price >= min && product.price <= max)
    }

    // Sort products
    if (sortOption === "price-low") {
      return [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortOption === "price-high") {
      return [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortOption === "name") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    }

    // For 'newest', we keep the original order
    return filtered
  }, [products, activeCategory, activeSubcategory, sortOption, minPrice, maxPrice, isPriceFilterActive])

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel)
    if (!showFilterPanel) {
      // When opening the panel, initialize temp values with current values
      setTempSortOption(sortOption)
      setTempMinPrice(minPrice)
      setTempMaxPrice(maxPrice)
    }
  }

  // Reset filters
  const resetFilters = () => {
    // Reset temporary state
    setTempSortOption("newest")
    setTempMinPrice("")
    setTempMaxPrice("")

    // Immediately apply the reset filters
    setSortOption("newest")
    setMinPrice("")
    setMaxPrice("")
    setIsPriceFilterActive(false)
    setActiveCategory("All")
    setActiveSubcategory("All")

    // Close the filter panel
    setShowFilterPanel(false)
  }

  // Add an applyFilters function
  const applyFilters = () => {
    setSortOption(tempSortOption)
    setMinPrice(tempMinPrice)
    setMaxPrice(tempMaxPrice)
    setIsPriceFilterActive(!!tempMinPrice || !!tempMaxPrice)
    setShowFilterPanel(false)
  }

  // Handle input validation for price fields
  const handlePriceInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Only allow numbers and a single decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value)
    }
  }

  return (
    <div className="w-full">
      <style jsx global>
        {styles}
      </style>
      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "All" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveCategory(category.id as Category)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Subcategory Filters */}
        {activeCategory !== "All" && availableSubcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
            <button
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeSubcategory === "All"
                  ? "bg-green-100 text-green-800 border border-green-600"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSubcategory("All")}
            >
              All in {categoryOptions.find((cat) => cat.id === activeCategory)?.label}
            </button>
            {availableSubcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeSubcategory === subcategory.id
                    ? "bg-green-100 text-green-800 border border-green-600"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSubcategory(subcategory.id)}
              >
                {subcategory.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Button and Panel */}
      <div className="relative mb-4">
        <div className="flex justify-end">
          <button
            className={`flex items-center text-sm px-3 py-1 rounded-full ${
              showFilterPanel ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
            }`}
            onClick={toggleFilterPanel}
          >
            Filter By <Filter className="ml-1 h-4 w-4" />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="absolute right-0 top-10 z-10 bg-white shadow-lg rounded-lg p-4 w-64 border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filters</h3>
              <button onClick={toggleFilterPanel} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Options */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Sort By</h4>
              <div className="space-y-1">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "name", label: "Name" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={tempSortOption === option.value}
                      onChange={() => setTempSortOption(option.value as SortOption)}
                      className="mr-2 accent-green-600"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Price Range */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Price Range (RM)</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label htmlFor="min-price" className="text-xs text-gray-500 mb-1 block">
                    Min
                  </label>
                  <input
                    id="min-price"
                    type="text"
                    value={tempMinPrice}
                    onChange={(e) => handlePriceInput(e.target.value, setTempMinPrice)}
                    placeholder="0"
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="flex-1">
                  <label htmlFor="max-price" className="text-xs text-gray-500 mb-1 block">
                    Max
                  </label>
                  <input
                    id="max-price"
                    type="text"
                    value={tempMaxPrice}
                    onChange={(e) => handlePriceInput(e.target.value, setTempMaxPrice)}
                    placeholder="∞"
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm flex-1 transition-colors"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex-1 transition-colors"
                onClick={applyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600">Showing {filteredProducts.length} products:</span>

        {activeCategory !== "All" && (
          <div className="flex items-center bg-green-50 text-green-800 text-xs rounded-full px-2 py-1">
            <span>Category: {categoryOptions.find((cat) => cat.id === activeCategory)?.label}</span>
            <button
              onClick={() => {
                setActiveCategory("All")
                setActiveSubcategory("All")
              }}
              className="ml-1 text-green-600 hover:text-green-800"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {activeSubcategory !== "All" && (
          <div className="flex items-center bg-green-50 text-green-800 text-xs rounded-full px-2 py-1">
            <span>Subcategory: {availableSubcategories.find((sub) => sub.id === activeSubcategory)?.label}</span>
            <button onClick={() => setActiveSubcategory("All")} className="ml-1 text-green-600 hover:text-green-800">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {isPriceFilterActive && (
          <div className="flex items-center bg-green-50 text-green-800 text-xs rounded-full px-2 py-1">
            <span>
              Price: RM {minPrice || "0"} - {maxPrice || "∞"}
            </span>
            <button
              className="ml-1 text-green-600 hover:text-green-800"
              onClick={() => {
                setMinPrice("")
                setMaxPrice("")
                setIsPriceFilterActive(false)
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          // Show skeleton loading state
          Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
        ) : filteredProducts.length > 0 ? (
          // Show actual products
          filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col group">
              <div className="bg-gray-100 rounded-lg p-2 mb-2 overflow-hidden">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium line-clamp-2 group-hover:text-green-700 transition-colors">
                  {product.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full">
                    {categoryOptions.find((cat) => cat.id === product.category)?.label || product.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 border border-green-600 rounded-full">
                    {categoryOptions
                      .find((cat) => cat.id === product.category)
                      ?.subcategories.find((sub) => sub.id === product.subcategory)?.label || product.subcategory}
                  </span>
                </div>
                <p className="text-xs mt-1 text-gray-600">RM {product.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          // Show empty state
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No products found with the selected filters.</p>
            <button className="mt-2 text-green-600 hover:text-green-800 text-sm" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
