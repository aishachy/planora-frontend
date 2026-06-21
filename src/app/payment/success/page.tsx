"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // ❌ No backend verification needed (webhook already handles it)

    if (!sessionId) {
      router.push("/?error=invalid-session");
      return;
    }

    // Give Stripe webhook time to update DB
    const timer = setTimeout(() => {
      router.push("/dashboard/register?success=true");
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId, router]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-green-600 text-2xl font-bold">
        Payment Successful 🎉
      </h1>
      <p className="mt-2">Updating your registration...</p>
    </div>
  );
}