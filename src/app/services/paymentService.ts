"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createCheckoutSession = async (
  registrationId: string,
  amount: number
) => {
  const token = localStorage.getItem("token");

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

  // 🔥 SAFE: read raw response first
  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error(" Non-JSON response from backend:", text);
    throw new Error("Server error: invalid JSON response");
  }

  // 🔥 handle backend errors properly
  if (!res.ok) {
    throw new Error(data.message || "Payment request failed");
  }

  return data;
};