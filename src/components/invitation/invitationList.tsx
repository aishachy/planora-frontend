/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { getMyInvitations } from "../../app/services/invitationService";
import InvitationCard from "./invitationCard";

export default function InvitationList() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ stable function (fixes React warning)
  const load = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await getMyInvitations(token);
      console.log("INVITATIONS:", res);

      setInvitations(res.data || []);
    } catch (err) {
      console.error("Failed to load invitations", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        My Invitations
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : invitations.length === 0 ? (
        <p>No invitations</p>
      ) : (
        invitations.map((inv) => (
          <InvitationCard
            key={inv.id}
            inv={inv}
            refresh={load} //  now stable function
          />
        ))
      )}
    </div>
  );
}