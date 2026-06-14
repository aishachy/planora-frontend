"use client";

import { useEffect, useState } from "react";
import { getMyRegistrations } from "../../services/registrationService";
import { createCheckoutSession } from "app/services/paymentService";

export default function MyRegistrationsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [registrations, setRegistrations] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const result = await getMyRegistrations();

      setRegistrations(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const handlePayment = async (
    registrationId: string,
    amount: number
  ) => {
    try {
      const res = await createCheckoutSession(
        registrationId,
        amount
      );

      if (res?.url) {
        window.location.assign(res.url);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to start payment");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Registrations
      </h1>

      {registrations.length === 0 ? (
        <p>No registrations found.</p>
      ) : (
        registrations.map((r) => (
          <div
            key={r.id}
            className="border rounded p-4 mb-3"
          >
            <h2 className="font-semibold">
              {r.event.title}
            </h2>

            <p>
              Date:{" "}
              {new Date(
                r.event.date
              ).toLocaleDateString()}
            </p>

            <p>
              Venue: {r.event.venue}
            </p>

            <p>
              Status:
              <span className="font-bold ml-2">
                {r.status}
              </span>
            </p>

            {r.event.fee && (
              <p>
                Fee: ${r.event.fee}
              </p>
            )}

            {/* PAY BUTTON */}
            {r.status === "PENDING" &&
              r.event.fee &&
              (!r.payment ||
                r.payment.length === 0) && (
                <button
                  onClick={() =>
                    handlePayment(
                      r.id,
                      r.event.fee
                    )
                  }
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Pay Now
                </button>
              )}

            {/* PAYMENT COMPLETED */}
            {r.payment?.[0]?.status ===
              "COMPLETED" && (
                <div className="mt-3 text-green-600 font-medium">
                  ✅ Payment Completed
                </div>
              )}
          </div>
        ))
      )}
    </div>
  );
}