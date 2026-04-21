/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function DashboardPage() {
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/event/myEvent`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await res.json();

        console.log("API RESPONSE:", data);

        // ✅ handle ALL possible backend shapes
        const events =
          data?.data ||
          data?.events ||
          data ||
          [];

        setEventsCount(Array.isArray(events) ? events.length : 0);

      } catch (err: any) {
        console.log(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="p-6 bg-white border rounded-xl">
          <h2 className="text-gray-500">My Events</h2>
          <p className="text-3xl font-bold">{eventsCount}</p>
        </div>

        <div className="p-6 bg-white border rounded-xl">
          <h2 className="text-gray-500">Status</h2>
          <p className="text-xl">Active</p>
        </div>

        <div className="p-6 bg-white border rounded-xl">
          <h2 className="text-gray-500">Quick Action</h2>
          <a
            href="/dashboard/events/create"
            className="text-blue-600 underline"
          >
            + Create Event
          </a>
        </div>

      </div>
    </div>
  );
}