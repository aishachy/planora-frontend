/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "../../components/ui/field";

import { registerUser } from "../../app/services/authService";
import { useAuth } from "../../app/providers/authProvider";
import { toastError, toastSuccess } from "../../lib/swal";
import { Input } from "@base-ui/react";

type Role = "USER" | "ADMIN";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toastError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const user = await registerUser({ name, email, password, role });

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toastSuccess("Welcome 🎉 Account created successfully");

      router.push("/dashboard");
    } catch (err: any) {
      toastError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900", className)} {...props}>

      {/* glow background */}
      <div className="absolute w-112.5 h-112.5 bg-indigo-600/30 blur-3xl rounded-full -top-40 -left-40" />
      <div className="absolute w-112.5 h-112.5 bg-purple-600/30 blur-3xl rounded-full -bottom-40 -right-40" />

      <Card className="relative w-full max-w-lg bg-white/10 border border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl">

        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl text-white font-bold">
            Create Account
          </CardTitle>

          <CardDescription className="text-gray-300">
            Join and start managing your events
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">

              {/* NAME */}
              <Field>
                <FieldLabel className="text-gray-200">Name</FieldLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>

              {/* EMAIL */}
              <Field>
                <FieldLabel className="text-gray-200">Email</FieldLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>

              {/* PASSWORD */}
              <Field>
                <FieldLabel className="text-gray-200">Password</FieldLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>

              {/* CONFIRM PASSWORD */}
              <Field>
                <FieldLabel className="text-gray-200">Confirm Password</FieldLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>

              {/* ROLE */}
              <Field>
                <FieldLabel className="text-gray-200">Role</FieldLabel>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </Field>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition"
              >
                {loading ? "Creating account..." : "Register"}
              </Button>

              {/* LOGIN LINK */}
              <FieldDescription className="text-center text-gray-300 mt-3">
                Already have an account?{" "}
                <a href="/login" className="text-indigo-400 hover:underline">
                  Login
                </a>
              </FieldDescription>

            </FieldGroup>
          </form>
        </CardContent>

      </Card>
    </div>
  );
}