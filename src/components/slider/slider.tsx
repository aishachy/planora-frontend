"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
  isPublic: boolean;
  id: string;
  title: string;
  date: string;
  isPaid: boolean;
  fee?: number;
  organizer?: {
    name: string;
  };
}

export default function UpcomingEventsSlider() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/event")
      .then((res) => res.json())
      .then((data) => {
        const publicEvents =
          data?.data?.filter((e: Event) => e.isPublic) || [];

        setEvents(publicEvents.slice(0, 9)); // limit to 9
      });
  }, []);

  return (
    <section className="bg-[#020817] py-16 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Upcoming Events
          </h2>
          <p className="text-gray-400">
            Discover what’s happening next and reserve your spot early.
          </p>
        </div>

        {/* SLIDER */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="min-w-70 max-w-70 rounded-2xl overflow-hidden bg-[#0b1220] border border-white/10 hover:-translate-y-1 hover:shadow-xl transition"
            >
              {/* GRADIENT HEADER */}
              <div className="relative h-32 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold">
                Event

                {/* FEE BADGE */}
                <span className="absolute top-3 right-3 text-xs bg-black/30 px-3 py-1 rounded-full">
                  {event.isPaid ? `$${event.fee}` : "Free"}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="font-semibold text-base mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <div className="text-xs text-gray-400 space-y-1 mb-4">
                  <p>
                    📅 {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p>
                    👤 {event.organizer?.name || "Unknown"}
                  </p>
                </div>

                <Link
                  href={`/event/${event.id}`}
                  className="flex items-center justify-center gap-2 bg-white text-black py-2 rounded-full text-sm hover:bg-gray-200 transition"
                >
                  View
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}