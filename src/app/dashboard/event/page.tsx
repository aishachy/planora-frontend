/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export default function MyEventsPage() {
  const [events, setEvents] = useState<
    any[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/api/event/myEvent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log(
          "MY EVENTS:",
          data
        );

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
      <div className="p-6">
        Loading your events...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          My Events
        </h1>

        <Link
          href="/dashboard/event/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create Event
        </Link>
      </div>

      {/* NO EVENTS */}
      {events.length === 0 && (
        <p>
          No events found. Create your
          first event.
        </p>
      )}

      {/* EVENTS */}
      <div className="space-y-4">

        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border rounded p-4 flex justify-between items-center"
          >

            {/* LEFT */}
            <div>
              <h2 className="text-xl font-semibold">
                {event.title}
              </h2>

              <p className="text-sm text-gray-500">
                {event.date} •{" "}
                {event.venue}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex gap-3">

              {/* VIEW EVENT */}
              <Link
                href={`/event/${event.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                View
              </Link>

              {/* MANAGE EVENT */}
              <Link
                href={`/dashboard/event/${event.id}/manage`}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Manage
              </Link>

              {/* EDIT EVENT */}
              <Link
                href={`/dashboard/event/edit/${event.id}`}
                className="bg-green-500 text-white px-4 py-2 rounded"
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