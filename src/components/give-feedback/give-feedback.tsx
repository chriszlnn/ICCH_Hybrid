"use client";

import type React from "react";
import { useState } from "react";
import { Star } from "lucide-react";

const ISSUE_TAGS = [
  "Application bugs",
  "Customer service",
  "Slow loading",
  "Bad navigation",
  "Visual functionality",
  "Other problems",
];

export default function GiveFeedback() {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || selectedIssues.length === 0) {
      alert("Please select a rating and at least one issue before submitting.");
      return;
    }
    console.log({ rating, selectedIssues, comment });
    setSubmitted(true);
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
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mb-10">
      <h1 className="text-xl font-bold text-gray-900 mb-3 text-center">Give Feedback</h1>
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

          {/* Issue Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">What is wrong?</label>
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

          {/* Notes Section */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (Optional)
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
              rating === 0 || selectedIssues.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            disabled={rating === 0 || selectedIssues.length === 0}
          >
            Submit Feedback
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
          <button
            onClick={handleReset}
            className="mt-3 py-2 px-4 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold rounded-md transition duration-200"
          >
            Submit another response
          </button>
        </div>
      )}
    </div>
  );
}
