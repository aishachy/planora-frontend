"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getSentInvitations } from "../../../services/invitationService";

export default function SentInvitationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setData([]);
        return;
      }

      const res = await getSentInvitations(token);

      console.log("SENT INVITATIONS:", res);

      setData(res.data ?? res ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Sent Invitations
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">
          No sent invitations
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((inv: any) => (
            <div
              key={inv.id}
              className="p-4 border rounded bg-white"
            >
              {/* EVENT */}
              <p className="font-semibold">
                Event: {inv.event?.title}
              </p>

              {/* USER INFO */}
              <p className="text-sm text-gray-700">
                <b>User:</b> {inv.user?.name} (
                {inv.user?.email})
              </p>

              {/* STATUS */}
              <p className="mt-2">
                <b>Status:</b>{" "}
                <span
                  className={
                    inv.status === "ACCEPTED"
                      ? "text-green-600"
                      : inv.status === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {inv.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}