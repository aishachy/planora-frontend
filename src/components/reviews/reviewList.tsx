"use client";

import { useEffect, useState, useCallback } from "react";
import { getEventReviews } from "../../app/services/reviewService";

type Review = {
  id: string;
  rating: number;
  comment?: string;
  user?: {
    name?: string;
  };
};

export default function ReviewList({ eventId }: { eventId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getEventReviews(eventId);

      const data = Array.isArray(res?.data) ? res.data : [];

      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) loadReviews();
  }, [eventId, loadReviews]);

  if (loading) {
    return <p className="mt-6 text-gray-500">Loading reviews...</p>;
  }

  return (
    <div className="mt-6">
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="border p-3 mb-2 rounded">
            <p className="font-semibold">
              {r.user?.name || "Anonymous"}
            </p>

            <p>⭐ {r.rating}</p>

            {r.comment && <p>{r.comment}</p>}
          </div>
        ))
      )}
    </div>
  );
}