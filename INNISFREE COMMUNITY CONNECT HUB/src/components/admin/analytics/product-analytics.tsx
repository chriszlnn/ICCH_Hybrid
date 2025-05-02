"use client";

import { useState, useEffect } from "react";
import { BarChart3, Heart, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductStats {
  totalProducts: number;
  totalLikes: number;
  totalReviews: number;
  averageRating: number;
  trendingProducts: number;
  topProduct?: {
    id: string;
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
  };
}

interface Product {
  id: string;
  name: string;
  likes: number;
  reviewCount: number;
  rating: number;
  trending: boolean;
  image?: string;
  rank?: number;
}

export function ProductAnalytics() {
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    totalLikes: 0,
    totalReviews: 0,
    averageRating: 0,
    trendingProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const response = await fetch("/api/products");
        const products: Product[] = await response.json();
        
        const totalLikes = products.reduce((sum: number, product: Product) => sum + product.likes, 0);
        const totalReviews = products.reduce((sum: number, product: Product) => sum + product.reviewCount, 0);
        const totalRating = products.reduce((sum: number, product: Product) => sum + (product.rating * product.reviewCount), 0);
        const trendingCount = products.filter((product: Product) => product.trending).length;

        // Find the top ranked product
        const topProduct = products
          .filter(product => product.rank === 1)
          .sort((a, b) => b.reviewCount - a.reviewCount)[0];

        setStats({
          totalProducts: products.length,
          totalLikes,
          totalReviews,
          averageRating: totalReviews > 0 ? totalRating / totalReviews : 0,
          trendingProducts: trendingCount,
          topProduct: topProduct ? {
            id: topProduct.id,
            name: topProduct.name,
            image: topProduct.image || "/placeholder.svg",
            rating: topProduct.rating,
            reviewCount: topProduct.reviewCount,
          } : undefined,
        });
      } catch (error) {
        console.error("Error fetching product stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Products in the catalog
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLikes}</div>
          <p className="text-xs text-muted-foreground">
            Across all products
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
          <p className="text-xs text-muted-foreground">
            Customer reviews
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Out of 5 stars
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-2 lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Ranked Product</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.topProduct ? (
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                <img
                  src={stats.topProduct.image}
                  alt={stats.topProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{stats.topProduct.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{stats.topProduct.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{stats.topProduct.reviewCount} reviews</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No ranked products available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 