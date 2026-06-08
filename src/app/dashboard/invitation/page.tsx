"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import { getMyInvitations } from "../../services/invitationService";
import InvitationCard from "../../../components/invitation/invitationCard";

export default function InvitationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        setData([]);
        return;
      }

      const res = await getMyInvitations(token);

      // safer fallback handling
      setData(res?.data ?? []);
    } catch (err) {
      console.error("Failed to load invitations:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Invitations
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">
          No invitations found
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((inv: any) => (
            <InvitationCard
              key={inv.id}
              inv={inv}
              refresh={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}