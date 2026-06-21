"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* =========================
     FETCH EVENT
  ========================= */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setFetching(true);

        const res = await fetch(`${API_URL}/api/event/${id}`);
        const data = await res.json();

        setForm(data.data || data);
      } catch (err) {
        console.log(err);
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [id]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!id) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/event/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      router.push("/dashboard/event");
    } catch (err) {
      alert("Update failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING UI (PREMIUM)
  ========================= */
  if (fetching || !form) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="h-24 bg-gray-200 rounded-xl" />
        <div className="h-12 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Event
          </h1>
          <p className="text-gray-500 mt-1">
            Update your event details
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl shadow-sm p-6 space-y-6"
        >

          {/* BASIC INFO */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Basic Information
            </h2>

            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Event Title"
            />

            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl h-28 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Event Description"
            />
          </div>

          {/* DATE & TIME */}
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="date"
              name="date"
              value={form.date ? form.date.split("T")[0] : ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="time"
              name="time"
              value={form.time || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* LOCATION */}
          <input
            name="venue"
            value={form.venue || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Venue"
          />

          <input
            name="eventLink"
            value={form.eventLink || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Event Link"
          />

          {/* OPTIONS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isPublic"
                checked={!!form.isPublic}
                onChange={handleChange}
              />
              Public Event
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isPaid"
                checked={!!form.isPaid}
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
              value={form.fee || 0}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Fee (৳)"
            />
          )}

          {/* ACTION */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium
                       hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}