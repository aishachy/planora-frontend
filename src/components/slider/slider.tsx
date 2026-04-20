/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CalendarDays,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react";

export const Slider = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event`
        );

        const data = await res.json();

        const publicEvents =
          data?.data?.filter((e: any) => e.isPublic) || [];

        setEvents(publicEvents.slice(0, 9));
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
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
            Discover what’s happening next and reserve your spot.
          </p>
        </div>

        {/* MARQUEE WRAPPER */}
        <div className="overflow-hidden relative">
          <div className="flex gap-6 w-max animate-scroll">

            {[...events, ...events].map((event, i) => (
              <div
                key={i}
                className="w-[320px] shrink-0 rounded-3xl overflow-hidden bg-[#0f172a] border border-white/10"
              >

                {/* TOP */}
                <div className="relative h-44 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                  Add Event Image Later

                  <span className="absolute top-3 right-3 text-xs bg-black/30 px-3 py-1 rounded-full">
                    {event.isPaid ? `$${event.fee}` : "Free"}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-400 mb-6">

                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {event.organizer?.name || "Unknown"}
                    </div>

                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {event.venue}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/event/${event.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-gray-200 text-black py-3 rounded-full font-medium hover:bg-gray-300 transition"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* CSS ANIMATION */}
      <style jsx>{`
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};