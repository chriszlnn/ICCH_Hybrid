/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Search, Plus, Edit2, Trash2, X, Filter, ChevronDown, Check, Store } from "lucide-react"
import { useUploadThing } from "@/lib/utils/uploadthing"
import { useToast } from "../ui/toast/use-toast"
import { categoryOptions } from "../product-ranking/mock-data"

interface Product {
  id: string
  name: string
  price: number
  category: string
  subcategory: string
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
    category: "skincare",
    subcategory: "cleansers",
    image: "/placeholder.svg?height=200&width=200",
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [subcategoryFilter, setSubcategoryFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; productId: string | null }>({
    show: false,
    productId: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewingProduct, setIsViewingProduct] = useState(false)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isEditingProduct, setIsEditingProduct] = useState(false)

  // Get available subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    const category = categoryOptions.find(cat => cat.id === newProduct.category)
    return category ? category.subcategories : []
  }, [newProduct.category])

  // Get available subcategories for editing
  const availableEditSubcategories = useMemo(() => {
    if (!editingProduct) return []
    const category = categoryOptions.find(cat => cat.id === editingProduct.category)
    return category ? category.subcategories : []
  }, [editingProduct])

  // Get available subcategories for filtering
  const availableFilterSubcategories = useMemo(() => {
    if (categoryFilter === "All") return [];
    const category = categoryOptions.find(cat => cat.label === categoryFilter);
    return category ? category.subcategories : [];
  }, [categoryFilter]);

  // Reset subcategory filter when category changes
  useEffect(() => {
    if (categoryFilter === "All") {
      setSubcategoryFilter("All");
    } else if (availableFilterSubcategories.length > 0) {
      // If the current subcategory is not in the new category's subcategories,
      // reset it to the first available subcategory
      const subcategoryExists = availableFilterSubcategories.some(
        sub => sub.label === subcategoryFilter
      );
      
      if (!subcategoryExists) {
        setSubcategoryFilter(availableFilterSubcategories[0].label);
      }
    } else {
      setSubcategoryFilter("All");
    }
  }, [categoryFilter, availableFilterSubcategories]);

  const { startUpload } = useUploadThing("imageUploader")
  const { toast } = useToast()

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (selectedImageFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedImageFile))
      }
    }
  }, [selectedImageFile])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive"
      })
      return
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive"
      })
      return
    }
    
    setSelectedImageFile(file)
  }

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Add retry mechanism
        let retries = 3;
        let lastError = null;
        
        while (retries > 0) {
          try {
            const data = await fetchProducts();
            if (Array.isArray(data)) {
              setProducts(data);
              break; // Success, exit the retry loop
            } else {
              setError("Invalid data format received");
              setProducts([]);
              break;
            }
          } catch (error) {
            lastError = error;
            retries--;
            if (retries > 0) {
              // Wait before retrying (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
            }
          }
        }
        
        // If we've exhausted all retries, set the error
        if (retries === 0 && lastError) {
          console.error("Failed to fetch products after multiple attempts:", lastError);
          setError("Failed to load products. Please try again later.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setError("Failed to load products")
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // API functions
  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch("/api/products")
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Error fetching products:", errorData);
        throw new Error(errorData.error || `Failed to fetch products: ${response.statusText}`);
      }
      
      const data = await response.json()
      
      if (!Array.isArray(data)) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format: expected an array of products")
      }
      
      return data
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      throw error;
    }
  }

  const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create product")
    }
    return response.json()
  }

  

  const updateProductById = async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        console.error("Update product error:", data)
        throw new Error(data.error || data.message || "Failed to update product")
      }
      
      return data
    } catch (error) {
      console.error("Error in updateProductById:", error)
      throw error
    }
  }

  const deleteProductById = async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete product")
    }
    return true
  }

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const uploadResponse = await startUpload(Array.from(files))
      if (!uploadResponse || uploadResponse.length === 0) {
        throw new Error("Upload failed - no response from server")
      }

      const uploadedImageUrl = uploadResponse[0].url
      console.log("Upload successful, URL:", uploadedImageUrl)

      if (!uploadedImageUrl.startsWith('http')) {
        throw new Error("Invalid image URL received from server")
      }

      if (editingProduct) {
        setEditingProduct({ ...editingProduct, image: uploadedImageUrl })
      } else {
        setNewProduct(prev => ({ ...prev, image: uploadedImageUrl }))
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to upload image", 
        variant: "destructive" 
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // If changing category, reset subcategory to first available option
    if (name === "category") {
      const category = categoryOptions.find(cat => cat.id === value)
      const firstSubcategory = category?.subcategories[0]?.id || ""
      
      setNewProduct(prev => ({
        ...prev,
        [name]: value,
        subcategory: firstSubcategory
      }))
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
      }))
    }
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingProduct) return

    const { name, value } = e.target
    
    // If changing category, reset subcategory to first available option
    if (name === "category") {
      const category = categoryOptions.find(cat => cat.id === value)
      const firstSubcategory = category?.subcategories[0]?.id || ""
      
      setEditingProduct({
        ...editingProduct,
        [name]: value,
        subcategory: firstSubcategory
      })
    } else if (name === "subcategory") {
      // Ensure the selected subcategory is valid for the current category
      const category = categoryOptions.find(cat => cat.id === editingProduct.category)
      const subcategoryExists = category?.subcategories.some(sub => sub.id === value)
      
      if (subcategoryExists) {
        setEditingProduct({
          ...editingProduct,
          [name]: value
        })
      }
    } else {
      setEditingProduct({
        ...editingProduct,
        [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
      })
    }
  }

  // Product CRUD operations
  const addProduct = async () => {
    if (isUploading) return
    if (!newProduct.name || newProduct.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a product name and valid price",
        variant: "destructive"
      })
      return
    }

    if (!selectedImageFile) {
      toast({
        title: "Validation Error",
        description: "Please select an image before adding the product",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setIsAddingProduct(true)

    try {
      // Upload image
      const uploadResponse = await startUpload([selectedImageFile])
      if (!uploadResponse || uploadResponse.length === 0) {
        throw new Error("Upload failed - no response from server")
      }

      const uploadedImageUrl = uploadResponse[0].url
      if (!uploadedImageUrl.startsWith('http')) {
        throw new Error("Invalid image URL received from server")
      }

      // Create product
      const productData = {
        ...newProduct,
        image: uploadedImageUrl,
      }

      const createdProduct = await createProduct(productData)
      setProducts(prev => [...prev, createdProduct])

      // Reset form
      setNewProduct({
        id: "",
        name: "",
        price: 0,
        category: "skincare",
        subcategory: "cleansers",
        image: "/placeholder.svg?height=200&width=200",
      })
      setSelectedImageFile(null)
      setShowAddForm(false)

      toast({
        title: "Success",
        description: "Product added successfully",
      })
    } catch (error) {
      console.error("Failed to add product:", error)
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to add product", 
        variant: "destructive" 
      })
    } finally {
      setIsUploading(false)
      setIsAddingProduct(false)
    }
  }

  const updateProduct = async () => {
    if (!editingProduct) return;
    
    setIsEditingProduct(true);
  
    try {
      // Validate that the subcategory is valid for the selected category
      const category = categoryOptions.find(cat => cat.id === editingProduct.category);
      
      if (category && Array.isArray(category.subcategories) && category.subcategories.length > 0) {
        const subcategoryExists = category.subcategories.some(sub => sub.id === editingProduct.subcategory);
        
        if (!subcategoryExists) {
          // If subcategory is invalid, set it to the first available subcategory
          const updatedProduct = {
            ...editingProduct,
            subcategory: category.subcategories[0].id
          };
          
          const result = await updateProductById(editingProduct.id, updatedProduct);
          setProducts(prev => prev.map(p => p.id === result.id ? result : p));
          setEditingProduct(null);
          
          toast({
            title: "Success",
            description: "Product updated successfully (subcategory adjusted)",
          });
          return;
        }
      }
      
      // Proceed with the update as is
      const updatedProduct = await updateProductById(editingProduct.id, editingProduct);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setEditingProduct(null);
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to update product", 
        variant: "destructive" 
      });
    } finally {
      setIsEditingProduct(false);
    }
  }

  const deleteProduct = async () => {
    if (!deleteConfirmation.productId) return
    if (isDeleting) return

    setIsDeleting(true)

    try {
      await deleteProductById(deleteConfirmation.productId)
      setProducts(prev => prev.filter(p => p.id !== deleteConfirmation.productId))
      setDeleteConfirmation({ show: false, productId: null })
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to delete product", 
        variant: "destructive" 
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // UI helpers
  const handleSort = (field: "name" | "price" | "category") => {
    if (field === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products
      .filter(product => {
        // Search query filter - check if product name contains the search query (case insensitive)
        const matchesSearch = searchQuery 
          ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        // Category filter - check if product category matches the selected category
        const matchesCategory = categoryFilter === "All" 
          ? true 
          : categoryOptions.find(cat => cat.id === product.category)?.label === categoryFilter;
        
        // Subcategory filter - check if product subcategory matches the selected subcategory
        const matchesSubcategory = subcategoryFilter === "All" 
          ? true 
          : categoryOptions
              .find(cat => cat.id === product.category)
              ?.subcategories.find(sub => sub.id === product.subcategory)?.label === subcategoryFilter;
        
        return matchesSearch && matchesCategory && matchesSubcategory;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else if (sortBy === "price") {
          return sortOrder === "asc" 
            ? a.price - b.price 
            : b.price - a.price;
        } else if (sortBy === "category") {
          const categoryA = categoryOptions.find(cat => cat.id === a.category)?.label || a.category;
          const categoryB = categoryOptions.find(cat => cat.id === b.category)?.label || b.category;
          return sortOrder === "asc" 
            ? categoryA.localeCompare(categoryB) 
            : categoryB.localeCompare(categoryA);
        }
        return 0;
      });
  }, [products, searchQuery, categoryFilter, subcategoryFilter, sortBy, sortOrder]);

  const editProduct = (product: Product) => {
    setIsViewingProduct(true);
    
    // Find the category in categoryOptions
    const category = categoryOptions.find(cat => cat.id === product.category);
    
    if (category) {
      // Check if the current subcategory exists in the category's subcategories
      const subcategoryExists = category.subcategories.some(sub => sub.id === product.subcategory);
      
      if (!subcategoryExists) {
        // If subcategory doesn't exist, set it to the first available subcategory
        setEditingProduct({
          ...product,
          subcategory: category.subcategories[0].id
        });
      } else {
        // If subcategory exists, keep it
        setEditingProduct(product);
      }
    } else {
      // If category not found, set to first category and its first subcategory
      const firstCategory = categoryOptions[0];
      setEditingProduct({
        ...product,
        category: firstCategory.id,
        subcategory: firstCategory.subcategories[0].id
      });
    }
    
    // Simulate a small delay to show the loading indicator
    setTimeout(() => {
      setIsViewingProduct(false);
    }, 500);
  }

  const resetNewProductForm = () => {
    setNewProduct({
      id: "",
      name: "",
      price: 0,
      category: "skincare",
      subcategory: "cleansers",
      image: "/placeholder.svg?height=200&width=200",
    })
    setSelectedImageFile(null)
  }

  const openAddProductModal = () => {
    resetNewProductForm()
    setShowAddForm(true)
  }

  const closeAddProductModal = () => {
    setShowAddForm(false)
  }

  const showDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({
      show: true,
      productId: id,
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="top-0 z-10 bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
          </div>
          <button
            onClick={openAddProductModal}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isUploading}
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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {["All", ...categoryOptions.map(cat => cat.label)].map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setCategoryFilter(category);
                              setShowFilters(false);
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

                      {categoryFilter !== "All" && (
                        <>
                          <h3 className="text-sm font-medium text-gray-700 mt-3 mb-2">Subcategory</h3>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {["All", ...availableFilterSubcategories.map(sub => sub.label)].map((subcategory) => (
                              <button
                                key={subcategory}
                                onClick={() => {
                                  setSubcategoryFilter(subcategory);
                                  setShowFilters(false);
                                }}
                                className={`flex items-center w-full px-2 py-1 text-sm rounded-md ${
                                  subcategoryFilter === subcategory ? "bg-green-100 text-green-800" : "hover:bg-gray-100"
                                }`}
                              >
                                {subcategoryFilter === subcategory && <Check size={16} className="mr-1" />}
                                {subcategory}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      <h3 className="text-sm font-medium text-gray-700 mt-3 mb-2">Sort By</h3>
                      <div className="space-y-1">
                        {[
                          { id: "name", label: "Name" },
                          { id: "price", label: "Price" },
                          { id: "category", label: "Category" },
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleSort(option.id as "name" | "price" | "category")}
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
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setCategoryFilter("All");
                            setSubcategoryFilter("All");
                            setShowFilters(false);
                          }}
                          className="w-full px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {(categoryFilter !== "All" || subcategoryFilter !== "All" || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {categoryFilter !== "All" && (
                <div className="flex items-center bg-green-50 text-green-800 text-xs rounded-full px-3 py-1">
                  <span>Category: {categoryFilter}</span>
                  <button 
                    onClick={() => {
                      setCategoryFilter("All");
                      setSubcategoryFilter("All");
                    }} 
                    className="ml-1 text-green-600 hover:text-green-800"
                    aria-label="Remove category filter"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {subcategoryFilter !== "All" && (
                <div className="flex items-center bg-green-50 text-green-800 text-xs rounded-full px-3 py-1">
                  <span>Subcategory: {subcategoryFilter}</span>
                  <button 
                    onClick={() => setSubcategoryFilter("All")} 
                    className="ml-1 text-green-600 hover:text-green-800"
                    aria-label="Remove subcategory filter"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {searchQuery && (
                <div className="flex items-center bg-green-50 text-green-800 text-xs rounded-full px-3 py-1">
                  <span>Search: {searchQuery}</span>
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="ml-1 text-green-600 hover:text-green-800"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <div className="flex items-center bg-blue-50 text-blue-800 text-xs rounded-full px-3 py-1">
                <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} ({sortOrder === "asc" ? "A-Z" : "Z-A"})</span>
                <button 
                  onClick={() => {
                    setSortBy("name");
                    setSortOrder("asc");
                  }} 
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  aria-label="Reset sorting"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white shadow-md rounded-lg flex flex-col h-[600px]">
        <div className="p-4 border-b">
          <div className="flex items-baseline">
            <h2 className="text-lg font-semibold text-gray-800">Product List</h2>
            <span className="ml-2 text-sm text-gray-500">
              {isLoading ? "Loading..." : `${filteredProducts.length} products found`}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-2"></div>
              <p className="text-sm text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-green-600 hover:text-green-800 text-sm"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
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
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            {categoryOptions.find(cat => cat.id === product.category)?.label || product.category}
                          </span>
                          <span className="inline-block text-xs px-2 py-1 bg-green-50 text-green-800 rounded-full">
                            {categoryOptions
                              .find(cat => cat.id === product.category)
                              ?.subcategories.find(sub => sub.id === product.subcategory)?.label || product.subcategory}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        disabled={isUploading}
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => showDeleteConfirmation(product.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                        disabled={isUploading}
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
                  setSubcategoryFilter("All")
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
                <button 
                  onClick={closeAddProductModal} 
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isUploading || isAddingProduct}
                >
                  <X size={20} />
                </button>
              </div>

              {isAddingProduct && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-2"></div>
                    <p className="text-sm text-gray-500">Adding product...</p>
                  </div>
                </div>
              )}

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
                    disabled={isUploading || isAddingProduct}
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
                    disabled={isUploading || isAddingProduct}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    disabled={isUploading || isAddingProduct}
                  >
                    {categoryOptions.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <select
                    name="subcategory"
                    value={newProduct.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    disabled={isUploading || isAddingProduct || availableSubcategories.length === 0}
                  >
                    {availableSubcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none"
                    disabled={isUploading || isAddingProduct}
                  />
                  {selectedImageFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Preview:</p>
                      <img 
                        src={URL.createObjectURL(selectedImageFile)} 
                        alt="Preview" 
                        className="mt-1 h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={closeAddProductModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isUploading || isAddingProduct}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-green-400"
                  onClick={addProduct}
                  disabled={isUploading || isAddingProduct || !selectedImageFile}
                >
                  {isUploading ? "Uploading..." : isAddingProduct ? "Adding..." : "Add Product"}
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
              <button 
                onClick={() => setEditingProduct(null)} 
                className="text-gray-500 hover:text-gray-700"
                disabled={isUploading || isEditingProduct}
              >
                <X size={20} />
              </button>
            </div>

            {isEditingProduct && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-2"></div>
                  <p className="text-sm text-gray-500">Updating product...</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isUploading || isEditingProduct}
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
                  disabled={isUploading || isEditingProduct}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isUploading || isEditingProduct}
                >
                  {categoryOptions.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select
                  name="subcategory"
                  value={editingProduct.subcategory}
                  onChange={handleEditInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isUploading || isEditingProduct || availableEditSubcategories.length === 0}
                >
                  {availableEditSubcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.label}
                    </option>
                  ))}
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
                  disabled={isUploading || isEditingProduct}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isUploading || isEditingProduct}
              >
                Cancel
              </button>
              <button
                onClick={updateProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                disabled={isUploading || isEditingProduct}
              >
                {isUploading ? "Uploading..." : isEditingProduct ? "Saving..." : "Save Changes"}
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

              {isDeleting && (
                <div className="flex flex-col items-center mb-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-2"></div>
                  <p className="text-sm text-gray-500">Deleting product...</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirmation({ show: false, productId: null })}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50"
                  disabled={isDeleting}
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

      {/* Viewing Product Loading Indicator */}
      {isViewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-2"></div>
            <p className="text-sm text-gray-500">Loading product details...</p>
          </div>
        </div>
      )}
    </div>
  )
}