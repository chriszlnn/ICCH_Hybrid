"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

// Issue categories for filtering
const ISSUE_TAGS = [
  "Application bugs",
  "Customer service",
  "Slow loading",
  "Bad navigation",
  "Visual functionality",
  "Other problems",
];

export default function ViewFeedback() {
  const [issueFilter, setIssueFilter] = useState("all");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback data from the API
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback");
        const data = await response.json();
        setFeedbackData(data || []); // Ensure we always set an array
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbackData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Calculate average rating
  const averageRating = feedbackData.length > 0
    ? (feedbackData.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbackData.length).toFixed(1)
    : "0.0";

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) =>
      feedbackData.filter((feedback) => feedback.rating === rating).length
  );
  const totalReviews = feedbackData.length;

  // Filter feedback based on selected issue
  const filteredFeedback = feedbackData.filter((feedback) => {
    return issueFilter === "all" || feedback.issues.includes(issueFilter);
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md pb-24">
      <h1 className="text-2xl font-bold mb-6">View Feedback</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Average Rating Section */}
        <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Average Rating</h2>
          {loading ? (
            <Skeleton className="h-8 w-24" /> // Skeleton for average rating
          ) : (
            <div className="flex items-center">
              <span className="text-3xl font-bold">{averageRating}</span>
              <div className="flex ml-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    fill={index < Math.round(Number(averageRating)) ? "currentColor" : "none"}
                    className={`w-5 h-5 ${index < Math.round(Number(averageRating)) ? "text-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="text-sm text-gray-500">
              {loading ? <Skeleton className="h-4 w-16 mt-2" /> : `${totalReviews} Reviews`}
          </div>

          {/* Rating Distribution */}
          <div className="mt-4 space-y-1">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm font-medium">{rating}</span>
                <div className="relative w-full h-2 bg-gray-200 rounded">
                  {loading ? (
                    <Skeleton className="h-2 w-full" /> // Skeleton for rating bar
                  ) : (
                    <div
                      className="absolute top-0 left-0 h-2 bg-yellow-500 rounded"
                      style={{ width: `${(ratingCounts[index] / totalReviews) * 100 || 0}%` }}
                    />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {loading ? (
                    <Skeleton className="h-4 w-8" /> // Skeleton for percentage
                  ) : (
                    `${((ratingCounts[index] / totalReviews) * 100 || 0).toFixed(0)}%`
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Feedback Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Customer Feedback</h2>

          {/* Issue Filter */}
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="issueFilter" className="font-medium text-gray-700">Filter by:</label>
            {loading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <select
                id="issueFilter"
                value={issueFilter}
                onChange={(e) => setIssueFilter(e.target.value)}
                className="border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:outline-none"
              >
                <option value="all">All Issues</option>
                {ISSUE_TAGS.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Feedback List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              // Skeleton for feedback list
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ))
            ) : filteredFeedback.length > 0 ? (
              filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  {/* User Info and Rating */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{feedback.email}</h3>
                        <p className="text-sm text-gray-400">{formatDate(feedback.createdAt)}</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          fill={index < feedback.rating ? "currentColor" : "none"}
                          className={`w-5 h-5 ${
                            index < feedback.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Issue Tags */}
                  {feedback.issues && feedback.issues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {feedback.issues.map((issue: string) => (
                        <span
                          key={issue}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Comment */}
                  {feedback.comment && (
                    <p className="mt-2 text-gray-400">{feedback.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No feedback available for this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}