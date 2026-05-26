/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import {
  acceptInvitation,
  rejectInvitation,
  payAndAcceptInvitation,
} from "../../app/services/invitationService";

export default function InvitationCard({
  inv,
  refresh,
}: any) {
  const [loading, setLoading] =
    useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // ACCEPT
  const accept = async () => {
    try {
      setLoading(true);

      await acceptInvitation(
        inv.id,
        token!
      );

      alert("Invitation accepted");

      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // REJECT
  const reject = async () => {
    try {
      setLoading(true);

      await rejectInvitation(
        inv.id,
        token!
      );

      alert("Invitation rejected");

      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // PAY & ACCEPT
  const payAndAccept = async () => {
    try {
      setLoading(true);

      await payAndAcceptInvitation(
        inv.id,
        token!
      );

      alert(
        "Payment successful & invitation accepted"
      );

      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="text-lg font-bold">
        {inv.event.title}
      </h3>

      <p className="mt-1">
        Status:
        <span className="font-semibold ml-1">
          {inv.status}
        </span>
      </p>

      <p className="mt-1">
        Event Type:
        {inv.event.isPaid
          ? " Paid"
          : " Free"}
      </p>

      {inv.event.isPaid && (
        <p className="mt-1">
          Fee: ৳{inv.event.fee}
        </p>
      )}

      {inv.status === "PENDING" && (
        <div className="flex gap-2 mt-4">
          
          {/* FREE EVENT */}
          {!inv.event.isPaid && (
            <button
              onClick={accept}
              disabled={loading}
              className="bg-green-500 text-white px-3 py-2 rounded"
            >
              {loading
                ? "Processing..."
                : "Accept"}
            </button>
          )}

          {/* REJECT */}
          <button
            onClick={reject}
            disabled={loading}
            className="bg-red-500 text-white px-3 py-2 rounded"
          >
            {loading
              ? "Processing..."
              : "Reject"}
          </button>

          {/* PAID EVENT */}
          {inv.event.isPaid && (
            <button
              onClick={payAndAccept}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              {loading
                ? "Processing..."
                : "Pay & Accept"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}