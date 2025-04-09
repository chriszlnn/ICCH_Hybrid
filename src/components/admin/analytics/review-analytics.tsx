"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, ThumbsUp, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  positiveReviews: number;
  recentReviews: number;
}

interface Review {
  id: string;
  rating: number;
  createdAt: string;
  author: {
    email: string;
  };
  product: {
    id: string;
    name: string;
  };
}

export function ReviewAnalytics() {
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    positiveReviews: 0,
    recentReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/admin/reviews");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reviews: Review[] = await response.json();
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentReviews = reviews.filter((review) => {
          const reviewDate = new Date(review.createdAt);
          return reviewDate >= oneWeekAgo;
        }).length;

        const positiveReviews = reviews.filter((review) => review.rating >= 4).length;
        
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

        setStats({
          totalReviews: reviews.length,
          averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
          positiveReviews,
          recentReviews,
        });
      } catch (error) {
        console.error("Error fetching review stats:", error);
        setError("Failed to load review statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewStats();
  }, []);

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Positive Reviews</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.positiveReviews}</div>
          <p className="text-xs text-muted-foreground">
            4+ star reviews
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentReviews}</div>
          <p className="text-xs text-muted-foreground">
            Last 7 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 