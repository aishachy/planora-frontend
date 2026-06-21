"use client"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const safeFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  const text = await res.text();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("❌ Non-JSON response:", text);
    throw new Error("Server returned invalid response");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};


export const getMyRegistrations =
  async () => {
    const token =
      localStorage.getItem("token");

    return safeFetch(
      `${API_URL}/api/registration/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

export const getRegistrationById = async (id: string) => {
  return safeFetch(`${API_URL}/api/registration/${id}`, {
    credentials: "include",
  });
};

export const approveRegistration = async (id: string) => {
  return safeFetch(`${API_URL}/api/registration/approve/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
};

export const rejectRegistration = async (id: string) => {
  return safeFetch(`${API_URL}/api/registration/reject/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
};

export const banParticipant = async (userId: string, eventId: string) => {
  return safeFetch(`${API_URL}/api/registration/ban`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, eventId }),
  });
};