
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    /*
      DEMO ADMIN LOGIN

      Baad mein isko proper backend authentication
      se connect karenge.
    */

    const ADMIN_EMAIL = "admin@luxora.com";
    const ADMIN_PASSWORD = "admin123";

    if (
      email !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {
      setError("Invalid admin email or password.");
      setLoading(false);
      return;
    }

    const adminUser = {
      id: "admin_001",
      name: "LUXORA Admin",
      email: ADMIN_EMAIL,
      role: "admin",
      loginAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "luxora_admin",
      JSON.stringify(adminUser)
    );

    localStorage.setItem(
      "luxora_role",
      "admin"
    );

    setLoading(false);

    router.push("/admin");
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
              Administration
            </p>

            <h1 className="mt-2 font-serif text-3xl text-[#111111]">
              Admin Login
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Sign in to manage your LUXORA store.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* FORM */}

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
                Admin Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@luxora.com"
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
                placeholder="Enter admin password"
                autoComplete="current-password"
                className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
              />

            </div>

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing In..."
                : "Admin Sign In"}
            </button>

          </form>

          {/* DEMO CREDENTIALS */}

          <div className="mt-6 border border-[#c6a15b]/30 bg-[#faf7f2] p-4">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#c6a15b]">
              Demo Admin Credentials
            </p>

            <p className="mt-2 text-xs text-[#6b6258]">
              Email: admin@luxora.com
            </p>

            <p className="mt-1 text-xs text-[#6b6258]">
              Password: admin123
            </p>

          </div>

          {/* CUSTOMER LOGIN */}

          <div className="mt-7 border-t border-black/10 pt-6 text-center">

            <p className="text-sm text-[#6b6258]">
              Are you a customer?
            </p>

            <Link
              href="/login"
              className="mt-2 inline-block text-sm font-semibold text-[#111111] underline underline-offset-4 transition hover:text-[#c6a15b]"
            >
              Customer Login
            </Link>

          </div>

          {/* HOME */}

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

