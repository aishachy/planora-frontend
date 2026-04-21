"use client";

import { useEffect, useState } from "react";
import {
  getEventRegistrations,
  approveRegistration,
  rejectRegistration,
  banParticipant,
} from "../../app/services/registrationService";

export const EventOwnerPanel = ({ eventId }: { eventId: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const data = await getEventRegistrations(eventId);
    setRegistrations(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    await approveRegistration(id);
    fetchData();
  };

  const handleReject = async (id: string) => {
    await rejectRegistration(id);
    fetchData();
  };

  const handleBan = async (userId: string) => {
    await banParticipant(userId, eventId);
    fetchData();
  };

  if (loading) return <p>Loading...</p>;

  const pending = registrations.filter(r => r.status === "PENDING");
  const approved = registrations.filter(r => r.status === "APPROVED");

  return (
    <div className="space-y-8">

      {/* PENDING REQUESTS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Pending Requests</h2>

        {pending.length === 0 && <p>No pending requests</p>}

        {pending.map((r) => (
          <div key={r.id} className="flex justify-between items-center border p-3 rounded mb-2">
            <div>
              <p className="font-medium">{r.user.name}</p>
              <p className="text-sm text-gray-500">{r.user.email}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(r.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(r.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* APPROVED USERS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Participants</h2>

        {approved.map((r) => (
          <div key={r.id} className="flex justify-between items-center border p-3 rounded mb-2">
            <div>
              <p className="font-medium">{r.user.name}</p>
              <p className="text-sm text-gray-500">{r.user.email}</p>
            </div>

            <button
              onClick={() => handleBan(r.userId)}
              className="bg-black text-white px-3 py-1 rounded"
            >
              Ban
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};