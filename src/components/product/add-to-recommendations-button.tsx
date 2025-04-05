import { useState, useEffect, useCallback } from "react";
import { BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/general/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    category: string;
  };
}

interface AddToRecommendationsButtonProps {
  productId: string;
  variant?: "icon" | "full";
  className?: string;
  disabled?: boolean;
  initialSavedState?: boolean;
}

// Cache for recommendations to reduce API calls
const recommendationsCache = {
  data: null as Recommendation[] | null,
  timestamp: 0,
  TTL: 60000, // 1 minute cache TTL
};

// Event emitter for recommendation changes
const recommendationChangeEmitter = {
  listeners: new Set<() => void>(),
  emit() {
    this.listeners.forEach(listener => listener());
  },
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
};

export function AddToRecommendationsButton({
  productId,
  variant = "full",
  className = "",
  disabled = false,
  initialSavedState = false,
}: AddToRecommendationsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSavedState);

  // Memoized function to check if a product is in recommendations
  const isProductRecommended = useCallback((recommendations: Recommendation[]) => {
    return recommendations.some((rec) => rec.productId === productId);
  }, [productId]);

  // Function to fetch recommendations with caching
  const fetchRecommendations = useCallback(async () => {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (recommendationsCache.data && (now - recommendationsCache.timestamp) < recommendationsCache.TTL) {
      return recommendationsCache.data;
    }
    
    try {
      const response = await fetch("/api/recommendations", {
        headers: {
          'Cache-Control': 'no-cache', // Ensure we get fresh data
        }
      });
      
      if (response.ok) {
        const { recommendations } = await response.json();
        
        // Update cache
        recommendationsCache.data = recommendations;
        recommendationsCache.timestamp = now;
        
        return recommendations;
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    
    return [];
  }, []);

  // Function to check and update recommendation status
  const checkRecommendationStatus = useCallback(async () => {
    const recommendations = await fetchRecommendations();
    setIsSaved(isProductRecommended(recommendations));
  }, [fetchRecommendations, isProductRecommended]);

  // Check recommendation status on mount
  useEffect(() => {
    checkRecommendationStatus();
  }, [checkRecommendationStatus]);

  // Subscribe to recommendation changes
  useEffect(() => {
    const unsubscribe = recommendationChangeEmitter.subscribe(checkRecommendationStatus);
    return () => unsubscribe();
  }, [checkRecommendationStatus]);

  const handleToggleRecommendation = async () => {
    try {
      setIsLoading(true);
      
      if (isSaved) {
        // Remove from recommendations
        const response = await fetch(`/api/recommendations/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsSaved(false);
          // Invalidate cache
          recommendationsCache.data = null;
          // Notify other components
          recommendationChangeEmitter.emit();
          toast.success("Removed from recommendations");
        } else {
          const data = await response.json();
          toast.error(data.message || "Failed to remove from recommendations");
        }
      } else {
        // Add to recommendations
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setIsSaved(true);
          // Invalidate cache
          recommendationsCache.data = null;
          // Notify other components
          recommendationChangeEmitter.emit();
          toast.success("Added to recommendations!");
        } else {
          const data = await response.json();
          if (response.status === 409) {
            setIsSaved(true);
            toast.info("Product is already in your recommendations");
          } else {
            toast.error(data.message || "Failed to add to recommendations");
          }
        }
      }
    } catch (error) {
      console.error("Error toggling recommendation:", error);
      toast.error("Failed to update recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={variant === "icon" ? "icon" : "sm"}
      className={cn(
        "flex items-center gap-2",
        isSaved && "bg-green-50 border-green-500 text-green-600 hover:bg-green-100",
        variant === "icon" && "h-8 w-8 p-0",
        className
      )}
      onClick={handleToggleRecommendation}
      disabled={isLoading || disabled}
      title={isSaved ? "Remove from recommendations" : "Add to recommendations"}
    >
      <BookmarkIcon className={cn("h-4 w-4", isSaved && "fill-green-500")} />
      {variant === "full" && (isLoading ? "Saving..." : isSaved ? "Saved" : "Save")}
    </Button>
  );
} 