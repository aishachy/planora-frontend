/* eslint-disable @typescript-eslint/no-explicit-any */
const API = process.env.NEXT_PUBLIC_API_URL;

export const createReview = async (data: any, token: string) => {
    const res = await fetch(`${API}/api/review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to create review");
    }

    return result;
};

export const getEventReviews = async (eventId: string) => {
    const res = await fetch(`${API}/api/review/event/${eventId}`);

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to fetch reviews");
    }

    return result;
};

export const updateReview = async (id: string, data: any, token: string) => {
    const res = await fetch(`${API}/api/review/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to update review");
    }

    return result;
};

export const deleteReview = async (id: string, token: string) => {
    const res = await fetch(`${API}/api/review/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to delete review");
    }

    return result;
};