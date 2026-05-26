/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { getAllUsers } from "../../app/services/userService";

import InviteUserCard from "../invitation/inviteUserCard";

export default function InviteUserList({
  eventId,
}: {
  eventId: string;
}) {
  const [users, setUsers] = useState<any[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) return;

        const result =
          await getAllUsers(token);

        setUsers(result.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Invite Users
      </h2>

      {users.map((user) => (
        <InviteUserCard
          key={user.id}
          user={user}
          eventId={eventId}
        />
      ))}
    </div>
  );
}