"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerCustomer } from "@/services/authService";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = registerCustomer({
      name,
      email,
      password: form.password,
    });

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setSuccess("Account created successfully! Redirecting...");

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#f5efe6] px-4 py-12">

      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">

        <div className="w-full bg-white p-6 shadow-sm sm:p-9">

          {/* LOGO */}

          <div className="text-center">

            <Link
              href="/"
              className="font-serif text-3xl tracking-[0.2em] text-[#111111]"
            >
              LUXORA
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
              Create Account
            </p>

            <h1 className="mt-2 font-serif text-3xl text-[#111111]">
              Join LUXORA
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Create your account and start shopping.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* NAME */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
              />

              <p className="mt-2 text-xs text-[#6b6258]">
                Minimum 6 characters.
              </p>
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
              />
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* LOGIN */}

          <div className="mt-7 border-t border-black/10 pt-6 text-center">

            <p className="text-sm text-[#6b6258]">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-2 inline-block text-sm font-semibold text-[#111111] underline underline-offset-4 transition hover:text-[#c6a15b]"
            >
              Sign In
            </Link>

          </div>

          {/* BACK HOME */}

          <div className="mt-6 text-center">

            <Link
              href="/"
              className="text-xs text-[#6b6258] transition hover:text-[#111111]"
            >
              ← Back to LUXORA
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}