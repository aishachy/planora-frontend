"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { cn } from "../../lib/utils";
import { Input } from "@base-ui/react";
import { toastError, toastSuccess } from "../../lib/swal";
import { loginUser } from "../../app/services/authService";
import { useAuth } from "../../app/providers/authProvider";

const Login = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({ email, password });

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setUser(result.user);

      toastSuccess("Welcome back 👋");

      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toastError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={cn(
        "min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900",
        className
      )}
    >
      {/* glow background */}
      <div className="absolute w-125 h-125 bg-purple-600/30 blur-3xl rounded-full -top-40 -left-40" />
      <div className="absolute w-125 h-125 bg-blue-600/30 blur-3xl rounded-full -bottom-40 -right-40" />

      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl px-8 py-10 space-y-5"
      >
        {/* TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-300 text-sm">
            Login to continue your journey
          </p>
        </div>

        {/* EMAIL */}
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* PASSWORD */}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition"
        >
          {loading ? "Signing in..." : "Login"}
        </Button>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400">
          Don’t have an account? <span className="text-blue-400">Sign up</span>
        </p>
      </form>
    </section>
  );
};

export default Login;