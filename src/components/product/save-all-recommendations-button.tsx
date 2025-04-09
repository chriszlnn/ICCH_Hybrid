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

interface SaveAllRecommendationsButtonProps {
  productIds: string[];
  className?: string;
  onSaveAll?: () => void;
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

export function SaveAllRecommendationsButton({
  productIds,
  className = "",
  onSaveAll,
}: SaveAllRecommendationsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  // Function to check recommendation status
  const checkRecommendationStatus = useCallback(async () => {
    try {
      // Force a fresh fetch to ensure we have the latest data
      const response = await fetch("/api/recommendations", {
        headers: {
          'Cache-Control': 'no-cache', // Ensure we get fresh data
        }
      });
      
      if (!response.ok) {
        console.error("Failed to fetch recommendations");
        return;
      }
      
      const { recommendations } = await response.json();
      
      // Update cache with fresh data
      recommendationsCache.data = recommendations;
      recommendationsCache.timestamp = Date.now();
      
      const recommendedProductIds = new Set(recommendations.map((rec: Recommendation) => rec.productId));
      
      // Count how many products are already saved
      const count = productIds.filter(id => recommendedProductIds.has(id)).length;
      setSavedCount(count);
      
      // Only mark as fully saved if all products are saved
      setIsSaved(count === productIds.length);
      
      // Log for debugging
      console.log(`Recommendation status: ${count}/${productIds.length} products saved`);
    } catch (error) {
      console.error("Error checking recommendation status:", error);
    }
  }, [productIds]);

  // Check status on mount and when productIds change
  useEffect(() => {
    checkRecommendationStatus();
  }, [checkRecommendationStatus]);

  // Set up an interval to periodically check the status
  useEffect(() => {
    // Check more frequently (every 5 seconds) to catch removals quickly
    const interval = setInterval(checkRecommendationStatus, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [checkRecommendationStatus]);

  // Subscribe to recommendation changes
  useEffect(() => {
    const unsubscribe = recommendationChangeEmitter.subscribe(checkRecommendationStatus);
    return () => unsubscribe();
  }, [checkRecommendationStatus]);

  const handleSaveAll = async () => {
    if (productIds.length === 0) {
      toast.error("No products to save");
      return;
    }

    try {
      setIsLoading(true);
      
      // Notify parent component that save all is in progress
      if (onSaveAll) {
        onSaveAll();
      }
      
      // Create a counter for successful saves
      let successCount = 0;
      let errorCount = 0;
      
      // Process products in batches of 5 to avoid overwhelming the server
      const batchSize = 5;
      const batches = [];
      
      for (let i = 0; i < productIds.length; i += batchSize) {
        batches.push(productIds.slice(i, i + batchSize));
      }
      
      // Process each batch
      for (const batch of batches) {
        // Process each product in the batch concurrently
        const batchPromises = batch.map(async (productId) => {
          try {
            const response = await fetch("/api/recommendations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ productId }),
            });

            if (response.ok) {
              return { success: true, productId };
            } else {
              const errorData = await response.json();
              if (response.status === 409) {
                // Already in recommendations, count as success
                return { success: true, productId };
              } else {
                console.error('Failed to add recommendation:', errorData.message);
                return { success: false, productId };
              }
            }
          } catch (err) {
            console.error('Error processing recommendation:', err);
            return { success: false, productId };
          }
        });
        
        // Wait for all promises in the batch to resolve
        const results = await Promise.all(batchPromises);
        
        // Count successes and failures
        results.forEach(result => {
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        });
      }
      
      // Update the saved count
      setSavedCount(prev => prev + successCount);
      
      // Show appropriate toast message
      if (successCount === productIds.length) {
        setIsSaved(true);
        toast.success(`Added ${successCount} products to your recommendations!`);
      } else if (successCount > 0) {
        // Important: Set isSaved to false if not all products were saved
        setIsSaved(false);
        toast.success(`Added ${successCount} products to your recommendations. ${errorCount} failed.`);
      } else {
        setIsSaved(false);
        toast.error("Failed to add products to recommendations");
      }
      
      // Invalidate cache
      recommendationsCache.data = null;
      
      // Notify all components about the change
      recommendationChangeEmitter.emit();
      
      // Recheck the status after saving
      await checkRecommendationStatus();
    } catch (error) {
      console.error("Error adding recommendations:", error);
      toast.error("An error occurred while adding recommendations");
      // Make sure to set isSaved to false in case of error
      setIsSaved(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate remaining products to save
  const remainingCount = productIds.length - savedCount;

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center gap-2",
        isSaved && "bg-green-50 border-green-500 text-green-600 hover:bg-green-100",
        className
      )}
      onClick={handleSaveAll}
      disabled={isLoading || isSaved}
      title={isSaved ? "All products saved" : "Save all products to recommendations"}
    >
      <BookmarkIcon className={cn("h-4 w-4", isSaved && "fill-green-500")} />
      {isLoading ? "Saving..." : isSaved ? "All Saved" : `Save All (${remainingCount})`}
    </Button>
  );
} 