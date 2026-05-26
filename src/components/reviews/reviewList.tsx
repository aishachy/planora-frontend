/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  getEventReviews,
} from "../../app/services/reviewService";

import ReviewCard from "../reviews/reviewCard";

export default function ReviewList({
  eventId,
  refresh,
}: {
  eventId: string;
  refresh: number;
}) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const result =
          await getEventReviews(eventId);

        setReviews(result.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [eventId, refresh]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Reviews
      </h2>

      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
          />
        ))
      )}
    </div>
  );
}