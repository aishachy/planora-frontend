"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Search,
  Users,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  venue?: string;
  isPublic: boolean;
  isPaid: boolean;
  fee?: number;
  organizer?: {
    name: string;
  };
  image?: string; // you can add later from backend
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/event")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setEvents(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredEvents = useMemo(() => {
    let temp = [...events];

    if (search) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.organizer?.name?.toLowerCase().includes(q)
      );
    }

    if (filter !== "ALL") {
      temp = temp.filter((e) => {
        if (filter === "PUBLIC_FREE") return e.isPublic && !e.isPaid;
        if (filter === "PUBLIC_PAID") return e.isPublic && e.isPaid;
        if (filter === "PRIVATE_FREE") return !e.isPublic && !e.isPaid;
        if (filter === "PRIVATE_PAID") return !e.isPublic && e.isPaid;
        return true;
      });
    }

    return temp;
  }, [events, search, filter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading premium events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 via-fuchsia-500/10 to-cyan-400/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-2 text-indigo-300 mb-4">
            <Sparkles size={18} />
            <span className="text-sm tracking-[0.2em] uppercase">Curated Experiences</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            Discover Premium Events That Feel Worth Your Time
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl text-lg">
            Browse elegant events with stunning visuals, rich details, and effortless discovery.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Controls */}
        <div className="grid md:grid-cols-[1fr_240px] gap-4 mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or organizer"
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <option value="ALL">All Events</option>
            <option value="PUBLIC_FREE">Public Free</option>
            <option value="PUBLIC_PAID">Public Paid</option>
            <option value="PRIVATE_FREE">Private Free</option>
            <option value="PRIVATE_PAID">Private Paid</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="relative h-56 overflow-hidden">
                {/* {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : ( */}
                <div className="h-full w-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white/80 text-lg font-semibold">
                  Add Event Image Later
                </div>
                ){"}"}
                <div className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold bg-black/40 backdrop-blur-md border border-white/10">
                  {event.isPaid ? `$${event.fee}` : "Free"}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3 line-clamp-2">
                  {event.title}
                </h2>

                <div className="space-y-2 text-slate-300 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    {event.organizer?.name || "Unknown Organizer"}
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
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 py-3 font-semibold hover:bg-slate-200 transition"
                >
                  View Details
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
