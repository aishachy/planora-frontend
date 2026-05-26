/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ReviewList from "../../../components/reviews/reviewList";
import ReviewForm from "../../../components/reviews/reviewForm";

import {
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
  payAndAcceptInvitation,
} from "../../services/invitationService";

interface Event {
  id: string;
  title: string;
  description: string;
  venue?: string;
  eventLink?: string;
  date: string;
  time: string;
  isPublic: boolean;
  isPaid: boolean;
  fee?: number;
  organizer?: {
    id?: string;
    name: string;
  };
  image?: string;
}

export default function EventDetailsPage() {
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null);

  const [myInvitation, setMyInvitation] = useState<any>(null);

  const [refreshReviews, setRefreshReviews] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // FETCH EVENT
  // ---------------------------
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/event/${id}`
        );

        const data = await res.json();

        setEvent(data?.data || data);
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // ---------------------------
  // FETCH USER
  // ---------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/me",
          { credentials: "include" }
        );

        const data = await res.json();
        setUser(data?.data || null);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    fetchUser();
  }, []);

  // ---------------------------
  // FETCH INVITATION FOR THIS EVENT
  // ---------------------------
  useEffect(() => {
    const loadInvitation = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      try {
        const res = await getMyInvitations(token);

        const found = res.data?.find(
          (inv: any) => inv.eventId === id
        );

        setMyInvitation(found || null);
      } catch (err) {
        console.error("Failed to load invitation", err);
      }
    };

    loadInvitation();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!event) return <div className="p-10">Event not found</div>;

  const isOwner = user?.id === event?.organizer?.id;

  // ---------------------------
  // EVENT BUTTON TEXT
  // ---------------------------
  const getButtonText = () => {
    if (event.isPublic && !event.isPaid) return "Join";
    if (event.isPublic && event.isPaid) return "Pay & Join";
    if (!event.isPublic && !event.isPaid)
      return "Request to Join";
    return "Pay & Request";
  };

  // ---------------------------
  // INVITATION ACTIONS
  // ---------------------------
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  const handleAccept = async () => {
    await acceptInvitation(myInvitation.id, token!);
    setMyInvitation({ ...myInvitation, status: "ACCEPTED" });
  };

  const handleReject = async () => {
    await rejectInvitation(myInvitation.id, token!);
    setMyInvitation({ ...myInvitation, status: "REJECTED" });
  };

  const handlePay = async () => {
    await payAndAcceptInvitation(myInvitation.id, token!);
    setMyInvitation({ ...myInvitation, status: "ACCEPTED" });
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Banner */}
      <div className="h-96 bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <h1 className="text-white text-4xl font-bold">
            Event Image Here
          </h1>
        )}
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 -mt-16 relative z-10">

        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">{event.title}</h1>

          <span className="bg-slate-100 px-4 py-2 rounded-full text-sm font-medium">
            {event.isPublic ? "Public" : "Private"} •{" "}
            {event.isPaid ? "Paid" : "Free"}
          </span>
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-6 text-slate-700 mb-8">
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>⏰ {event.time}</p>
          <p>📍 {event.venue || "Online Event"}</p>

          <p>👤 {event.organizer?.name}</p>
          <p>💳 {event.isPaid ? `$${event.fee}` : "Free"}</p>
        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-600 mb-6">
          {event.description}
        </p>

        {/* JOIN BUTTON */}
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl">
          {getButtonText()}
        </button>

        {/* OWNER CONTROLS */}
        {isOwner && (
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Manage Event
            </button>

            <button className="px-4 py-2 bg-yellow-500 text-white rounded">
              Edit
            </button>

            <button className="px-4 py-2 bg-red-600 text-white rounded">
              Delete
            </button>
          </div>
        )}

        {/* ---------------- INVITATION SECTION ---------------- */}

        <div className="mt-6 border p-4 rounded bg-yellow-50">
          {myInvitation ? (
            <>
              <p className="font-semibold">
                🎉 You are invited to this event
              </p>

              <p>Status: {myInvitation.status}</p>

              {myInvitation.status === "PENDING" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAccept}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={handleReject}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>

                  {event.isPaid && (
                    <button
                      onClick={handlePay}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Pay & Accept
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600">
              You are not invited to this event
            </p>
          )}
        </div>

        {/* ---------------- REVIEWS ---------------- */}

        <ReviewForm
          eventId={id ?? ""}
          refreshReviews={() => setRefreshReviews(!refreshReviews)}
        />

        {id && (
          <ReviewList
            eventId={id}
            key={refreshReviews ? "1" : "0"} refresh={0}          />
        )}

      </div>
    </div>
  );
}