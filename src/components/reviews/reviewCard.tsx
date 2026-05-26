/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function ReviewCard({
  review,
}: {
  review: any;
}) {
  return (
    <div className="border p-4 rounded">
      <h3 className="font-semibold">
        {review.user?.name}
      </h3>

      <p className="text-yellow-500">
        Rating: {review.rating}/5
      </p>

      <p className="mt-2">
        {review.comment}
      </p>
    </div>
  );
}