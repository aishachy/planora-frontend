/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createCheckoutSession = async (
  registrationId: string,
  amount: number
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(
    `${API_URL}/api/payment/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        registrationId,
        amount,
      }),
    }
  );

  const text = await res.text();

  let data: any;

  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("❌ Non-JSON response from backend:", text);
    throw new Error("Server error: invalid JSON response");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Payment request failed");
  }

  return data;
};