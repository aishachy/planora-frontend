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
------------------------------------------*/
export const getSentInvitations = async (token: string) => {
  const res = await fetch(`${API}/api/invitation/sentInvitations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

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
   PAY & ACCEPT INVITATION
------------------------------------------*/
export const payAndAcceptInvitation = async (
    id: string,
    token: string
) => {
    const res = await fetch(`${API}/api/invitation/pay/${id}`, {
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