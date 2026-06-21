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
  approvePaymentInvitation,
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
  const [registration, setRegistration] = useState<any>(null);
  console.log("CURRENT USER =", user);
  console.log("CURRENT EVENT =", event);
  console.log("CURRENT REGISTRATION =", registration);
  const [myInvitation, setMyInvitation] = useState<any>(null);
  const [refreshReviews, setRefreshReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  // ---------------------------
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
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("AUTH ME RESPONSE:", data);

        const user = data.data || data.user || data;

        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to load user", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRegistration = async () => {
      const token = localStorage.getItem("token");
      if (!token || !event?.id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/registration/event/${event?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("EVENT ID:", event?.id);
        console.log("REGISTRATION API RESPONSE", data);
        console.log("CURRENT EVENT ID:", event?.id);
        console.log("FETCH URL:",
          `http://localhost:5000/api/registration/event/${event?.id}`
        );
        if (data.success) {
          setRegistration(data.data);
        } else {
          setRegistration(null);
        }
      } catch (err) {
        console.error("Failed to load registration", err);
      }
    };

    fetchRegistration();
  }, [event?.id]);

  // ---------------------------
  // FETCH INVITATION
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

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // ---------------------------
  // INVITATION ACTIONS
  // ---------------------------
  const handleAccept = async () => {
    await acceptInvitation(myInvitation.id, token!);
    setMyInvitation({ ...myInvitation, status: "ACCEPTED" });
  };

  const handleReject = async () => {
    await rejectInvitation(myInvitation.id, token!);
    setMyInvitation({ ...myInvitation, status: "REJECTED" });
  };

  const handlePay = async () => {
    await approvePaymentInvitation(myInvitation.id, token!);

    setMyInvitation({
      ...myInvitation,
      status: "PENDING_PAYMENT_APPROVAL",
    });
  };

  const getButtonText = () => {
    if (event.isPublic && !event.isPaid) return "Join Instantly";
    if (event.isPublic && event.isPaid) return "Pay & Join";
    if (!event.isPublic && !event.isPaid) return "Request to Join";
    return "Pay & Request Access";
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">

      {/* HERO BANNER */}
      <div className="relative h-[420px] overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">
              Event Preview
            </h1>
          </div>
        )}

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* title overlay */}
        <div className="absolute bottom-24 left-10 text-white">
          <h1 className="text-5xl font-bold drop-shadow-lg">
            {event.title}
          </h1>

          <div className="mt-3 flex gap-3">
            <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur">
              {event.isPublic ? "Public" : "Private"}
            </span>

            <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur">
              {event.isPaid ? "Paid Event" : "Free Event"}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto -mt-20 relative z-10">

        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white">

          {/* GRID HEADER */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            <div className="p-5 rounded-2xl bg-slate-50 border">
              <p className="text-gray-500 text-sm">Date</p>
              <p className="text-lg font-semibold">
                📅 {new Date(event.date).toLocaleDateString()}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border">
              <p className="text-gray-500 text-sm">Time</p>
              <p className="text-lg font-semibold">⏰ {event.time}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border">
              <p className="text-gray-500 text-sm">Venue</p>
              <p className="text-lg font-semibold">
                📍 {event.venue || "Online"}
              </p>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">About Event</h2>
            <p className="text-gray-600 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* PARTICIPATION CARD */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border">
            <h3 className="font-semibold text-blue-700 mb-2">
              Participation Type
            </h3>

            <p className="text-gray-700">
              {event.isPublic && !event.isPaid && "Free Public → Instant Join"}
              {event.isPublic && event.isPaid && "Paid Public → Payment Required"}
              {!event.isPublic && !event.isPaid && "Private Free → Request Access"}
              {!event.isPublic && event.isPaid && "Private Paid → Payment Required"}
            </p>
          </div>

          {/* STATUS DEBUG PANEL (now premium styled) */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">

            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-sm text-gray-500">Invitation</p>
              <p className="font-semibold">
                {myInvitation ? "Active" : "None"}
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-sm text-gray-500">Registration</p>
              <p className="font-semibold">
                {registration?.status || "Not Joined"}
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-sm text-gray-500">Payment</p>
              <p className="font-semibold">
                {event.isPaid ? `৳${event.fee}` : "Free"}
              </p>
            </div>

          </div>



          {/* OWNER ACTIONS */}
          {isOwner && (
            <div className="flex gap-3 mb-8">
              <button
                onClick={() =>
                  (window.location.href = `/dashboard/event/${event.id}/manage`)
                }
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Manage
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/dashboard/event/edit/${event.id}`)
                }
                className="px-5 py-2 rounded-xl bg-slate-500 text-white hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/dashboard/event/delete/${event.id}`)
                }
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}

          {/* INVITATION PANEL */}
          <div className="p-6 rounded-2xl border bg-yellow-50 mb-8">

            {myInvitation ? (
              <>
                <p className="font-semibold text-lg mb-2">
                  🎉 Invitation Received
                </p>

                <p className="mb-4">
                  Status: <b>{myInvitation.status}</b>
                </p>

                <div className="flex gap-2 flex-wrap">

                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white"
                  >
                    Accept
                  </button>

                  <button
                    onClick={handleReject}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white"
                  >
                    Reject
                  </button>

                  {event.isPaid && (
                    <button
                      onClick={handlePay}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                    >
                      Pay & Accept
                    </button>
                  )}

                </div>
              </>
            ) : (
              <p className="text-gray-600">
                No invitation available
              </p>
            )}

          </div>

          {/* REVIEWS */}
          <div className="space-y-6">
            <ReviewForm
              eventId={id ?? ""}
              refreshReviews={() =>
                setRefreshReviews(!refreshReviews)
              }
            />

            {id && (
              <ReviewList
                eventId={id}
                key={refreshReviews ? "1" : "0"}
                refresh={0}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

