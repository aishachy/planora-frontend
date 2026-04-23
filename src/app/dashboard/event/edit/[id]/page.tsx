/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  // safe id handling
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH EVENT
  ========================= */
  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/api/event/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data.data || data))
      .catch((err) => console.log(err));
  }, [id]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     UPDATE EVENT
  ========================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!id) {
      console.log("ID missing");
      return;
    }

    try {
      setLoading(true);

      console.log("UPDATING:", form);

      const res = await fetch(`${API_URL}/api/event/${id}`, {
        method: "PUT", // MUST match backend
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("UPDATE RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("Event updated successfully");

      router.push("/dashboard/event");

    } catch (err) {
      console.log("UPDATE ERROR:", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (!form) {
    return <div className="p-6">Loading event...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}
        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Title"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Description"
        />

        {/* DATE */}
        <input
          type="date"
          name="date"
          value={form.date ? form.date.split("T")[0] : ""}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        {/* TIME */}
        <input
          type="time"
          name="time"
          value={form.time || ""}
          onChange={handleChange}
          className="w-full p-3 border"
        />

        {/* VENUE */}
        <input
          name="venue"
          value={form.venue || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Venue"
        />

        {/* LINK */}
        <input
          name="eventLink"
          value={form.eventLink || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Event Link"
        />

        {/* CHECKBOXES */}
        <div className="flex gap-6">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={!!form.isPublic}
              onChange={handleChange}
            />
            Public
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPaid"
              checked={!!form.isPaid}
              onChange={handleChange}
            />
            Paid
          </label>

        </div>

        {/* FEE */}
        {form.isPaid && (
          <input
            name="fee"
            type="number"
            value={form.fee || 0}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            placeholder="Fee"
          />
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded w-full disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Event"}
        </button>

      </form>
    </div>
  );
} 