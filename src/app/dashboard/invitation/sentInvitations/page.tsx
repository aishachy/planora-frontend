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

      const invitations = res?.data?.data || res?.data || [];
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

      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const badge = (text: string, color: string) => (
    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Sent Invitations
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Track all invitations you have sent
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-500">Loading invitations...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-gray-50">
          <p className="text-gray-600">No sent invitations</p>
        </div>
      ) : (
        <div className="space-y-4">

          {data.map((inv: any) => {
            const payment = inv.registration?.payment?.[0];

            return (
              <div
                key={inv.id}
                className="border rounded-2xl bg-white shadow-sm hover:shadow-md transition p-5 space-y-3"
              >

                {/* HEADER ROW */}
                <div className="flex justify-between items-start gap-3">

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {inv.event?.title}
                    </h2>

                    <p className="text-sm text-gray-500">
                      📅 {inv.event?.date} • 📍 {inv.event?.venue}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    {badge(
                      inv.status,
                      inv.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : inv.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    )}

                    {inv.event?.isPaid
                      ? badge("Paid", "bg-yellow-100 text-yellow-700")
                      : badge("Free", "bg-green-100 text-green-700")}
                  </div>
                </div>

                {/* USER INFO */}
                <div className="text-sm text-gray-600 space-y-1 border-t pt-3">
                  <p className="font-medium text-gray-900">
                    {inv.user?.name ?? "Unknown User"}
                  </p>
                  <p>{inv.user?.email ?? "N/A"}</p>
                  <p className="text-xs text-gray-500">
                    Invited by: {inv.inviter?.name ?? "You"}
                  </p>
                </div>

                {/* PAYMENT */}
                {payment && (
                  <div className="text-sm space-y-1">
                    <p>
                      Payment:{" "}
                      {badge(
                        payment.status,
                        payment.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      )}
                    </p>

                    {payment.amount && (
                      <p className="text-gray-600">
                        Amount: <b>৳{payment.amount}</b>
                      </p>
                    )}
                  </div>
                )}

                {/* ACTIONS */}
                {payment?.status === "PENDING" && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleApprove(inv.id)}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm
                                 hover:bg-green-700 transition"
                    >
                      Approve Payment
                    </button>
                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}