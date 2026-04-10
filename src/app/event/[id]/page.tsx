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
    name: string;
  };
  image?: string;
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/event/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data.data || data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) {
    return <div className="p-10">Loading...</div>;
  }

  // ✅ Dynamic button text logic
  const getButtonText = () => {
    if (event.isPublic && !event.isPaid) return "Join";
    if (event.isPublic && event.isPaid) return "Pay & Join";
    if (!event.isPublic && !event.isPaid) return "Request to Join";
    return "Pay & Request";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Banner */}
      <div className="h-87.5 bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
        {/* {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : ( */}
          <h1 className="text-white text-4xl font-bold">
            Event Image Here
          </h1>
        )
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 -mt-16 relative z-10">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">{event.title}</h1>

          {/* Badge */}
          <span className="bg-slate-100 px-4 py-2 rounded-full text-sm font-medium">
            {event.isPublic ? "Public" : "Private"} •{" "}
            {event.isPaid ? "Paid" : "Free"}
          </span>
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-6 text-slate-700 mb-8">
          <p>
            <span className="font-semibold">📅 Date:</span>{" "}
            {new Date(event.date).toLocaleDateString()}
          </p>

          <p>
            <span className="font-semibold">⏰ Time:</span>{" "}
            {event.time}
          </p>

          <p>
            <span className="font-semibold">📍 Venue:</span>{" "}
            {event.venue || "Online Event"}
          </p>

          {event.eventLink && (
            <p>
              <span className="font-semibold">🔗 Event Link:</span>{" "}
              <a
                href={event.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                Join Event
              </a>
            </p>
          )}

          <p>
            <span className="font-semibold">👤 Organizer:</span>{" "}
            {event.organizer?.name || "Unknown"}
          </p>

          <p>
            <span className="font-semibold">💳 Registration Fee:</span>{" "}
            {event.isPaid ? `$${event.fee}` : "Free"}
          </p>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">Description</h2>
          <p className="text-slate-600 leading-7">
            {event.description}
          </p>
        </div>

        {/* Dynamic Button */}
        <button className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition">
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}