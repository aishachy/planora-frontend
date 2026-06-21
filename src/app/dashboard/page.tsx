"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();

        const events = data?.data || data?.events || data || [];

        setEventsCount(Array.isArray(events) ? events.length : 0);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ======================
  // LOADING UI (PREMIUM)
  // ======================
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">

        <div className="h-8 w-48 bg-gray-200 rounded" />

        <div className="grid md:grid-cols-3 gap-4">

          <div className="h-28 bg-gray-200 rounded-xl" />
          <div className="h-28 bg-gray-200 rounded-xl" />
          <div className="h-28 bg-gray-200 rounded-xl" />

        </div>

      </div>
    );
  }

  // ======================
  // ERROR UI
  // ======================
  if (error) {
    return (
      <div className="p-6 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your events and activity
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-3 gap-5">

        {/* MY EVENTS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <p className="text-gray-500 text-sm">
            My Events
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {eventsCount}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Total events created by you
          </p>
        </div>

        {/* STATUS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <p className="text-gray-500 text-sm">
            Account Status
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 bg-green-500 rounded-full" />
            <p className="text-lg font-semibold text-gray-800">
              Active
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            Everything is running smoothly
          </p>
        </div>

        {/* QUICK ACTION */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <p className="text-gray-500 text-sm">
            Quick Action
          </p>

          <a
            href="/dashboard/event/create"
            className="inline-flex mt-3 items-center justify-center
                       px-4 py-2 rounded-lg bg-black text-white text-sm
                       hover:bg-gray-900 transition"
          >
            + Create Event
          </a>

          <p className="text-xs text-gray-400 mt-2">
            Start building a new event
          </p>
        </div>

      </div>
    </div>
  );
}