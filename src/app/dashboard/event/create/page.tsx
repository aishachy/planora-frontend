"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    eventLink: "",
    isPublic: true,
    isPaid: false,
    fee: 0,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await fetch(`${API_URL}/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      router.push("/dashboard/event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Event
          </h1>
          <p className="text-gray-500 mt-1">
            Build and publish your event in minutes
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
        >

          {/* BASIC INFO */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Basic Information
            </h2>

            <input
              name="title"
              placeholder="Event Title"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Event Description"
              className="w-full px-4 py-3 border rounded-xl h-28 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />

            <input
              type="time"
              name="time"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />
          </div>

          {/* LOCATION */}
          <input
            name="venue"
            placeholder="Venue / Location"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
          />

          <input
            name="eventLink"
            placeholder="Event Link (optional)"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
          />

          {/* SETTINGS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isPublic"
                checked={form.isPublic}
                onChange={handleChange}
              />
              Public Event
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isPaid"
                checked={form.isPaid}
                onChange={handleChange}
              />
              Paid Event
            </label>

          </div>

          {/* FEE */}
          {form.isPaid && (
            <input
              name="fee"
              type="number"
              placeholder="Ticket Fee (৳)"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium
                       hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>

        </form>
      </div>
    </div>
  );
}