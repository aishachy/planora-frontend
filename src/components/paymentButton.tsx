"use client";

import { createCheckoutSession } from "../app/services/paymentService";

export default function PaymentButton({
  registrationId,
  amount,
}: {
  registrationId: string;
  amount: number;
}) {
const handlePayment = async () => {
  console.log("PAYMENT CLICKED");
  console.log("Registration ID:", registrationId);
  console.log("Amount:", amount);

    try {
      const res = await createCheckoutSession(
        registrationId,
        amount
      );

    console.log("PAYMENT RESPONSE:", res);

    if (res.url) {
      window.location.href = res.url;
    }
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
  }
};

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Pay Now
    </button>
  );
}