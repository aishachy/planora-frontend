"use client";

import {
  acceptInvitation,
  rejectInvitation,
  payAndAcceptInvitation,
} from "../../app/services/invitationService";

export default function InvitationCard({
  inv,
  refresh,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const token = localStorage.getItem("token");

  const accept = async () => {
    await acceptInvitation(inv.id, token!);
    refresh();
  };

  const reject = async () => {
    await rejectInvitation(inv.id, token!);
    refresh();
  };

  const payAndAccept = async () => {
    await payAndAcceptInvitation(inv.id, token!);
    refresh();
  };

  return (
    <div className="border p-3 rounded mb-3">
      <h3 className="font-bold">{inv.event.title}</h3>

      <p>Status: {inv.status}</p>

      {inv.status === "PENDING" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={accept}
            className="bg-green-500 text-white px-2 py-1"
          >
            Accept
          </button>

          <button
            onClick={reject}
            className="bg-red-500 text-white px-2 py-1"
          >
            Reject
          </button>

          {inv.event.isPaid && (
            <button
              onClick={payAndAccept}
              className="bg-blue-500 text-white px-2 py-1"
            >
              Pay & Accept
            </button>
          )}
        </div>
      )}
    </div>
  );
}