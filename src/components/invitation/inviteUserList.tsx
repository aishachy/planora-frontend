/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { getAllUsers } from "../../app/services/userService";
import {
  sendInvitation,
  getSentInvitations,
} from "../../app/services/invitationService";

export default function InviteUserList({
  eventId,
}: {
  eventId: string;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [participationStatus, setParticipationStatus] =
    useState<string>("");

  // =========================
  // LOAD USERS
  // =========================
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const result = await getAllUsers(token);
        setUsers(result.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    loadUsers();
  }, []);

  // =========================
  // LOAD SENT INVITATIONS
  // =========================
  useEffect(() => {
    const loadInvited = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !eventId) return;

        const res = await getSentInvitations(token, eventId);

        const invitedIds =
          res?.data?.map((inv: any) => inv.user?.id) || [];

        setInvitedUsers(invitedIds);
      } catch (error) {
        console.log(error);
      }
    };

    loadInvited();
  }, [eventId]);

  // =========================
  // LOAD PARTICIPATION STATUS
  // =========================
  useEffect(() => {
    const loadStatus = async () => {
      try {
        if (!eventId) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/participation-status`
        );

        const data = await res.json();
        setParticipationStatus(data.data || "");
      } catch (err) {
        console.log(err);
      }
    };

    loadStatus();
  }, [eventId]);

  // =========================
  // INVITE USER
  // =========================
  const handleInvite = async (userId: string) => {
    try {
      setLoadingId(userId);

      const token = localStorage.getItem("token");
      if (!token) return;

      await sendInvitation(eventId, userId, token);

      setInvitedUsers((prev) => [...prev, userId]);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  // =========================
  // FILTER USERS
  // =========================
  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword)
    );
  });

  // =========================
  // BUTTON LOGIC
  // =========================
  const isInviteDisabled = (userId: string) => {
    return invitedUsers.includes(userId);
  };

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      {/* USERS */}
      {filteredUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        filteredUsers.map((user) => {
          const disabled = isInviteDisabled(user.id);
          const isLoading = loadingId === user.id;

          return (
            <div
              key={user.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => handleInvite(user.id)}
                disabled={disabled || isLoading}
                className={`px-4 py-2 rounded text-white transition ${
                  disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {invitedUsers.includes(user.id)
                  ? "Invited"
                  : isLoading
                  ? "Sending..."
                  : "Invite"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}