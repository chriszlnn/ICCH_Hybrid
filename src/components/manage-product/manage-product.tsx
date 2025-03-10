"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Search, Plus, Edit2, Trash2, X, Filter, ChevronDown, Check, Store } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  // Add additional fields that might be needed for backend integration
  description?: string
  stock?: number
  createdAt?: string
  updatedAt?: string
}

// Sample data for development - replace with API call in production
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "INNISFREE Green Tea Seed Hyaluronic Serum",
    price: 132.0,
    category: "Skincare",
    image: "/placeholder.svg?height=200&width=200",
    // Optional fields
    description: "Hydrating serum with green tea extract",
    stock: 25,
  },
  {
    id: "2",
    name: "INNISFREE Green Tea Seed Hyaluronic Cream",
    price: 110.0,
    category: "Skincare",
    image: "/placeholder.svg?height=200&width=200",
    // Optional fields
    description: "Moisturizing cream with green tea extract",
    stock: 18,
  },
]

export default function ManageProduct() {
  // State for products
  const [products, setProducts] = useState<Product[]>(sampleProducts)

  // State for new product
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    category: "Skincare",
    image: "/placeholder.svg?height=200&width=200",
  })

  // State for editing product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // State for showing add product form
  const [showAddForm, setShowAddForm] = useState(false)

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    loadProducts()
  }, [])

  // TODO: Replace with actual API calls
  // Backend integration points
  const fetchProducts = async (): Promise<Product[]> => {
    // Replace with actual API call
    // Example: return await fetch('/api/products').then(res => res.json())
    return new Promise((resolve) => {
      setTimeout(() => resolve(sampleProducts), 500)
    })
  }

  const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
    // Replace with actual API call
    // Example: return await fetch('/api/products', { method: 'POST', body: JSON.stringify(product) }).then(res => res.json())
    return new Promise((resolve) => {
      const newProduct = { ...product, id: Date.now().toString() }
      setTimeout(() => resolve(newProduct), 500)
    })
  }

  const updateProductById = async (id: string, product: Partial<Product>): Promise<Product> => {
    // Replace with actual API call
    // Example: return await fetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }).then(res => res.json())
    return new Promise((resolve) => {
      const updatedProduct = { ...sampleProducts.find((p) => p.id === id), ...product, id }
      setTimeout(() => resolve(updatedProduct as Product), 500)
    })
  }

  const deleteProductById = async (id: string): Promise<boolean> => {
    // Replace with actual API call
    // Example: return await fetch(`/api/products/${id}`, { method: 'DELETE' }).then(res => res.ok)
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500)
    })
  }

  // Handle input changes for new product
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  // Handle input changes for editing product
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingProduct) return

    const { name, value } = e.target
    setEditingProduct({
      ...editingProduct,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    })
  }

  // Handle file input (image upload)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const imageUrl = URL.createObjectURL(file)

    if (isEditing && editingProduct) {
      setEditingProduct({ ...editingProduct, image: imageUrl })
    } else {
      setNewProduct((prev) => ({ ...prev, image: imageUrl }))
    }
  }

  // Add new product
  const addProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
      alert("Please enter a product name and valid price")
      return
    }

    try {
      // Remove the id field as it will be generated by the backend
      const { id, ...productData } = newProduct

      // Call the API to create the product
      const createdProduct = await createProduct(productData)

      // Update the local state with the new product
      setProducts((prev) => [...prev, createdProduct])

      // Reset form
      setNewProduct({
        id: "",
        name: "",
        price: 0,
        category: "Skincare",
        image: "/placeholder.svg?height=200&width=200",
      })

      setShowAddForm(false)
    } catch (error) {
      console.error("Failed to create product:", error)
      alert("Failed to create product. Please try again.")
    }
  }

  // Update product
  const updateProduct = async () => {
    if (!editingProduct) return

    try {
      // Call the API to update the product
      const updatedProduct = await updateProductById(editingProduct.id, editingProduct)

      // Update the local state with the updated product
      setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))

      setEditingProduct(null)
    } catch (error) {
      console.error("Failed to update product:", error)
      alert("Failed to update product. Please try again.")
    }
  }

  // Delete product
  const deleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Call the API to delete the product
        const success = await deleteProductById(id)

        if (success) {
          // Update the local state by removing the deleted product
          setProducts((prev) => prev.filter((p) => p.id !== id))
        } else {
          throw new Error("Failed to delete product")
        }
      } catch (error) {
        console.error("Failed to delete product:", error)
        alert("Failed to delete product. Please try again.")
      }
    }
  }

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Apply search filter
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())

        // Apply category filter
        const matchesCategory = categoryFilter === "All" || product.category === categoryFilter

        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === "name") {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else if (sortBy === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price
        } else if (sortBy === "category") {
          return sortOrder === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
        }
        return 0
      })
  }, [products, searchQuery, categoryFilter, sortBy, sortOrder])

  const editProduct = (product: Product) => {
    setEditingProduct(product)
  }

  // Reset new product form
  const resetNewProductForm = () => {
    setNewProduct({
      id: "",
      name: "",
      price: 0,
      category: "Skincare",
      image: "/placeholder.svg?height=200&width=200",
    })
  }

  // Open add product modal
  const openAddProductModal = () => {
    resetNewProductForm()
    setShowAddForm(true)
  }

  // Close add product modal
  const closeAddProductModal = () => {
    setShowAddForm(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section - Manage Products */}
      <div className="top-0 z-10 bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
          </div>
          <button
            onClick={openAddProductModal}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 ml-auto">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
                >
                  <Filter size={18} />
                  Filter
                  <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                      <div className="space-y-1">
                        {["All", "Skincare", "Makeup", "Hair & Body", "Promotions"].map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setCategoryFilter(category)
                              setShowFilters(false)
                            }}
                            className={`flex items-center w-full px-2 py-1 text-sm rounded-md ${
                              categoryFilter === category ? "bg-green-100 text-green-800" : "hover:bg-gray-100"
                            }`}
                          >
                            {categoryFilter === category && <Check size={16} className="mr-1" />}
                            {category}
                          </button>
                        ))}
                      </div>

                      <h3 className="text-sm font-medium text-gray-700 mt-3 mb-2">Sort By</h3>
                      <div className="space-y-1">
                        {[
                          { id: "name", label: "Name" },
                          { id: "price", label: "Price" },
                          { id: "category", label: "Category" },
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => toggleSort(option.id)}
                            className={`flex items-center justify-between w-full px-2 py-1 text-sm rounded-md ${
                              sortBy === option.id ? "bg-green-100 text-green-800" : "hover:bg-gray-100"
                            }`}
                          >
                            <span>{option.label}</span>
                            {sortBy === option.id && (
                              <ChevronDown
                                size={16}
                                className={`transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {(categoryFilter !== "All" || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {categoryFilter !== "All" && (
                <div className="flex items-center bg-green-50 text-green-800 text-xs rounded-full px-3 py-1">
                  <span>Category: {categoryFilter}</span>
                  <button onClick={() => setCategoryFilter("All")} className="ml-1 text-green-600 hover:text-green-800">
                    <X size={14} />
                  </button>
                </div>
              )}

              {searchQuery && (
                <div className="flex items-center bg-green-50 text-green-800 text-xs rounded-full px-3 py-1">
                  <span>Search: {searchQuery}</span>
                  <button onClick={() => setSearchQuery("")} className="ml-1 text-green-600 hover:text-green-800">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product List with fixed height and scrollable content */}
      <div className="bg-white shadow-md rounded-lg flex flex-col h-[600px]">
        <div className="p-4 border-b">
          <div className="flex items-baseline">
            <h2 className="text-lg font-semibold text-gray-800">Product List</h2>
            <span className="ml-2 text-sm text-gray-500">{filteredProducts.length} products found</span>
          </div>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                        <p className="text-green-600 font-medium mt-1">RM {product.price.toFixed(2)}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No products found matching your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setCategoryFilter("All")
                }}
                className="mt-2 text-green-600 hover:text-green-800 text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add New Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-700">Add New Product</h2>
                <button onClick={closeAddProductModal} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full px-3 py-2 text-sm text-gray-600 placeholder-gray-400 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price || ""}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-sm text-gray-600 placeholder-gray-400 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Hair & Body">Hair & Body</option>
                    <option value="Promotions">Promotions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={closeAddProductModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={addProduct}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleEditInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Skincare">Skincare</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Hair & Body">Hair & Body</option>
                  <option value="Promotions">Promotions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="mb-2 aspect-square w-32 mx-auto bg-gray-100 relative overflow-hidden rounded-md">
                  <Image
                    src={editingProduct.image || "/placeholder.svg"}
                    alt={editingProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, true)}
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

