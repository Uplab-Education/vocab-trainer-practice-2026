"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/auth-provider";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === "register";

  return (
    <form
      className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");

        const request = isRegister
          ? register(name, email, password)
          : login(email, password);

        request
          .then((result) => {
            if (!result.ok) {
              setError(result.message ?? "Authentication failed.");
              return;
            }

            router.push("/");
            router.refresh();
          })
          .finally(() => setIsSubmitting(false));
      }}
    >
      <div className="space-y-5">
        {isRegister ? (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              className="block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              onChange={(event) => setName(event.target.value)}
              required
              type="text"
              value={name}
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            autoComplete="email"
            className="block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            className="block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button disabled={isSubmitting} type="submit">
          {isRegister ? "Create account" : "Login"}
        </Button>
      </div>
    </form>
  );
}