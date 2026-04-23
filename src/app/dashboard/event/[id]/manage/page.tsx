/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/event/[id]/manage/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getEventRegistrations,
  approveRegistration,
  rejectRegistration,
  banParticipant,
} from "../../../../services/registrationService";

export default function ManageEventPage() {
  const { id } = useParams();

  const eventId = Array.isArray(id) ? id[0] : id;

  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [blocked, setBlocked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (eid: string) => {
    try {
      setLoading(true);

      const [p, a, b] = await Promise.all([
        getEventRegistrations(eid, "PENDING"),
        getEventRegistrations(eid, "APPROVED"),
        getEventRegistrations(eid, "BLOCKED"),
      ]);

      setPending(p?.data || []);
      setApproved(a?.data || []);
      setBlocked(b?.data || []);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!eventId) return; // ✅ FIX: prevents undefined error
    fetchData(eventId);
  }, [eventId]);

  if (!eventId) {
    return <div className="p-6">Invalid Event ID</div>;
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manage Event</h1>

      {/* Pending */}
      <section>
        <h2 className="font-semibold mb-2">Pending</h2>
        {pending.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          pending.map((r) => (
            <div
              key={r.id}
              className="flex justify-between border p-3 rounded"
            >
              <span>{r.user?.name}</span>
              <div className="flex gap-2">
                <button
                  className="text-green-600"
                  onClick={() => approveRegistration(r.id)}
                >
                  Approve
                </button>
                <button
                  className="text-red-600"
                  onClick={() => rejectRegistration(r.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Approved */}
      <section>
        <h2 className="font-semibold mb-2">Participants</h2>
        {approved.length === 0 ? (
          <p>No participants yet</p>
        ) : (
          approved.map((r) => (
            <div
              key={r.id}
              className="flex justify-between border p-3 rounded"
            >
              <span>{r.user?.name}</span>
              <button
                className="text-red-600"
                onClick={() => banParticipant(r.user.id, eventId)}
              >
                Ban
              </button>
            </div>
          ))
        )}
      </section>

      {/* Blocked */}
      <section>
        <h2 className="font-semibold mb-2">Blocked</h2>
        {blocked.length === 0 ? (
          <p>No blocked users</p>
        ) : (
          blocked.map((r) => (
            <div key={r.id} className="border p-3 rounded">
              {r.user?.name}
            </div>
          ))
        )}
      </section>
    </div>
  );
}