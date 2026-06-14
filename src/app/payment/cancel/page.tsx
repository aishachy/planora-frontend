"use client";

import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Payment Cancelled
        </h1>

        <p className="mt-2 text-gray-600">
          You can try again anytime.
        </p>

        <button
          onClick={() => router.back()}
          className="mt-5 bg-red-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}