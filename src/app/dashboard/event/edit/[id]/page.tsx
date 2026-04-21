/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = "http://localhost:5000";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/event/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data.data || data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`${API_URL}/api/event/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    router.push(`/dashboard/events/${id}`);
  };

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={form.title || ""}
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={form.description || ""}
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={form.date?.split("T")[0]}
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <input
          type="time"
          name="time"
          value={form.time || ""}
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <input
          name="venue"
          value={form.venue || ""}
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />

        <input
          name="eventLink"
          value={form.eventLink || ""}
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
            value={form.fee || 0}
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />
        )}

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          Update Event
        </button>
      </form>
    </div>
  );
}