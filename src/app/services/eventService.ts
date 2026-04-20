export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    isFeatured: boolean;
    createdAt: string;
}

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get featured event
export const getFeaturedEvent = async (): Promise<Event> => {
    const res = await fetch(`${API_URL}/api/event/featured`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
        throw new Error(result.message || "Event not found");
    }

    return result.data;
};