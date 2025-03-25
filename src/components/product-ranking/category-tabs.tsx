"use client"
import type { Category } from "./types"
import { categoryOptions } from "./mock-data"

interface CategoryTabsProps {
  selectedCategory: Category
  setSelectedCategory: (category: Category) => void
  selectedSubcategory: string
  setSelectedSubcategory: (subcategory: string) => void
}

export function CategoryTabs({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
}: CategoryTabsProps) {
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)

    // When changing category, select the first subcategory of the new category
    const newCategoryData = categoryOptions.find((cat) => cat.id === category)
    if (newCategoryData && newCategoryData.subcategories.length > 0) {
      setSelectedSubcategory(newCategoryData.subcategories[0].id)
    }
  }

  const selectedCategoryData = categoryOptions.find((cat) => cat.id === selectedCategory)

  return (
    <div className="mb-6 w-full">
      {/* Main Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categoryOptions.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Subcategories */}
      {selectedCategoryData && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategoryData.subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setSelectedSubcategory(subcategory.id)}
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
  )
}

