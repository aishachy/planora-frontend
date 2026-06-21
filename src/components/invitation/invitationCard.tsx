/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  acceptInvitation,
  rejectInvitation,
  approvePaymentInvitation,
} from "../../app/services/invitationService";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function InvitationCard({ inv, refresh }: any) {
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // ======================
  // ACCEPT INVITATION
  // ======================
  const accept = async () => {
    try {
      await acceptInvitation(inv.id, token!);
      refresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // ======================
  // REJECT INVITATION
  // ======================
  const reject = async () => {
    try {
      await rejectInvitation(inv.id, token!);
      refresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // ======================
  // APPROVE PAYMENT
  // ======================
  const approvePayment = async () => {
    try {
      await approvePaymentInvitation(inv.id, token!);
      refresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // ======================
  // HANDLE PAYMENT
  // ======================
  const handlePay = async () => {
    try {
      setLoading(true);

      const registrationId = inv.registration?.id;

      const amount = inv.event?.fee;

      if (!registrationId) {
        alert("Missing registration ID");
        return;
      }

      if (!amount || amount <= 0) {
        alert("Invalid amount");
        return;
      }

      const res = await fetch(
        `${API}/api/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registrationId,
            amount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create payment");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-white shadow-sm">
      {/* EVENT */}
      <h2 className="text-xl font-bold">{inv.event?.title}</h2>

      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <p>Date: {inv.event?.date}</p>
        <p>Venue: {inv.event?.venue}</p>
        <p>Type: {inv.event?.isPaid ? "Paid" : "Free"}</p>

        {inv.event?.isPaid && <p>Fee: ৳{inv.event?.fee}</p>}
      </div>

      {/* USER */}
      <p className="mt-3 font-semibold">
        User: {inv.user?.name ?? "Unknown"} ({inv.user?.email ?? "N/A"})
      </p>

      {/* INVITER */}
      <p className="text-sm text-gray-500">
        Invited By: {inv.inviter?.name ?? "Unknown"}
      </p>

      {/* STATUS */}
      <p className="text-sm text-gray-500">
        Invitation Status: {inv.status}
      </p>

      {inv.registration?.status && (
        <p className="text-sm text-gray-500">
          Registration Status: {inv.registration.status}
        </p>
      )}

      {/* FREE EVENT ACTIONS */}
      {inv.status === "PENDING" && !inv.event?.isPaid && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={accept}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Accept
          </button>

          <button
            onClick={reject}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      )}

      {/* PAID EVENT - PAYMENT */}
      {inv.event?.isPaid && inv.registration?.status === "PENDING" && (
        <button
          onClick={handlePay}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      )}

      {/* ORGANIZER APPROVAL */}
      {inv.registration?.status === "APPROVED" && (
        <button
          onClick={approvePayment}
          className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
        >
          Approve Payment
        </button>
      )}
    </div>
  );
}