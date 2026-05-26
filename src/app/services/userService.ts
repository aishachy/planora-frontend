/* eslint-disable @typescript-eslint/no-explicit-any */

const API = process.env.NEXT_PUBLIC_API_URL;

export const getAllUsers = async (
  token: string
) => {
  const res = await fetch(
    `${API}/api/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  return data;
};