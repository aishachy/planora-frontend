"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleAction = async (action: () => Promise<any>) => {
    try {
      setLoading(true);
      await action();
      await refresh(); // 🔥 instantly refresh list
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-white">
      {/* EVENT TITLE */}
      <h2 className="text-xl font-bold">
        {inv.event?.title}
      </h2>

      {/* DETAILS */}
      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <p>Date: {inv.event?.date}</p>
        <p>Venue: {inv.event?.venue}</p>
        <p>
          Type: {inv.event?.isPaid ? "Paid" : "Free"}
        </p>

        {inv.event?.isPaid && (
          <p>Fee: ৳{inv.event?.fee}</p>
        )}
      </div>

      {/* STATUS */}
      <p className="mt-3 font-semibold">
        Status: {inv.status}
      </p>

      {/* BUTTONS */}
      {inv.status === "PENDING" && (
        <div className="flex gap-2 mt-4">
          {!inv.event?.isPaid && (
            <button
              disabled={loading}
              onClick={() =>
                handleAction(() =>
                  acceptInvitation(inv.id, token!)
                )
              }
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Accept
            </button>
          )}

          {inv.event?.isPaid && (
            <button
              disabled={loading}
              onClick={() =>
                handleAction(() =>
                  payAndAcceptInvitation(inv.id, token!)
                )
              }
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Pay & Accept
            </button>
          )}

          <button
            disabled={loading}
            onClick={() =>
              handleAction(() =>
                rejectInvitation(inv.id, token!)
              )
            }
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}