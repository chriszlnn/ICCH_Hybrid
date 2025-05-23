"use client"
import { useState, useEffect } from "react"
import { Heart, Star, TrendingUp, BarChart3, Users, Calendar, Tag, Vote } from "lucide-react"
import type { Product } from "../product-ranking/types"


interface ProductStatsProps {
  product: Product
}

export function ProductStats({ product }: ProductStatsProps) {
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("/api/users")
        const users = await response.json()
        setTotalUsers(users.length)
      } catch (error) {
        console.error("Error fetching total users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTotalUsers()
  }, [])

  // Calculate likes percentage based on total users
  const likesPercentage = totalUsers > 0 ? Math.min((product.likes / totalUsers) * 100, 100) : 0

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100">
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-white">
        <h3 className="text-lg font-medium flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
          Product Statistics
        </h3>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg?height=100&width=100"}
              alt={product.name}
              className="w-24 h-24 rounded-md object-cover border border-gray-200"
            />
            {product.trending && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1">
                <TrendingUp className="h-3 w-3" />
              </div>
            )}
          </div>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.brand}</p>
              </div>
              
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                {capitalizeFirstLetter(product.category)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                {capitalizeFirstLetter(product.subcategory)}
              </span>
            </div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              Added on {product.date}
            </div>
            {product.description && (
              <p className="text-sm mt-2 text-gray-700">
                {product.description.length > 100 
                  ? `${product.description.substring(0, 100)}...` 
                  : product.description}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Votes Stats */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 border-b bg-gray-50 flex items-center">
              <Vote className="h-4 w-4 mr-2 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-700">Votes</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-400" />
                  Total Votes
                </span>
                <span className="text-2xl font-bold text-gray-900">{product.reviewCount}</span>
              </div>
            </div>
          </div>

          {/* Likes Stats */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 border-b bg-gray-50 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              <h3 className="text-sm font-medium text-gray-700">Likes</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Total Likes</span>
                <span className="text-2xl font-bold text-gray-900">{product.likes}</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-300"
                      style={{ 
                        width: likesPercentage > 0 ? `${likesPercentage}%` : '0%'
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{product.likes}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {loading ? "Loading..." : `${likesPercentage.toFixed(1)}% of total users`}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Stats */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 border-b bg-gray-50 flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
              <h3 className="text-sm font-medium text-gray-700">Rating</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Average Rating</span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">{product.rating.toFixed(1)}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating Distribution (mock data) */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  // Generate mock percentages based on the product rating
                  let percentage = 0
                  if (rating === Math.round(product.rating)) {
                    percentage = 45
                  } else if (Math.abs(rating - product.rating) <= 1) {
                    percentage = 25
                  } else if (Math.abs(rating - product.rating) <= 2) {
                    percentage = 15
                  } else {
                    percentage = 5
                  }

                  // If product rating is 0, all percentages should be 0
                  if (product.rating === 0) {
                    percentage = 0;
                  }

                  return (
                    <div key={rating} className="flex items-center">
                      <div className="flex items-center w-6">
                        <span className="text-sm">{rating}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 ml-0.5" />
                      </div>
                      <div className="flex-1 mx-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8">{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center mb-2 text-sm text-gray-700">
                <Tag className="h-4 w-4 mr-1 text-gray-500" />
                <span>Product Tags</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

