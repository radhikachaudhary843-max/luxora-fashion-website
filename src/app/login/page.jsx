"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  login,
  initializeAdminAccount,
} from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
     INITIALIZE DEFAULT ADMIN ACCOUNT
  ===================================================== */

  useEffect(() => {
    initializeAdminAccount();
  }, []);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  /* =====================================================
     HANDLE LOGIN
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const result = login({
      email,
      password,
      role,
    });

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    /* =================================================
       ROLE BASED REDIRECT
    ================================================= */

    if (result.user.role === "admin") {
      router.push("/admin");
      return;
    }

    if (result.user.role === "reseller") {
      router.push("/reseller");
      return;
    }

    router.push("/");
  };

  /* =====================================================
     ROLE LABEL
  ===================================================== */

  const roleLabel =
    role === "customer"
      ? "Customer"
      : role === "reseller"
        ? "Reseller"
        : "Admin";

  return (
    <main className="min-h-screen bg-[#f5efe6] px-4 py-12">

      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">

        <div className="w-full bg-white p-6 shadow-sm sm:p-9">

          {/* =================================================
              LOGO / HEADER
          ================================================= */}

          <div className="text-center">

            <Link
              href="/"
              className="font-serif text-3xl tracking-[0.2em] text-[#111111]"
            >
              LUXORA
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
              Welcome Back
            </p>

            <h1 className="mt-2 font-serif text-3xl text-[#111111]">
              Sign In
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Login to continue with LUXORA.
            </p>

          </div>

          {/* =================================================
              ACCOUNT TYPE
          ================================================= */}

          <div className="mt-7">

            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Login As
            </p>

            <div className="grid grid-cols-3 gap-2">

              {/* CUSTOMER */}

              <button
                type="button"
                onClick={() => {
                  setRole("customer");
                  setError("");
                }}
                className={`border px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition ${
                  role === "customer"
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-black/15 text-[#6b6258] hover:border-[#c6a15b]"
                }`}
              >
                Customer
              </button>

              {/* RESELLER */}

              <button
                type="button"
                onClick={() => {
                  setRole("reseller");
                  setError("");
                }}
                className={`border px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition ${
                  role === "reseller"
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-black/15 text-[#6b6258] hover:border-[#c6a15b]"
                }`}
              >
                Reseller
              </button>

              {/* ADMIN */}

              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setError("");
                }}
                className={`border px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition ${
                  role === "admin"
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-black/15 text-[#6b6258] hover:border-[#c6a15b]"
                }`}
              >
                Admin
              </button>

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

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

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-[#111111]"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setError(
                      "Password reset will be available soon."
                    );
                  }}
                  className="text-xs text-[#6b6258] underline underline-offset-4 transition hover:text-[#c6a15b]"
                >
                  Forgot Password?
                </button>

              </div>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
              />

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing In..."
                : `Sign In as ${roleLabel}`}
            </button>

          </form>

          {/* =================================================
              SIGNUP SECTION
          ================================================= */}

          <div className="my-7 flex items-center gap-4">

            <div className="h-px flex-1 bg-black/10" />

            <span className="text-[10px] uppercase tracking-wider text-[#999999]">
              OR
            </span>

            <div className="h-px flex-1 bg-black/10" />

          </div>

          <div className="text-center">

            <p className="text-sm text-[#6b6258]">
              New to LUXORA?
            </p>

            {role === "admin" ? (
              <p className="mt-2 text-xs text-[#999999]">
                Admin accounts are created by LUXORA.
              </p>
            ) : (
              <div className="mt-2 flex flex-col items-center gap-2">

                <Link
                  href="/signup"
                  className="text-sm font-semibold text-[#111111] underline underline-offset-4 transition hover:text-[#c6a15b]"
                >
                  Create Customer Account
                </Link>

                <Link
                  href="/reseller/signup"
                  className="text-sm font-semibold text-[#c6a15b] underline underline-offset-4 transition hover:text-[#111111]"
                >
                  Become a Reseller
                </Link>

              </div>
            )}

          </div>

          {/* =================================================
              HOME
          ================================================= */}

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