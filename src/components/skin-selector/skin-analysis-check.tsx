import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/general/button";
import { Loader2 } from "lucide-react";

interface SkinAnalysisCheckProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export function SkinAnalysisCheck({ isOpen, onClose, onProceed }: SkinAnalysisCheckProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPreviousAnalysis, setHasPreviousAnalysis] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check if user has previous skin analysis
  useEffect(() => {
    const checkPreviousAnalysis = async () => {
      try {
        setIsLoading(true);
        
        // Check if there are any recommendations in the database
        const response = await fetch("/api/recommendations");
        
        if (response.ok) {
          const data = await response.json();
          // If there are recommendations, assume user has done a skin analysis
          setHasPreviousAnalysis(data.recommendations && data.recommendations.length > 0);
        }
      } catch (error) {
        console.error("Error checking previous analysis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      checkPreviousAnalysis();
    }
  }, [isOpen]);

  // Show confirmation dialog if user has previous analysis
  useEffect(() => {
    if (!isLoading && hasPreviousAnalysis) {
      setShowConfirmation(true);
    }
  }, [isLoading, hasPreviousAnalysis]);

  const handleProceed = () => {
    setShowConfirmation(false);
    onProceed();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Checking Skin Analysis</DialogTitle>
            <DialogDescription>
              Please wait while we check if you have a previous skin analysis...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Previous Skin Analysis Found</DialogTitle>
            <DialogDescription>
              You have already completed a skin analysis. Would you like to submit another one?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              No, Return to Page
            </Button>
            <Button onClick={handleProceed}>
              Yes, Start New Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // If no previous analysis, proceed directly
  if (!hasPreviousAnalysis) {
    onProceed();
    return null;
  }

  return null;
} 