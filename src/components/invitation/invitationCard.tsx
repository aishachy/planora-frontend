"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import {
  acceptInvitation,
  rejectInvitation,
  approvePaymentInvitation,
} from "../../app/services/invitationService";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function InvitationCard({ inv, refresh }: any) {
  const [loading, setLoading] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // ======================
  // ACTIONS
  // ======================
  const accept = async () => {
    try {
      setLoading("accept");
      await acceptInvitation(inv.id, token!);
      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  };

  const reject = async () => {
    try {
      setLoading("reject");
      await rejectInvitation(inv.id, token!);
      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  };

  const approvePayment = async () => {
    try {
      setLoading("approve");
      await approvePaymentInvitation(inv.id, token!);
      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  };

  const handlePay = async () => {
    try {
      setLoading("pay");

      const registrationId = inv.registration?.id;
      const amount = inv.event?.fee;

      if (!registrationId || !amount) {
        alert("Missing payment data");
        return;
      }

      const res = await fetch(
        `${API}/api/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId,
            amount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Payment failed");

      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setLoading(null);
    }
  };

  // ======================
  // STATUS BADGE
  // ======================
  const badge = (text: string, color: string) => (
    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );

  return (
    <div className="border rounded-2xl bg-white shadow-sm hover:shadow-md transition p-5 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {inv.event?.title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            📅 {inv.event?.date} • 📍 {inv.event?.venue}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          {inv.event?.isPaid
            ? badge("Paid Event", "bg-yellow-100 text-yellow-700")
            : badge("Free Event", "bg-green-100 text-green-700")}

          {badge(inv.status, "bg-gray-100 text-gray-700")}
        </div>
      </div>

      {/* USER INFO */}
      <div className="border-t pt-3 space-y-1 text-sm text-gray-600">
        <p className="font-medium text-gray-900">
          {inv.user?.name ?? "Unknown User"}
        </p>
        <p>{inv.user?.email ?? "N/A"}</p>
        <p className="text-xs text-gray-500">
          Invited by: {inv.inviter?.name ?? "Unknown"}
        </p>
      </div>

      {/* PAYMENT INFO */}
      {inv.event?.isPaid && (
        <div className="text-sm text-gray-600 space-y-1">
          <p>Fee: <span className="font-semibold">৳{inv.event?.fee}</span></p>
          <p>Status: {inv.registration?.status}</p>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-2 pt-2">

        {/* FREE EVENT */}
        {inv.status === "PENDING" && !inv.event?.isPaid && (
          <>
            <button
              onClick={accept}
              disabled={loading !== null}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm
                         hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading === "accept" ? "Accepting..." : "Accept"}
            </button>

            <button
              onClick={reject}
              disabled={loading !== null}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm
                         hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading === "reject" ? "Rejecting..." : "Reject"}
            </button>
          </>
        )}

        {/* PAYMENT */}
        {inv.event?.isPaid && inv.registration?.status === "PENDING" && (
          <button
            onClick={handlePay}
            disabled={loading !== null}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm
                       hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading === "pay" ? "Redirecting..." : "Pay Now"}
          </button>
        )}

        {/* ORGANIZER APPROVAL */}
        {inv.registration?.status === "APPROVED" && (
          <button
            onClick={approvePayment}
            disabled={loading !== null}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm
                       hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading === "approve" ? "Processing..." : "Approve Payment"}
          </button>
        )}

      </div>
    </div>
  );
}