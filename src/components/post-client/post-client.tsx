"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Upload, X, MoveUp, MoveDown, Filter } from "lucide-react"
import Cropper, { type Area } from "react-easy-crop"

interface Product {
  id: string
  name: string
  image: string
  category: string
  subcategory?: string
}

interface CategoryGroup {
  category: string
  subcategories: {
    name: string
    products: Product[]
  }[]
  products: Product[]
}

interface CroppedAreaPixels {
  width: number
  height: number
  x: number
  y: number
}

export function PostClient() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [caption, setCaption] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showProductSelector, setShowProductSelector] = useState(false)

  // Cropper States
  const [isCropping, setIsCropping] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [cropIndex, setCropIndex] = useState<number | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null)

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Initialize the uploadthing client
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (files) => {
      if (files) {
        const newImageUrls = files.map((file) => file.url)
        setImages((prev) => [...prev, ...newImageUrls])
        toast.success("Images uploaded successfully!")
      }
    },
    onUploadError: (error) => {
      console.error("Error uploading:", error)
      toast.error("Failed to upload images")
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the 5 image limit
    if (images.length + files.length > 5) {
      toast.error("You can only upload a maximum of 5 images")
      return
    }

    try {
      await startUpload(Array.from(files))
    } catch (error) {
      console.error("Error starting upload:", error)
      toast.error("Failed to start upload")
    } finally {
      e.target.value = ""
    }
  }

  // Fetch available products for tagging
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          toast.error("Failed to fetch products")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to fetch products")
      }
    }

    fetchProducts()
  }, [])

  // Group products by category and subcategory
  const groupedProducts = products.reduce<CategoryGroup[]>((acc, product) => {
    // Normalize the category name
    const category = (product.category || "Uncategorized")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    // Normalize the subcategory name
    const subcategory = (product.subcategory || "General")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    // Find existing category group
    let categoryGroup = acc.find((group) => group.category.toLowerCase() === category.toLowerCase())

    if (!categoryGroup) {
      // Create new category group
      categoryGroup = {
        category,
        subcategories: [],
        products: [],
      }
      acc.push(categoryGroup)
    }

    // Add product to appropriate subcategory
    const existingSubcategory = categoryGroup.subcategories.find(
      (sub) => sub.name.toLowerCase() === subcategory.toLowerCase(),
    )

    if (existingSubcategory) {
      existingSubcategory.products.push({
        ...product,
        category,
        subcategory,
      })
    } else {
      categoryGroup.subcategories.push({
        name: subcategory,
        products: [
          {
            ...product,
            category,
            subcategory,
          },
        ],
      })
    }

    return acc
  }, [])

  // Sort categories alphabetically
  groupedProducts.sort((a, b) => a.category.localeCompare(b.category))

  // Sort subcategories and products within each category
  groupedProducts.forEach((group) => {
    // Sort subcategories alphabetically
    group.subcategories.sort((a, b) => a.name.localeCompare(b.name))

    // Sort products within each subcategory
    group.subcategories.forEach((sub) => {
      sub.products.sort((a, b) => a.name.localeCompare(b.name))
    })
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(groupedProducts.map((group) => group.category))).sort()

  // Filter products based on search query and selected category
  const filteredGroupedProducts = groupedProducts
    .filter((group) => selectedCategory === "" || group.category.toLowerCase() === selectedCategory.toLowerCase())
    .map((group) => {
      if (searchQuery.trim() === "") return group

      // Filter subcategories that contain matching products
      const filteredSubcategories = group.subcategories
        .map((sub) => {
          const filteredProducts = sub.products.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (product.subcategory?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
          )

          if (filteredProducts.length > 0) {
            return {
              ...sub,
              products: filteredProducts,
            }
          }
          return null
        })
        .filter(Boolean)

      // Only include categories that have matching products
      if (filteredSubcategories.length > 0) {
        return {
          ...group,
          subcategories: filteredSubcategories,
        }
      }
      return null
    })
    .filter(Boolean) as CategoryGroup[]

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === images.length - 1)) return
    const newImages = [...images]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setImages(newImages)
  }

  const handleCropChange = useCallback((crop: { x: number; y: number }) => setCrop(crop), [])
  const handleZoomChange = useCallback((zoom: number) => setZoom(zoom), [])
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels as CroppedAreaPixels)
  }, [])

  // Open cropper modal
  const openCropper = (index: number) => {
    setSelectedImage(images[index])
    setCropIndex(index)
    setIsCropping(true)
  }

  // Apply cropping
  const applyCrop = async () => {
    if (!selectedImage || !croppedAreaPixels || cropIndex === null) return

    const image = new window.Image()
    image.src = selectedImage
    await new Promise((resolve) => (image.onload = resolve))

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    )

    const croppedImage = canvas.toDataURL("image/png")

    const updatedImages = [...images]
    updatedImages[cropIndex] = croppedImage
    setImages(updatedImages)

    setIsCropping(false)
    setSelectedImage(null)
    setCropIndex(null)
  }

  const selectProduct = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prev) => [...prev, productId])
    }
    setShowProductSelector(false)
  }

  // In your PostClient component
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!images || images.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    if (!selectedProducts || selectedProducts.length === 0) {
      toast.error("Please select at least one product to tag")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/client-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Post",
          images: images,
          content: caption.trim() || "", // Make caption optional by providing empty string if not set
          productIds: selectedProducts,
        }),
      })

      if (response.ok) {
        toast.success("Post created successfully!")
        router.push("/client/profile")
      } else {
        const error = await response.json()
        toast.error(`Failed to create post: ${error.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover cursor-pointer"
                  onDoubleClick={() => openCropper(index)}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}
                </div>
              </div>
            ))}

            {images.length < 5 && (
              <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-center text-muted-foreground">
                    {isUploading ? "Uploading..." : "Upload Images"}
                  </p>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Crop Modal */}
        {isCropping && selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-[90vw] max-w-2xl">
              <div className="relative h-[60vh]">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="rect"
                  showGrid={false}
                  onCropChange={handleCropChange}
                  onZoomChange={handleZoomChange}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIsCropping(false)}>
                  Cancel
                </Button>
                <Button onClick={applyCrop}>Apply Crop</Button>
              </div>
            </div>
          </div>
        )}

        {/* Product Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tag Products</h2>
            {selectedProducts.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          {/* Custom Product Selector */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowProductSelector(!showProductSelector)}
            >
              <span>
                {selectedProducts.length > 0 ? `${selectedProducts.length} products selected` : "Select products"}
              </span>
              <span className="ml-2">{showProductSelector ? "▲" : "▼"}</span>
            </Button>

            {showProductSelector && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-[60vh] overflow-hidden flex flex-col">
                {/* Search and Filter - Fixed at top */}
                <div className="sticky top-0 bg-white border-b z-10 p-2 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-9 w-full sm:w-auto ${selectedCategory ? "bg-blue-50 border-blue-200" : ""}`}
                        onClick={(e) => {
                          e.preventDefault()
                          setIsFilterOpen(!isFilterOpen)
                        }}
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>

                      {isFilterOpen && (
                        <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border rounded-md shadow-lg p-2 z-20">
                          <div className="text-xs font-medium mb-1">Filter by category</div>
                          <div className="space-y-1 max-h-[200px] overflow-y-auto">
                            <div
                              className={`text-xs p-1 rounded cursor-pointer ${selectedCategory === "" ? "bg-blue-50" : "hover:bg-gray-50"}`}
                              onClick={() => {
                                setSelectedCategory("")
                                setIsFilterOpen(false)
                              }}
                            >
                              All Categories
                            </div>
                            {categories.map((category) => (
                              <div
                                key={category}
                                className={`text-xs p-1 rounded cursor-pointer ${selectedCategory.toLowerCase() === category.toLowerCase() ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                onClick={() => {
                                  setSelectedCategory(category)
                                  setIsFilterOpen(false)
                                }}
                              >
                                {category}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product List - Scrollable */}
                <div className="overflow-y-auto flex-1">
                  {filteredGroupedProducts.map((group) => (
                    <div key={group.category} className="border-b last:border-b-0">
                      <div className="px-3 py-2 font-medium bg-gray-50">{group.category}</div>
                      {group.subcategories.map((sub) => (
                        <div key={`${group.category}-${sub.name}`}>
                          <div className="px-4 py-1 text-sm text-muted-foreground">{sub.name}</div>
                          {sub.products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => selectProduct(product.id)}
                            >
                              <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="truncate">{product.name}</span>
                              {selectedProducts.includes(product.id) && (
                                <div className="ml-auto w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Close Button */}
                <div className="sticky bottom-0 bg-white border-t p-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setShowProductSelector(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProducts.map((productId) => {
                const product = products.find((p) => p.id === productId)
                if (!product) return null
                return (
                  <div key={product.id} className="flex items-center gap-2 bg-blue-50 rounded-full pl-2 pr-1 py-1">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm truncate max-w-[150px]">{product.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-blue-100"
                      onClick={() => setSelectedProducts((prev) => prev.filter((id) => id !== product.id))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Caption Input */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Write Caption</h2>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write your post caption here..."
            className="min-h-[100px]"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
          {isSubmitting ? "Creating Post..." : "Create Post"}
        </Button>
      </form>
    </div>
  )
}
