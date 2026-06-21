"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getEventRegistrations,
  approveRegistration,
  rejectRegistration,
  banParticipant,
} from "../../../../services/registrationService";

import InviteUserList from "../../../../../components/invitation/inviteUserList";

export default function ManageEventPage() {
  const params = useParams();

  const eventId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [blocked, setBlocked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        pendingData,
        approvedData,
        blockedData,
      ] = await Promise.all([
        getEventRegistrations(eventId, "PENDING"),
        getEventRegistrations(eventId, "APPROVED"),
        getEventRegistrations(eventId, "BLOCKED"),
      ]);

      setPending(pendingData?.data || []);
      setApproved(approvedData?.data || []);
      setBlocked(blockedData?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadData();
    }
  }, [eventId]);

  const handleApprove = async (id: string) => {
    try {
      await approveRegistration(id);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Approve failed");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRegistration(id);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Reject failed");
    }
  };

  const handleBan = async (userId: string) => {
    try {
      await banParticipant(userId, eventId);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Ban failed");
    }
  };

  const totalRevenue = approved.reduce(
    (sum, registration) =>
      sum +
      (registration.payment || []).reduce(
        (paymentSum: number, payment: any) =>
          paymentSum + (payment.amount || 0),
        0
      ),
    0
  );

  const paidPending = pending.filter((r) =>
    r.payment?.some(
      (p: any) => p.status === "COMPLETED"
    )
  );

  const freePending = pending.filter(
    (r) =>
      !r.payment ||
      r.payment.length === 0
  );

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold">
        Manage Event
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded shadow">
          <h3>Total Pending</h3>
          <p className="text-2xl font-bold">
            {pending.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Approved</h3>
          <p className="text-2xl font-bold">
            {approved.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Blocked</h3>
          <p className="text-2xl font-bold">
            {blocked.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Revenue</h3>
          <p className="text-2xl font-bold">
            ৳{totalRevenue}
          </p>
        </div>

      </div>

      {/* INVITE USERS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Invite Users
        </h2>

        <InviteUserList eventId={eventId} />
      </div>

      {/* PAID APPROVAL QUEUE */}
      <div>

        <h2 className="text-xl font-semibold mb-4">
          Paid Pending Approval
        </h2>

        {paidPending.length === 0 ? (
          <p>No paid approvals pending</p>
        ) : (
          paidPending.map((r) => (
            <div
              key={r.id}
              className="border p-4 rounded mb-3 flex justify-between"
            >
              <div>
                <p className="font-semibold">
                  {r.user?.name}
                </p>

                <p className="text-gray-600">
                  {r.user?.email}
                </p>

                <p className="mt-2">
                  Amount: ৳
                  {r.payment?.[0]?.amount}
                </p>

                <p>
                  Payment:
                  {" "}
                  {r.payment?.[0]?.status}
                </p>

                <p>
                  Transaction:
                  {" "}
                  {r.payment?.[0]?.transactionId}
                </p>
              </div>

              <div className="flex flex-col gap-2">

                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                  Waiting Organizer Approval
                </span>

                <button
                  onClick={() =>
                    handleApprove(r.id)
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleReject(r.id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* FREE PENDING */}
      <div>

        <h2 className="text-xl font-semibold mb-4">
          Free Event Requests
        </h2>

        {freePending.length === 0 ? (
          <p>No free requests pending</p>
        ) : (
          freePending.map((r) => (
            <div
              key={r.id}
              className="border p-4 rounded mb-3 flex justify-between"
            >
              <div>
                <p className="font-semibold">
                  {r.user?.name}
                </p>

                <p className="text-gray-600">
                  {r.user?.email}
                </p>
              </div>

              {r.status === "APPROVAL" && (
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
              )}
            </div>
          ))
        )}
      </div>

      {/* APPROVED */}
      <div>

        <h2 className="text-xl font-semibold mb-4">
          Participants
        </h2>

        {approved.length === 0 ? (
          <p>No participants</p>
        ) : (
          approved.map((r) => (
            <div
              key={r.id}
              className="border p-4 rounded mb-3 flex justify-between"
            >
              <div>
                <p>{r.user?.name}</p>
                <p>{r.user?.email}</p>
              </div>

              <button
                onClick={() =>
                  handleBan(r.user.id)
                }
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Ban
              </button>
            </div>
          ))
        )}
      </div>

      {/* BLOCKED */}
      <div>

        <h2 className="text-xl font-semibold mb-4">
          Blocked Users
        </h2>

        {blocked.length === 0 ? (
          <p>No blocked users</p>
        ) : (
          blocked.map((r) => (
            <div
              key={r.id}
              className="border p-4 rounded mb-3"
            >
              <p>{r.user?.name}</p>
              <p>{r.user?.email}</p>
            </div>
          ))
        )}

      </div>

    </div>
  );
}