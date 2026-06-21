"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

export const HeroSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event/featured`
        );

        const data = await res.json();

        setEvents(data?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch featured events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-950 py-24 text-white">
        <div className="container mx-auto flex h-[40vh] items-center justify-center">
          <p className="text-lg text-slate-400">Loading featured events...</p>
        </div>
      </section>
    );
  }

  if (!events.length) {
    return (
      <section className="bg-slate-950 py-24 text-white">
        <div className="container mx-auto flex h-[40vh] items-center justify-center">
          <p className="text-lg text-slate-400">No featured events found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="container mx-auto px-4">
        {/* Hero Content */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Featured Events
          </h2>

          <p className="mx-auto max-w-3xl text-lg text-slate-400">
            Join industry experts, innovators, and professionals at our
            upcoming events. Discover new opportunities, expand your network,
            and gain valuable insights from real-world experiences.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              {/* Event Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://via.placeholder.com/600x300.png"
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <CardHeader>
                <h3 className="line-clamp-2 text-xl font-semibold text-white">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "No Date"}
                  {" • "}
                  {event.time || "No Time"}
                </p>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="line-clamp-4 text-sm leading-relaxed text-slate-300">
                  {event.description}
                </p>
              </CardContent>

              <CardFooter>
                <button className="flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                  View Event
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};