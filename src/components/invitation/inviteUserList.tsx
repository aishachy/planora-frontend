/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { getAllUsers } from "../../app/services/userService";
import {
  sendInvitation,
  getSentInvitations,
} from "../../app/services/invitationService";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function InviteUserList({
  eventId,
}: {
  eventId: string;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
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
        if (!token) return;

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
        const res = await fetch(
          `${API}/events/${eventId}/participation-status`
        );

        const data = await res.json();
        setParticipationStatus(data.data);
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
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      await sendInvitation(eventId, userId, token);

      alert("Invitation sent");

      setInvitedUsers((prev) => [...prev, userId]);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
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
  // BUTTON DISABLE LOGIC
  // =========================
  const isInviteDisabled = (userId: string) => {
    if (invitedUsers.includes(userId)) return true;

    // optional business rule
    if (participationStatus === "FREE_PUBLIC") return false;

    return false;
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
                disabled={disabled || loading}
                className={`px-4 py-2 rounded text-white ${
                  disabled || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black"
                }`}
              >
                {invitedUsers.includes(user.id)
                  ? "Invited"
                  : loading
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