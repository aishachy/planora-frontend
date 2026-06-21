const API = process.env.NEXT_PUBLIC_API_URL;

/* -----------------------------------------
   SAFE JSON PARSER
------------------------------------------*/
const safeJson = async (res: Response) => {
    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("❌ Non-JSON response:", text);
        throw new Error("Server error: Expected JSON but received HTML");
    }
};

/* -----------------------------------------
   GET MY INVITATIONS (RECEIVED)
------------------------------------------*/
export const getMyInvitations = async (token: string) => {
    if (!API) throw new Error("API URL not configured");

    const res = await fetch(`${API}/api/invitation/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await safeJson(res);

    if (res.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
    }

    if (!res.ok) {
        throw new Error(data.message || "Failed to load invitations");
    }

    return data;
};

/* -----------------------------------------
   GET SENT INVITATIONS
   ❌ FIXED ENDPOINT HERE
------------------------------------------*/
export const getSentInvitations = async (token: string, eventId: string) => {
    if (!API) throw new Error("API URL not configured");

    const res = await fetch(`${API}/api/invitation/sent`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data.message || "Failed to load sent invitations");
    }

    return data;
};

/* -----------------------------------------
   SEND INVITATION
------------------------------------------*/
export const sendInvitation = async (
    eventId: string,
    userId: string,
    token: string
) => {
    if (!API) throw new Error("API URL not configured");

    const res = await fetch(`${API}/api/invitation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, userId }),
    });

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data.message || "Failed to send invitation");
    }

    return data;
};

/* -----------------------------------------
   ACCEPT INVITATION
------------------------------------------*/
export const acceptInvitation = async (id: string, token: string) => {
    if (!API) throw new Error("API URL not configured");

    const res = await fetch(`${API}/api/invitation/${id}/accept`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data.message || "Failed to accept invitation");
    }

    return data;
};

/* -----------------------------------------
   REJECT INVITATION
------------------------------------------*/
export const rejectInvitation = async (id: string, token: string) => {
    if (!API) throw new Error("API URL not configured");

    const res = await fetch(`${API}/api/invitation/${id}/reject`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data.message || "Failed to reject invitation");
    }

    return data;
};

/* -----------------------------------------
   APPROVE PAYMENT INVITATION
------------------------------------------*/
export const approvePaymentInvitation = async (
    id: string,
    token: string
) => {
    if (!API) throw new Error("API URL not configured");

    const res = await fetch(`${API}/api/invitation/${id}/approve-payment`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data.message || "Payment failed");
    }

    return data;
};