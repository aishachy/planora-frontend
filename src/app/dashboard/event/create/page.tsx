/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000";

export default function CreateEventPage() {
  const router = useRouter();

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

    await fetch(`${API_URL}/api/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    router.push("/dashboard/event");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Title"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <input
          type="time"
          name="time"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <input
          name="venue"
          placeholder="Venue"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <input
          name="eventLink"
          placeholder="Event Link"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <div className="flex gap-6">
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={form.isPublic}
              onChange={handleChange}
            />
            Public
          </label>

          <label>
            <input
              type="checkbox"
              name="isPaid"
              checked={form.isPaid}
              onChange={handleChange}
            />
            Paid
          </label>
        </div>

        {form.isPaid && (
          <input
            name="fee"
            type="number"
            placeholder="Fee"
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />
        )}

        <button className="bg-green-600 text-white px-6 py-3 rounded">
          Create Event
        </button>
      </form>
    </div>
  );
}