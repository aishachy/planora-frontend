/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  acceptInvitation,
  rejectInvitation,
  payAndAcceptInvitation,
} from "../../app/services/invitationService";

export default function InvitationCard({
  inv,
  refresh,
}: any) {

  const token =
    localStorage.getItem("token");

  const accept = async () => {
    try {
      await acceptInvitation(
        inv.id,
        token!
      );

      refresh();

    } catch (error: any) {
      alert(error.message);
    }
  };

  const reject = async () => {
    try {
      await rejectInvitation(
        inv.id,
        token!
      );

      refresh();

    } catch (error: any) {
      alert(error.message);
    }
  };

  const payAndAccept =
    async () => {
      try {
        await payAndAcceptInvitation(
          inv.id,
          token!
        );

        refresh();

      } catch (error: any) {
        alert(error.message);
      }
    };
  console.log("CARD DATA:", inv);
  return (
    <div className="border p-4 rounded bg-white">

      {/* EVENT TITLE */}
      <h2 className="text-xl font-bold">
        {inv.event?.title}
      </h2>

      {/* EVENT DETAILS */}
      <div className="mt-2 text-sm text-gray-600 space-y-1">

        <p>
          Date: {inv.event?.date}
        </p>

        <p>
          Venue: {inv.event?.venue}
        </p>

        <p>
          Type:{" "}
          {inv.event?.isPaid
            ? "Paid"
            : "Free"}
        </p>

        {inv.event?.isPaid && (
          <p>
            Fee: ৳{inv.event?.fee}
          </p>
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
              onClick={accept}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Accept
            </button>
          )}

          {inv.event?.isPaid && (
            <button
              onClick={payAndAccept}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Pay & Accept
            </button>
          )}

          <button
            onClick={reject}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reject
          </button>

        </div>
      )}

    </div>
  );
}