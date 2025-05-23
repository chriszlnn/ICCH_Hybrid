"use client";

import type React from "react";
import { useState } from "react";
import { Star, MessageSquarePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ISSUE_TAGS = [
  "Application bugs",
  "Customer service",
  "Slow loading",
  "Bad navigation",
  "Visual functionality",
  "Other problems",
];

export default function GiveFeedback() {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    const email = session?.user?.email;
    if (!email) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          issues: selectedIssues,
          comment,
          email,
        }),
      });

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          handleReset();
        }, 2000);
      } else {
        const errorData = JSON.parse(responseText);
        alert(`Failed to submit feedback: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setSelectedIssues([]);
    setComment("");
    setSubmitted(false);
  };

  const toggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200 group"
        >
          <MessageSquarePlus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline group-hover:inline sm:group-hover:inline">Give Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-bold text-gray-900 text-center">Give Feedback</DialogTitle>
        <div className="w-full p-4">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating Section */}
              <div className="text-center">
                <h2 className="text-md font-semibold text-gray-900">How was your overall experience?</h2>
                <p className="text-gray-500 text-sm">It will help us to serve you better.</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 focus:outline-none"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        size={24}
                        className={`${
                          hoveredRating >= star || rating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Issue Selection (Optional) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What is wrong? <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ISSUE_TAGS.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => toggleIssue(issue)}
                      className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors text-center
                        ${
                          selectedIssues.includes(issue)
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Section (Optional) */}
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  placeholder="Please provide any additional feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full min-h-[80px] p-2 text-sm border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2 px-4 text-sm font-semibold rounded-md transition duration-200 ${
                  rating === 0 || isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                disabled={rating === 0 || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          ) : (
            /* Thank You Message */
            <div className="text-center space-y-3 py-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-md font-semibold text-gray-900">Thank you for your feedback!</h3>
              <p className="text-gray-500 text-sm">Your input helps us improve our services.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
