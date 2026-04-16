

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const loginUser = async (data: LoginData) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: data.email, password: data.password }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return {
    user: result.user,
    token: result.token,
  };
};

export const loginAndStoreToken = async (loginData: LoginData) => {
  const { user, token } = await loginUser(loginData);
  localStorage.setItem("token", token);
  return user;
};


export const registerUser = async (data: RegisterData) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "USER"
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw { statusCode: res.status, message: result.message };
  }


  localStorage.setItem("token", result.token)

  return result.user;
};

