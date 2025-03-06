"use client";

import { useState } from "react";
import { Star } from "lucide-react";

// Issue categories for filtering
const ISSUE_TAGS = [
  "Application bugs",
  "Customer service",
  "Slow loading",
  "Bad navigation",
  "Visual functionality",
  "Other problems",
];

// Mock feedback data
const mockFeedback = [
  {
    id: "1",
    rating: 5,
    selectedIssues: ["Customer service"],
    comment:
      "The staff was incredibly helpful and attentive. The new community programs are excellent!",
    submittedAt: "2024-03-01T14:30:00Z",
    submittedBy: {
      name: "Rachel Patel",
      avatar: "/placeholder.svg",
    },
  },
  {
    id: "2",
    rating: 4,
    selectedIssues: ["Visual functionality", "Bad navigation"],
    comment:
      "Really impressed with the quality of service. The website could use some improvements in navigation, but otherwise, it's perfect!",
    submittedAt: "2024-02-28T09:15:00Z",
    submittedBy: {
      name: "Christopher Lee",
      avatar: "/placeholder.svg",
    },
  },
];

// Calculate average rating
const averageRating = (
  mockFeedback.reduce((acc, feedback) => acc + feedback.rating, 0) /
  mockFeedback.length
).toFixed(1);

// Calculate rating distribution
const ratingCounts = [5, 4, 3, 2, 1].map(
  (rating) =>
    mockFeedback.filter((feedback) => feedback.rating === rating).length
);
const totalReviews = mockFeedback.length;

export default function ViewFeedback() {
  const [issueFilter, setIssueFilter] = useState("all");

  // Filter feedback based on selected issue
  const filteredFeedback = mockFeedback.filter((feedback) => {
    return issueFilter === "all" || feedback.selectedIssues.includes(issueFilter);
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
          <p className="text-sm text-gray-500">{totalReviews} Reviews</p>

          {/* Rating Distribution */}
          <div className="mt-4 space-y-1">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm font-medium">{rating}</span>
                <div className="relative w-full h-2 bg-gray-200 rounded">
                  <div
                    className="absolute top-0 left-0 h-2 bg-yellow-500 rounded"
                    style={{ width: `${(ratingCounts[index] / totalReviews) * 100 || 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {((ratingCounts[index] / totalReviews) * 100 || 0).toFixed(0)}%
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
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                {/* User Info and Rating */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <img
                      src={feedback.submittedBy.avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{feedback.submittedBy.name}</h3>
                      <p className="text-sm text-gray-400">{formatDate(feedback.submittedAt)}</p>
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
                {feedback.selectedIssues.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {feedback.selectedIssues.map((issue) => (
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
                <p className="mt-2 text-gray-400">{feedback.comment}</p>
              </div>
            ))}

            {/* No Feedback Message */}
            {filteredFeedback.length === 0 && (
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
