/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Event {
  id: string;
  title: string;
  description: string;
  venue?: string;
  eventLink?: string;
  date: string;
  time: string;
  isPublic: boolean;
  isPaid: boolean;
  fee?: number;
  organizer?: {
    id?: string;
    name: string;
  };
  image?: string;
}

export default function EventDetailsPage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null); // (if you have auth)

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/event/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data.data || data))
      .catch((err) => console.error(err));
  }, [id]);

  // OPTIONAL: fetch current user (if you have /me endpoint)
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data.data));
  }, []);

  if (!event) {
    return <div className="p-10">Loading...</div>;
  }

  // 👑 OWNER CHECK
  const isOwner = user?.id === event?.organizer?.id;

  const getButtonText = () => {
    if (event.isPublic && !event.isPaid) return "Join";
    if (event.isPublic && event.isPaid) return "Pay & Join";
    if (!event.isPublic && !event.isPaid) return "Request to Join";
    return "Pay & Request";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Banner */}
      <div className="h-96 bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <h1 className="text-white text-4xl font-bold">
            Event Image Here
          </h1>
        )}
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 -mt-16 relative z-10">

        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">{event.title}</h1>

          <span className="bg-slate-100 px-4 py-2 rounded-full text-sm font-medium">
            {event.isPublic ? "Public" : "Private"} •{" "}
            {event.isPaid ? "Paid" : "Free"}
          </span>
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-6 text-slate-700 mb-8">
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>⏰ {event.time}</p>
          <p>📍 {event.venue || "Online Event"}</p>

          {event.eventLink && (
            <p>
              🔗{" "}
              <a
                href={event.eventLink}
                target="_blank"
                className="text-indigo-600 underline"
              >
                Join Event
              </a>
            </p>
          )}

          <p>👤 {event.organizer?.name}</p>
          <p>
            💳 {event.isPaid ? `$${event.fee}` : "Free"}
          </p>
        </div>

        {/* Description */}
        <p className="text-slate-600 mb-6">{event.description}</p>

        {/* USER BUTTON */}
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl">
          {getButtonText()}
        </button>

        {/* 👑 OWNER CONTROLS (NEW) */}
        {isOwner && (
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Manage Event
            </button>

            <button className="px-4 py-2 bg-yellow-500 text-white rounded">
              Edit
            </button>

            <button className="px-4 py-2 bg-red-600 text-white rounded">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}