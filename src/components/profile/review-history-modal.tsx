"use client";

import { useState, useEffect } from "react";
import { History, Trash2, Settings, Star, ChevronLeft, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/general/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface Recommendation {
  id: string;
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

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  id: string;
}

interface ReviewHistoryModalProps {
  userEmail: string;
}

export function ReviewHistoryModal({ userEmail }: ReviewHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingRecommendationId, setDeletingRecommendationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("history");

  // Sidebar items including recommendations
  const sidebarItems: SidebarItem[] = [
    { icon: <History className="h-5 w-5" />, label: "Review History", id: "history" },
    { icon: <BookmarkIcon className="h-5 w-5" />, label: "Recommendations", id: "recommendations" },
   
    
  ];

  // Fetch data when the modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchReviews();
      fetchRecommendations();
    }
  }, [isOpen]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/reviews/user?email=${encodeURIComponent(userEmail)}`);
      
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      } else {
        console.error("Failed to fetch reviews");
        toast.error("Failed to load your review history");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("An error occurred while loading your reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch("/api/recommendations", {
        // Add cache control headers to prevent caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } else {
        console.error("Failed to fetch recommendations");
        toast.error("Failed to load your recommendations");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("An error occurred while loading your recommendations");
    }
  };

  const handleRemoveRecommendation = async (recommendationId: string) => {
    try {
      setDeletingRecommendationId(recommendationId);
      const res = await fetch(`/api/recommendations/${recommendationId}`, {
        method: "DELETE",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (res.ok) {
        // Update local state immediately
        setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
        
        // Then fetch fresh data from server
        await fetchRecommendations();
        
        toast.success("Recommendation removed successfully");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove recommendation");
      }
    } catch (error) {
      console.error("Error removing recommendation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove recommendation");
    } finally {
      setDeletingRecommendationId(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove the deleted review from the state
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
        setSelectedReview(null);
        toast.success("Review deleted successfully");
      } else {
        const errorData = await res.json();
        console.error("Failed to delete review:", errorData.error);
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("An error occurred while deleting the review");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllHistory = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/reviews/delete-history", {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews([]);
        setSelectedReview(null);
        toast.success("All review history deleted successfully");
      } else {
        const errorData = await res.json();
        console.error("Failed to delete review history:", errorData.error);
        toast.error("Failed to delete review history");
      }
    } catch (error) {
      console.error("Error deleting review history:", error);
      toast.error("An error occurred while deleting review history");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Review History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Your Review History</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r p-4 flex flex-col">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </div>
            
            {activeTab === "history" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full mt-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Review History</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your product reviews and likes. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAllHistory}
                      className="bg-destructive text-destructive-foreground"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete All"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "history" && (
              <>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <History className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No review history</h3>
                    <p className="text-muted-foreground">
                      You haven&apos;t posted any reviews yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div 
                        key={review.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedReview?.id === review.id 
                            ? "bg-muted" 
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedReview(review)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                            {review.product.imageUrl ? (
                              <img 
                                src={review.product.imageUrl} 
                                alt={review.product.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{review.product.name}</h3>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 my-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-muted-foreground"
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-sm line-clamp-2">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Selected review details */}
                {selectedReview && (
                  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
                      <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold">{selectedReview.product.name}</h2>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedReview(null)}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-6 overflow-auto max-h-[calc(80vh-8rem)]">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-24 w-24 rounded-md overflow-hidden bg-muted">
                            {selectedReview.product.imageUrl ? (
                              <img 
                                src={selectedReview.product.imageUrl} 
                                alt={selectedReview.product.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-5 w-5 ${
                                    i < selectedReview.rating 
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-muted-foreground"
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Posted {formatDate(selectedReview.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium">Your Review</h3>
                          <p className="whitespace-pre-wrap">{selectedReview.content}</p>
                        </div>
                      </div>
                      
                      <div className="p-6 border-t flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedReview(null)}
                        >
                          Close
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Review
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Review</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this review? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteReview(selectedReview.id)}
                                className="bg-destructive text-destructive-foreground"
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "recommendations" && (
              <>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No recommendations</h3>
                    <p className="text-muted-foreground">
                      You haven&apos;t added any products to your recommendations yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="relative w-full aspect-square mb-3">
                          <img
                            src={rec.product.image}
                            alt={rec.product.name}
                            className="object-cover rounded-md w-full h-full"
                          />
                        </div>
                        <h4 className="font-medium text-lg">{rec.product.name}</h4>
                        <div className="flex flex-col gap-1 mt-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Category:</span>
                            <span className="text-sm text-gray-600">{capitalizeFirstLetter(rec.product.category)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Subcategory:</span>
                            <span className="text-sm text-gray-600">{capitalizeFirstLetter(rec.product.subcategory)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-green-600 font-medium">
                            RM {rec.product.price.toFixed(2)}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveRecommendation(rec.id)}
                            disabled={deletingRecommendationId === rec.id}
                          >
                            {deletingRecommendationId === rec.id ? "Removing..." : "Remove"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Placeholder for future tabs */}
            {!["history", "recommendations"].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Coming Soon</h3>
                <p className="text-muted-foreground">
                  This feature is under development and will be available soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 