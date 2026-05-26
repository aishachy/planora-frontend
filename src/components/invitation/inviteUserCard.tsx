/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { sendInvitation } from "../../app/services/invitationService";

export default function InviteUserCard({
  user,
  eventId,
}: any) {
  const [loading, setLoading] =
    useState(false);

  const invite = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      await sendInvitation(
        eventId,
        user.id,
        token
      );

      alert("Invitation sent");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-3 rounded flex items-center justify-between">
      <div>
        <h3 className="font-semibold">
          {user.name}
        </h3>

        <p className="text-sm text-gray-500">
          {user.email}
        </p>
      </div>

      <button
        onClick={invite}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading
          ? "Sending..."
          : "Invite"}
      </button>
    </div>
  );
}