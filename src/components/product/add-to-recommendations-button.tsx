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
    subcategory: string;
  };
}

interface AddToRecommendationsButtonProps {
  productId: string;
  variant?: "icon" | "full";
  className?: string;
  disabled?: boolean;
}

// Cache for recommendations to reduce API calls
const CACHE_KEY = 'recommendations_cache';
const CACHE_TIMESTAMP_KEY = 'recommendations_cache_timestamp';
const CACHE_TTL = 60000; // 1 minute cache TTL

// Event name for storage events
const CACHE_INVALIDATION_EVENT = 'recommendations_cache_invalidated';

// Function to invalidate cache across all tabs/components
const invalidateCache = () => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  // Dispatch event to notify other components
  localStorage.setItem(CACHE_INVALIDATION_EVENT, Date.now().toString());
};

export function AddToRecommendationsButton({
  productId,
  variant = "full",
  className = "",
  disabled = false,
}: AddToRecommendationsButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch recommendations with caching
  const fetchRecommendations = useCallback(async () => {
    const now = Date.now();
    const cachedTimestamp = Number(localStorage.getItem(CACHE_TIMESTAMP_KEY) || '0');
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    // Return cached data if it's still valid
    if (cachedData && (now - cachedTimestamp) < CACHE_TTL) {
      return JSON.parse(cachedData);
    }
    
    try {
      const response = await fetch("/api/recommendations");
      
      if (response.ok) {
        const { recommendations } = await response.json();
        
        // Update cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(recommendations));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
        
        return recommendations;
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    
    return [];
  }, []);

  // Function to check and update recommendation status
  const checkRecommendationStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const recommendations = await fetchRecommendations();
      const isRecommended = recommendations.some((rec: Recommendation) => rec.productId === productId);
      setIsSaved(isRecommended);
    } catch (error) {
      console.error("Error checking recommendation status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchRecommendations, productId]);

  // Check recommendation status on mount and when productId changes
  useEffect(() => {
    checkRecommendationStatus();
  }, [checkRecommendationStatus, productId]);

  // Listen for cache invalidation events
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CACHE_INVALIDATION_EVENT) {
        checkRecommendationStatus();
      }
    };

    // Listen for storage events from other tabs/components
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkRecommendationStatus]);

  const handleToggleRecommendation = async (event: React.MouseEvent) => {
    // Prevent event from bubbling up to parent elements
    event.preventDefault();
    event.stopPropagation();

    try {
      if (isSaved) {
        setIsUnsaving(true);
        // Find the recommendation by product ID
        const recommendations = await fetchRecommendations();
        const recommendation = recommendations.find((rec: Recommendation) => rec.productId === productId);
        
        if (!recommendation) {
          toast.error("Unable to find the saved recommendation");
          return;
        }
        
        // Remove from recommendations
        const response = await fetch(`/api/recommendations/${recommendation.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsSaved(false);
          // Invalidate cache across all components
          invalidateCache();
          toast.success("Successfully removed from recommendations");
        } else {
          const data = await response.json();
          toast.error(data.message || "Failed to remove from recommendations. Please try again.");
        }
      } else {
        setIsSaving(true);
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
          // Invalidate cache across all components
          invalidateCache();
          toast.success("Successfully added to recommendations!");
        } else {
          const data = await response.json();
          if (response.status === 409) {
            setIsSaved(true);
            toast.info("This product is already in your recommendations");
          } else {
            toast.error(data.message || "Failed to add to recommendations. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error updating recommendations:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
      setIsUnsaving(false);
    }
  };

  const buttonIsDisabled = isLoading || isSaving || isUnsaving || disabled;

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
      disabled={buttonIsDisabled}
      title={isSaved ? "Remove from recommendations" : "Add to recommendations"}
    >
      <BookmarkIcon className={cn(
        "h-4 w-4",
        isLoading && "animate-pulse",
        isSaved && "fill-green-500"
      )} />
      {variant === "full" && (
        isLoading ? "Loading..." :
        isSaving ? "Adding..." : 
        isUnsaving ? "Removing..." : 
        isSaved ? "Saved" : "Save"
      )}
    </Button>
  );
} 