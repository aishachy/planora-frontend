

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/event/myEvent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setEvents(data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Events
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all your created events
          </p>
        </div>

        <Link
          href="/dashboard/event/create"
          className="inline-flex items-center justify-center bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition"
        >
          + Create Event
        </Link>
      </div>

      {/* EMPTY STATE */}
      {events.length === 0 && (
        <div className="text-center py-16 border rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            No events found
          </h2>
          <p className="text-gray-500 mt-2">
            Create your first event to get started
          </p>

          <Link
            href="/dashboard/event/create"
            className="inline-block mt-5 bg-black text-white px-5 py-2 rounded-lg"
          >
            Create Event
          </Link>
        </div>
      )}

      {/* EVENTS GRID */}
      <div className="grid gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            {/* LEFT */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {event.title}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                📅 {event.date} • 📍 {event.venue}
              </p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Link
                href={`/event/${event.id}`}
                className="px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              >
                View
              </Link>

              <Link
                href={`/dashboard/event/${event.id}/manage`}
                className="px-3 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-black transition"
              >
                Manage
              </Link>

              <Link
                href={`/dashboard/event/edit/${event.id}`}
                className="px-3 py-2 text-sm rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}