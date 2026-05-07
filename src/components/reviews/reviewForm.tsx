/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { createReview } from "../../app/services/reviewService";

export default function ReviewForm({
    eventId,
    onSuccess,
}: {
    eventId: string;
    onSuccess?: () => void;
}) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Login required");
                return;
            }

            const res = await createReview(
                { eventId, rating, comment },
                token
            );

            alert(res.message || "Review submitted");

            setComment("");
            setRating(5);

            onSuccess?.();
        } catch (error: any) {
            alert(error.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-2">Write a Review</h3>

            <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
            >
                {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                        {n} ⭐
                    </option>
                ))}
            </select>

            <textarea
                className="w-full border mt-2 p-2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 bg-black text-white px-4 py-2 rounded"
            >
                {loading ? "Submitting..." : "Submit"}
            </button>
        </div>
    );
}