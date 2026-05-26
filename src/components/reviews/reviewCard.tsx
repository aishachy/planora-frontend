/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import {
    deleteReview,
    updateReview,
} from "../../app/services/reviewService";

export default function ReviewCard({
    review,
    refreshReviews,
}: {
    review: any;
    refreshReviews: () => void;
}) {
    const [isEditing, setIsEditing] =
        useState(false);

    const [rating, setRating] = useState(
        review.rating
    );

    const [comment, setComment] = useState(
        review.comment
    );

    const [loading, setLoading] =
        useState(false);

    // current logged in user
    const currentUser =
        typeof window !== "undefined"
            ? JSON.parse(
                localStorage.getItem("user") || "{}"
            )
            : null;

    const isOwner =
        currentUser?.id === review.userId;

    // UPDATE REVIEW
    const handleUpdate = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Login required");
                return;
            }

            await updateReview(
                review.id,
                {
                    rating,
                    comment,
                },
                token
            );
            review.rating = rating;
            review.comment = comment;

            alert("Review updated");

            setIsEditing(false);

            refreshReviews();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // DELETE REVIEW
    const handleDelete = async () => {
        const confirmDelete = confirm(
            "Delete this review?"
        );

        if (!confirmDelete) return;

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Login required");
                return;
            }

            await deleteReview(review.id, token);

            alert("Review deleted");

            refreshReviews();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border p-4 rounded space-y-3">

            <div>
                <h3 className="font-semibold">
                    {review.user?.name}
                </h3>
            </div>

            {isEditing ? (
                <>
                    <select
                        value={rating}
                        onChange={(e) =>
                            setRating(Number(e.target.value))
                        }
                        className="border p-2"
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>

                    <textarea
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)
                        }
                        className="border p-2 w-full"
                        rows={4}
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="bg-black text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>

                        <button
                            onClick={() =>
                                setIsEditing(false)
                            }
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-yellow-500">
                        Rating: {review.rating}/5
                    </p>

                    <p>{review.comment}</p>

                    {isOwner && (
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() =>
                                    setIsEditing(true)
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}