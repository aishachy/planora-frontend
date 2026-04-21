/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:5000";

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/event/myEvent`, {
          credentials: "include",
        });

        const data = await res.json();

        console.log("MY EVENTS:", data);

        const list = data?.data || data || [];

        setEvents(Array.isArray(list) ? list : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading your events...</div>;
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>

        <Link
          href="/dashboard/event/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create Event
        </Link>
      </div>

      {/* EVENTS LIST */}
      <div className="space-y-4">

        {events.length === 0 && (
          <p>No events found. Create your first event.</p>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 bg-white border rounded flex justify-between items-center"
          >

            <div>
              <h2 className="font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-500">
                {event.date} • {event.venue}
              </p>
            </div>

            <div className="flex gap-3">

              <Link
                href={`/dashboard/event/${event.id}`}
                className="text-blue-600"
              >
                Manage
              </Link>

              <Link
                href={`/dashboard/event/edit/${event.id}`}
                className="text-green-600"
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