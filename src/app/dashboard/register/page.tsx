/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getMyRegistrations } from "../../services/registrationService";
import { createCheckoutSession } from "app/services/paymentService";

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD DATA
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getMyRegistrations();
      setRegistrations(result.data || []);
    } catch (err) {
      console.error("Failed to load registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // =========================
  // PAYMENT
  // =========================
  const handlePayment = async (registrationId: string, amount?: number) => {
    try {
      if (!amount || amount <= 0) return alert("Invalid payment amount");

      const res = await createCheckoutSession(registrationId, amount);

      if (res?.url) {
        window.location.assign(res.url);
      }
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your registrations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            My Registrations
          </h1>
          <p className="text-gray-500">
            Track your events, payments, and status in one place
          </p>
        </div>

        {/* EMPTY */}
        {registrations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow">
            <p className="text-gray-500">No registrations found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((r) => {
              const payment = Array.isArray(r.payment)
                ? r.payment[0]
                : r.payment;

              const isPaidEvent =
                r.event?.isPaid || (r.event?.fee && r.event.fee > 0);

              const isCompleted = payment?.status === "COMPLETED";
              const isPending =
                isPaidEvent && (!payment || payment?.status === "PENDING");

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl shadow-md border p-5 hover:shadow-lg transition"
                >
                  {/* TOP SECTION */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">
                        {r.event.title}
                      </h2>

                      <p className="text-sm text-gray-500">
                        📅{" "}
                        {new Date(r.event.date).toLocaleDateString()} • 📍{" "}
                        {r.event.venue}
                      </p>
                    </div>

                    {/* STATUS BADGE */}
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        r.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : r.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  {/* PAYMENT INFO */}
                  <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-gray-500">Event Type</p>
                      <p className="font-medium">
                        {isPaidEvent ? "Paid Event" : "Free Event"}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-gray-500">Fee</p>
                      <p className="font-medium">
                        {isPaidEvent ? `৳${r.event.fee}` : "Free"}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-gray-500">Payment</p>
                      <p
                        className={`font-medium ${
                          payment?.status === "COMPLETED"
                            ? "text-green-600"
                            : payment?.status === "FAILED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {payment?.status || "NOT INITIATED"}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex justify-between items-center">
                    {isCompleted ? (
                      <div className="text-green-600 font-medium">
                        ✅ Payment Completed
                      </div>
                    ) : isPending ? (
                      <button
                        onClick={() =>
                          handlePayment(r.id, r.event.fee ?? 0)
                        }
                        className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <div className="text-gray-400 text-sm">
                        No payment required
                      </div>
                    )}

                    <button className="text-sm text-blue-600 hover:underline">
                      View Event →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}