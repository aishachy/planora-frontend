/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

  const [pending, setPending] = useState<
    any[]
  >([]);

  const [approved, setApproved] =
    useState<any[]>([]);

  const [blocked, setBlocked] = useState<
    any[]
  >([]);

  // LOAD DATA
  const loadData = async () => {
    try {
      const pendingData =
        await getEventRegistrations(
          eventId,
          "PENDING"
        );

      const approvedData =
        await getEventRegistrations(
          eventId,
          "APPROVED"
        );

      const blockedData =
        await getEventRegistrations(
          eventId,
          "BLOCKED"
        );

      setPending(
        pendingData.data || []
      );

      setApproved(
        approvedData.data || []
      );

      setBlocked(
        blockedData.data || []
      );

    } catch (error) {
      console.log(error);
    }
  };

  // FIRST LOAD
  useEffect(() => {
    if (eventId) {
      (async () => {
        await loadData();
      })();
    }
  }, [eventId]);

  // APPROVE
  const handleApprove = async (
    id: string
  ) => {
    await approveRegistration(id);

    alert("Approved");

    loadData();
  };

  // REJECT
  const handleReject = async (
    id: string
  ) => {
    await rejectRegistration(id);

    alert("Rejected");

    loadData();
  };

  // BAN
  const handleBan = async (
    userId: string
  ) => {
    await banParticipant(
      userId,
      eventId
    );

    alert("User banned");

    loadData();
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold">
        Manage Event
      </h1>
      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded shadow">
          <h3>Total Pending</h3>
          <p className="text-2xl font-bold">
            {pending.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Total Approved</h3>
          <p className="text-2xl font-bold">
            {approved.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Total Blocked</h3>
          <p className="text-2xl font-bold">
            {blocked.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Revenue</h3>
          <p className="text-2xl font-bold">
            $
            {approved.reduce(
              (sum, r) =>
                sum +
                (r.payment?.[0]?.amount || 0),
              0
            )}
          </p>
        </div>

      </div>

      {/* INVITE USERS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Invite Users
        </h2>

        <InviteUserList
          eventId={eventId}
        />
      </div>

      {/* PENDING */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
        <h3 className="font-semibold text-blue-700">
          Approval Queue
        </h3>

        <p className="text-sm text-gray-700 mt-1">
          Users who requested access or completed payment
          will appear here. Review their payment and approve
          or reject participation.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Pending Requests
        </h2>
        <div>

          <h2 className="text-xl font-semibold mb-4">
            Paid Registrations
          </h2>

          {pending
            .filter(
              (r) =>
                r.payment?.length > 0
            )
            .map((r) => (
              <div
                key={r.id}
                className="border p-4 rounded mb-3"
              >
                <p>
                  {r.user?.name}
                </p>

                <p>
                  ${r.payment[0].amount}
                </p>

                <p>
                  {r.payment[0].status}
                </p>
              </div>
            ))}
        </div>

        {pending.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          pending.map((r) => (
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

                {r.payment?.length > 0 && (
                  <div className="mt-2 text-sm">
                    <p>
                      Payment:
                      <span className="font-medium text-green-600">
                        {" "}
                        {r.payment[0].status || "N/A"}
                      </span>
                    </p>

                    <p>
                      Amount: $
                      {r.payment[0].amount}
                    </p>

                    <p>
                      Transaction:
                      {r.payment[0].transactionId}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">

                {r.payment?.length > 0 && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                    Paid
                  </span>
                )}
                <span
                  className="
    bg-yellow-100
    text-yellow-700
    px-2
    py-1
    rounded
    text-xs
  "
                >
                  Pending Approval
                </span>
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
                  handleBan(
                    r.user.id
                  )
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