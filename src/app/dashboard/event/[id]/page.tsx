/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";


interface User {
  id: string;
  name: string;
  email: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  fee: number;
  description?: string;
}

interface Registration {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";
  user: User;
}

export default function EventOwnerDashboard() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("PENDING");

  /* =========================
     FETCH EVENT + REGISTRATIONS
  ========================= */
  const fetchData = async () => {
    try {
      const [eventRes, regRes] = await Promise.all([
        axios.get(`/api/event/${id}`),
        axios.get(`/api/registration?eventId=${id}`),
      ]);

      setEvent(eventRes.data.data);
      setRegistrations(regRes.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* =========================
     ACTIONS
  ========================= */
  const approve = async (regId: string) => {
    await axios.patch(`/api/registration/approve/${regId}`);
    fetchData();
  };

  const reject = async (regId: string) => {
    await axios.patch(`/api/registration/reject/${regId}`);
    fetchData();
  };

  const ban = async (userId: string) => {
    await axios.post(`/api/registration/ban`, {
      userId,
      eventId: id,
    });
    fetchData();
  };

  const deleteEvent = async () => {
    await axios.delete(`/api/event/${id}`);
    router.push("/dashboard/event");
  };

  /* =========================
     FILTER BY STATUS
  ========================= */
  const filtered = registrations.filter((r) => r.status === tab);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      
      {/* =========================
          EVENT HEADER
      ========================= */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold">{event?.title}</h1>
        <p className="text-gray-600">{event?.date}</p>
        <p className="text-gray-600">{event?.venue}</p>
        <p className="text-green-600 font-semibold">
          Fee: {event?.fee === 0 ? "Free" : `$${event?.fee}`}
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push(`/dashboard/event/edit/${id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            Edit
          </button>

          <button
            onClick={deleteEvent}
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
          >
            Delete
          </button>
        </div>
      </div>

      {/* =========================
          TABS
      ========================= */}
      <div className="flex gap-3 mb-4">
        {["PENDING", "APPROVED", "REJECTED", "BLOCKED"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-xl ${
              tab === t ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* =========================
          LIST
      ========================= */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-gray-500">No users in this category</p>
        )}

        {filtered.map((reg) => (
          <div
            key={reg.id}
            className="bg-white shadow p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{reg.user.name}</p>
              <p className="text-sm text-gray-500">{reg.user.email}</p>
            </div>

            {/* =========================
                ACTION BUTTONS
            ========================= */}
            <div className="flex gap-2">
              {reg.status === "PENDING" && (
                <>
                  <button
                    onClick={() => approve(reg.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(reg.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => ban(reg.user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Ban
                  </button>
                </>
              )}

              {reg.status === "APPROVED" && (
                <button
                  onClick={() => ban(reg.user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Ban
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}