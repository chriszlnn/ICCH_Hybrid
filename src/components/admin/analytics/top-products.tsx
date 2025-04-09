"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryOptions } from "@/components/product-ranking/mock-data";
import { Trophy, TrendingUp, Star, Heart } from "lucide-react";

interface TopProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  voteCount: number;
  rating: number;
  reviewCount: number;
  likes: number;
  trending: boolean;
}

export function TopProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = "/api/votes/top";
        const params = new URLSearchParams();
        
        if (selectedCategory !== "all") {
          params.append("category", selectedCategory);
        }
        if (selectedSubcategory !== "all") {
          params.append("subcategory", selectedSubcategory);
        }
        
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch top products");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load top products");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [selectedCategory, selectedSubcategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("all"); // Reset subcategory when category changes
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCategory !== "all" && (
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {categoryOptions
                .find((cat) => cat.id === selectedCategory)
                ?.subcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <Card key={product.id} className="relative">
            {product.trending && (
              <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1">
                <TrendingUp className="h-4 w-4" />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Trophy className={`h-5 w-5 ${
                  index === 0 ? "text-amber-500" : 
                  index === 1 ? "text-gray-400" : 
                  index === 2 ? "text-amber-700" : 
                  "text-gray-300"
                }`} />
                <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subcategory</span>
                  <span className="font-medium">{product.subcategory}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Votes</span>
                  <span className="font-medium">{product.voteCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Reviews</span>
                  <span className="font-medium">{product.reviewCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Likes</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{product.likes}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 