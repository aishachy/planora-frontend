/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* GET ALL MY EVENTS */
export const getMyEvents = async () => {
  const res = await fetch(`${API_URL}/api/event/myEvent`, {
    credentials: "include",
  });
  return res.json();
};

/* GET EVENT BY ID */
export const getEventById = async (id: string) => {
  const res = await fetch(`${API_URL}/api/event/${id}`, {
    credentials: "include",
  });
  return res.json();
};

/* CREATE EVENT */
export const createEvent = async (data: any) => {
  const res = await fetch(`${API_URL}/api/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

/* UPDATE EVENT */
export const updateEvent = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/api/event/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

/* DELETE EVENT */
export const deleteEvent = async (id: string) => {
  const res = await fetch(`${API_URL}/api/event/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
};