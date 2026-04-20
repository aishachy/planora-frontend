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
      const user = await loginUser({ email, password });

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toastSuccess("Login successful!");
      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toastError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("h-screen bg-muted", className)}>
      <div className="flex h-full items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="flex w-full max-w-sm flex-col gap-4 rounded-md border bg-background px-6 py-8 shadow-md"
        >
          <h1 className="text-xl font-semibold text-center">Login</h1>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;