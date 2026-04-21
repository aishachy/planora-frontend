"use clinent"

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getEventRegistrations = async (eventId: string) => {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/registration/event/${eventId}`, {
    credentials: "include",
  });
  return res.json();
};

export const approveRegistration = async (id: string) => {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/registration/approve/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
  return res.json();
};

export const rejectRegistration = async (id: string) => {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/registration/reject/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
  return res.json();
};

export const banParticipant = async (userId: string, eventId: string) => {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/registration/ban`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, eventId }),
  });
  return res.json();
};