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
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Pending Requests
        </h2>

        {pending.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          pending.map((r) => (
            <div
              key={r.id}
              className="border p-4 rounded mb-3 flex justify-between"
            >
              <div>
                <p>{r.user?.name}</p>
                <p>{r.user?.email}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleApprove(
                      r.id
                    )
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleReject(
                      r.id
                    )
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