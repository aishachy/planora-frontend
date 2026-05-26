/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { createReview } from "../../app/services/reviewService";

export default function ReviewForm({
  eventId,
  refreshReviews,
}: {
  eventId: string;
  refreshReviews: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      await createReview(
        {
          eventId,
          rating,
          comment,
        },
        token
      );

      alert("Review added");

      setComment("");
      setRating(5);

      refreshReviews();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded space-y-4"
    >
      <h2 className="text-xl font-semibold">
        Write Review
      </h2>

      <div>
        <label className="block mb-1">
          Rating
        </label>

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
          className="border p-2 w-full"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">
          Comment
        </label>

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          className="border p-2 w-full"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}