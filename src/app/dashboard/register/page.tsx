"use client";

import { useEffect, useState } from "react";
import { getMyRegistrations } from "../../services/registrationService";
import { createCheckoutSession } from "app/services/paymentService";

export default function MyRegistrationsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [registrations, setRegistrations] = useState<any[]>([]);

  // =========================
  // LOAD DATA
  // =========================
  const loadData = async () => {
    try {
      const result = await getMyRegistrations();
      setRegistrations(result.data || []);
    } catch (err) {
      console.error("Failed to load registrations:", err);
    }
  };

  // =========================
  // HANDLE PAYMENT
  // =========================
  const handlePayment = async (registrationId: string, amount?: number) => {
    try {
      if (!amount || amount <= 0) {
        alert("Invalid payment amount");
        return;
      }

      const res = await createCheckoutSession(registrationId, amount);

      if (res?.url) {
        window.location.assign(res.url);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to start payment");
    }
  };

  // =========================
  // INITIAL + TAB RETURN REFRESH
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMyRegistrations();
        setRegistrations(result.data || []);
      } catch (err) {
        console.error("Failed to load registrations:", err);
      }
    };

    // initial fetch (async so setState isn't called synchronously in effect body)
    fetchData();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // call async fetch without causing sync setState
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Registrations</h1>

      {registrations.length === 0 ? (
        <p>No registrations found.</p>
      ) : (
        registrations.map((r) => {
          const payment = Array.isArray(r.payment)
            ? r.payment[0]
            : r.payment;

          const isPaidEvent =
            r.event?.isPaid || (r.event?.fee && r.event.fee > 0);

          const isPaymentCompleted = payment?.status === "COMPLETED";

          const isPaymentPending =
            isPaidEvent && (!payment || payment.status === "PENDING");
          console.log("REGISTRATION:", r);
          console.log("PAYMENT:", payment);
          return (
            <div key={r.id} className="border rounded p-4 mb-3">
              {/* EVENT */}
              <h2 className="font-semibold">{r.event.title}</h2>

              <p>Date: {new Date(r.event.date).toLocaleDateString()}</p>
              <p>Venue: {r.event.venue}</p>

              {/* STATUS */}
              <p>
                Status:
                <span className="font-bold ml-2">{r.status}</span>
              </p>

              {/* FEE */}
              {isPaidEvent && (
                <p>Fee: ${r.event.fee ?? 0}</p>
              )}

              {/* PAYMENT STATUS */}
              {isPaidEvent && payment && (
                <p className="mt-2">
                  Payment:
                  <span
                    className={
                      payment.status === "COMPLETED"
                        ? "text-green-600 ml-2 font-medium"
                        : payment.status === "FAILED"
                          ? "text-red-600 ml-2 font-medium"
                          : "text-yellow-600 ml-2 font-medium"
                    }
                  >
                    {payment.status}
                  </span>
                </p>
              )}

              {/* SUCCESS MESSAGE */}
              {isPaymentCompleted && (
                <div className="mt-3 text-green-600 font-medium">
                  ✅ Payment Completed
                </div>
              )}

              {/* PAY BUTTON */}
              {isPaidEvent && isPaymentPending && (
                <button
                  onClick={() =>
                    handlePayment(r.id, r.event.fee ?? 0)
                  }
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Pay Now
                </button>
              )}

              {/* FREE EVENT */}
              {!isPaidEvent && (
                <div className="mt-2 text-green-600 font-medium">
                  Free Event — No Payment Required
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}