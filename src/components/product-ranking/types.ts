// BACKEND INTEGRATION POINT:
// These interfaces should match the data structure returned by your backend API

export type Category = "skincare" | "makeup" | "hairbody"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  volume?: string
  image: string
  brand: string
  category: Category
  subcategory: string
  rank: number // 1, 2, 3 for top three products in each subcategory
  rating: number
  reviewCount: number
  likes: number
  votes: number
  trending: boolean
  date: string
  tags?: string[]
}

export interface CategoryOption {
  id: Category
  label: string
  icon: string
  subcategories: {
    id: string
    label: string
    products?: string[]
  }[]
}

// Enhanced Review interface with image support
export interface Review {
  id: string
  userId: string
  username: string
  rating: number
  comment: string
  date: string
  likes: number
  userLiked?: boolean
  skinType?: string[]
  image?: string | null // Added support for review images
}

// You might want to add more interfaces for API responses
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

