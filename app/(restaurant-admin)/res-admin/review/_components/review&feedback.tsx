"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dummy data for reviews
interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
}

export const ReviewsAndFeedback: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      customerName: "John Doe",
      rating: 5,
      comment: "Great food and excellent service!",
      date: "2024-10-01",
      response: "Thank you for your kind words!",
    },
    {
      id: "2",
      customerName: "Jane Smith",
      rating: 4,
      comment: "Good experience, but the waiting time was a bit long.",
      date: "2024-10-02",
    },
    {
      id: "3",
      customerName: "Alice Johnson",
      rating: 3,
      comment: "Average experience. The food was okay.",
      date: "2024-10-03",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [response, setResponse] = useState("");

  const handleOpenResponseDialog = (review: Review) => {
    setSelectedReview(review);
    setResponse(review.response || "");
    setDialogOpen(true);
  };

  const handleSaveResponse = () => {
    if (selectedReview) {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === selectedReview.id ? { ...review, response } : review
        )
      );
      setDialogOpen(false);
      setSelectedReview(null);
      setResponse("");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Reviews & Feedback
          </h1>
        </div>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-start"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  {review.customerName}
                </h2>
                <p className="text-yellow-500 mb-1">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </p>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                {review.response && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-700 font-semibold">Response:</p>
                    <p className="text-blue-700">{review.response}</p>
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleOpenResponseDialog(review)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {review.response ? "Edit Response" : "Respond"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog for Responding to a Review */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full"
              rows={4}
              placeholder="Write your response here..."
            />
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              onClick={() => setDialogOpen(false)}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveResponse}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Response
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
