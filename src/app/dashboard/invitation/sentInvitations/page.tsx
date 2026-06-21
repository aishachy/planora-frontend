"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getSentInvitations } from "../../../services/invitationService";

const API = process.env.NEXT_PUBLIC_API_URL;

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

      const res = await getSentInvitations(token, "");

      const invitations =
        res?.data?.data ||
        res?.data ||
        [];

      setData(invitations);
    } catch (err) {
      console.error("ERROR:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/api/invitation/${id}/approve-payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Payment approved");

      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Sent Invitations
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No sent invitations</p>
      ) : (
        <div className="space-y-3">
          {data.map((inv: any) => {

            // SAFE PAYMENT ACCESS (IMPORTANT FIX)
            const payment = inv.registration?.payment?.[0];

            return (
              <div
                key={inv.id}
                className="p-4 border rounded bg-white"
              >
                {/* EVENT */}
                <p className="font-semibold">
                  Event: {inv.event?.title}
                </p>

                {/* USER (recipient) */}
                <p className="text-sm text-gray-700">
                  <b>User:</b>{" "}
                  {inv.user?.name ?? "Unknown"} (
                  {inv.user?.email ?? "N/A"})
                </p>

                {/* INVITER (YOU) */}
                <p className="text-sm text-gray-500">
                  <b>Invited By:</b>{" "}
                  {inv.inviter?.name ?? "You"}
                </p>

                {/* INVITATION STATUS */}
                <p className="mt-2">
                  <b>Invitation Status:</b>{" "}
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

                {/* PAYMENT STATUS (NEW CORRECT LOGIC) */}
                {payment && (
                  <p className="mt-1">
                    <b>Payment:</b>{" "}
                    <span
                      className={
                        payment.status === "COMPLETED"
                          ? "text-green-600"
                          : payment.status === "FAILED"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {payment.status}
                    </span>
                  </p>
                )}

                {/* APPROVE PAYMENT BUTTON (ONLY IF REAL PAYMENT PENDING) */}
                {payment?.status === "PENDING" && (
                  <button
                    onClick={() => handleApprove(inv.id)}
                    className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve Payment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}