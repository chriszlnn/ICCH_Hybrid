/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Search, Plus, Edit2, Trash2, X, Filter, ChevronDown, Check, Store } from "lucide-react"
// Adjust the import path based on your project structure
// Import commented out to fix error - not needed for delete confirmation functionality
// import { useUploadThing } from "@/utils/uploadthing";
import { useToast } from "../ui/toast/use-toast" // Import toast for notifications

interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export default function ManageProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    category: "Skincare",
    image: "/placeholder.svg?height=200&width=200",
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  // New state for delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; productId: string | null }>({
    show: false,
    productId: null,
  })
  // Add a new state variable for delete loading after the other state declarations
  const [isDeleting, setIsDeleting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedImageFile(files[0]) // Store the selected file
    }
  }

  // Mock UploadThing functionality (commented out to fix error)
  // const { startUpload } = useUploadThing("imageUploader")
  const startUpload = async (files: File[]) => {
    console.log("Mock upload called with files:", files)
    // Return a mock response that matches the expected structure
    return [{ url: URL.createObjectURL(files[0]) }]
  }
  const { toast } = useToast()

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

  // Fetch products from the API
  const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch("/api/products")
    if (!response.ok) throw new Error("Failed to fetch products")
    return response.json()
  }

  // Create a new product
  const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error("Failed to create product")
    return response.json()
  }

  // Update an existing product
  const updateProductById = async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error("Failed to update product")
    return response.json()
  }

  // Delete a product
  const deleteProductById = async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete product")
    return true
  }

  // Handle image upload using UploadThing
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true) // Start loading

    try {
      console.log("Starting upload...")
      const uploadResponse = await startUpload(Array.from(files))
      if (!uploadResponse || uploadResponse.length === 0) throw new Error("Upload failed")

      const uploadedImageUrl = uploadResponse[0].url
      console.log("Upload successful, URL:", uploadedImageUrl)

      if (editingProduct) {
        setEditingProduct({ ...editingProduct, image: uploadedImageUrl })
      } else {
        setNewProduct((prev) => ({ ...prev, image: uploadedImageUrl }))
        console.log("Updated newProduct with image URL:", uploadedImageUrl)
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setIsUploading(false) // End loading
    }
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

  // Add new product
  const addProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
      alert("Please enter a product name and valid price")
      return
    }

    if (!selectedImageFile) {
      alert("Please select an image before adding the product.")
      return
    }

    setIsUploading(true) // Start loading

    try {
      // Step 1: Upload the image to UploadThing
      console.log("Uploading image...")
      const uploadResponse = await startUpload([selectedImageFile])
      if (!uploadResponse || uploadResponse.length === 0) throw new Error("Upload failed")

      const uploadedImageUrl = uploadResponse[0].url
      console.log("Image uploaded successfully, URL:", uploadedImageUrl)

      // Step 2: Create the product with the image URL
      const productData = {
        ...newProduct,
        image: uploadedImageUrl, // Use the uploaded image URL
      }

      // Step 3: Call the API to create the product
      const createdProduct = await createProduct(productData)

      // Step 4: Update the local state with the new product
      setProducts((prev) => [...prev, createdProduct])

      // Step 5: Reset the form
      setNewProduct({
        id: "",
        name: "",
        price: 0,
        category: "Skincare",
        image: "/placeholder.svg?height=200&width=200",
      })
      setSelectedImageFile(null) // Clear the selected image file
      setShowAddForm(false)

      toast({
        title: "Success",
        description: "Product added successfully",
      })
    } catch (error) {
      console.error("Failed to add product:", error)
      toast({ title: "Error", description: "Failed to add product", variant: "destructive" })
    } finally {
      setIsUploading(false) // End loading
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

  // Show delete confirmation modal
  const showDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({
      show: true,
      productId: id,
    })
  }

  // Delete product
  const deleteProduct = async () => {
    if (!deleteConfirmation.productId) return

    setIsDeleting(true) // Start loading state

    try {
      // Call the API to delete the product
      const success = await deleteProductById(deleteConfirmation.productId)

      if (success) {
        // Update the local state by removing the deleted product
        setProducts((prev) => prev.filter((p) => p.id !== deleteConfirmation.productId))

        // Close the confirmation modal
        setDeleteConfirmation({ show: false, productId: null })
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false) // End loading state
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
                        onClick={() => showDeleteConfirmation(product.id)}
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
                    onChange={handleImageChange}
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
                  disabled={isUploading || !selectedImageFile} // Disable if uploading or no image selected
                >
                  {isUploading ? "Uploading..." : "Add Product"}
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
                  onChange={handleImageUpload}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
              <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete the product and remove its data from our servers.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirmation({ show: false, productId: null })}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteProduct}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-400"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

