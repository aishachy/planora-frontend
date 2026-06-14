"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          setStatus("Invalid session");
          setLoading(false);
          return;
        }

        // OPTIONAL: you can call backend to confirm payment status
        // BUT webhook already handles DB update

        setStatus("Payment successful 🎉");
      } catch (err) {
        setStatus("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-green-600">
          {loading ? "Processing..." : status}
        </h1>

        <p className="mt-2 text-gray-600">
          Your payment has been processed successfully.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-5 bg-green-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}