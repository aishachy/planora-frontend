/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getMyInvitations } from "../../services/invitationService";

export default function InvitationsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setData([]);
          return;
        }
        const res = await getMyInvitations(token);
        setData(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invitations</h1>

      {data.length === 0 ? (
        <p className="text-gray-500">No invitations found</p>
      ) : (
        <div className="space-y-3">
          {data.map((inv: any) => (
            <div key={inv.id} className="p-4 bg-white rounded shadow">
              <h2 className="font-semibold">{inv.eventTitle}</h2>
              <p className="text-sm text-gray-600">
                Status: {inv.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}