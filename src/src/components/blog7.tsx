"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
          "http://localhost:5000/api/event/featured"
        );

        const data = await res.json();
        setEvents(data?.data ?? []);
      } catch (error) {
        console.error(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        No events found
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="text-center">
          <h2 className="py-8 text-4xl md:text-6xl font-bold mb-4">
            Featured Events
          </h2>
          <h2 className="mb-3 text-5xl tracking-tighter text-pretty md:mb-4 lg:mb-6 lg:max-w-3xl lg:text-7xl">
            Event
          </h2>
          <p className="mb-8 text-gray-400 md:text-base lg:max-w-2xl lg:text-lg">
            Join us for an exclusive event where industry experts share insights on modern web development, UI design, and <br />
            the latest tech trends. Stay ahead with practical knowledge and real-world experience.
          </p>
        </div>

        {/* CARD LAYOUT - 4 cards in a horizontal row */}
        <div className="flex space-x-6 overflow-x-auto">
          {events.map((event) => (
            <Card
              key={event.id}
              className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              {/* Event Image or Placeholder */}
              <div className="aspect-video w-full">
                <a
                  href="#"
                  target="_blank"
                  className="transition-opacity duration-200 fade-in hover:opacity-70"
                >
                  <img
                    src="https://via.placeholder.com/600x300.png" // Placeholder for event image
                    alt={event.title}
                    className="h-full w-full object-cover object-center"
                  />
                </a>
              </div>
              <CardHeader>
                <h3 className="text-xl hover:underline md:text-xl">
                  <a href="#" target="_blank">
                    {event.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm font-semibold text-foreground/80">
                  {event.date ? new Date(event.date).toDateString() : "No Date"} · {event.time || "No Time"}
                </p>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter>
                <a
                  href="#"
                  target="_blank"
                  className="flex items-center text-muted-foreground hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-1 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};