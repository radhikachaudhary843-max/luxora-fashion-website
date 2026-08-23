"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerReseller } from "@/services/authService";

export default function ResellerSignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessType: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.name.trim() ||
      !form.businessName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword ||
      !form.businessType ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
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

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setLoading(true);

    const result = registerReseller({
      name: form.name,
      businessName: form.businessName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      businessType: form.businessType,
      gstNumber: form.gstNumber,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    });

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#f5efe6] px-4 py-10 sm:py-14">

      <div className="mx-auto max-w-2xl">

        <div className="bg-white p-6 shadow-sm sm:p-9">

          {/* LOGO */}

          <div className="text-center">

            <Link
              href="/"
              className="font-serif text-3xl tracking-[0.2em] text-[#111111]"
            >
              LUXORA
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
              Seller Centre
            </p>

            <h1 className="mt-2 font-serif text-3xl text-[#111111]">
              Create Reseller Account
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Join LUXORA and start selling your products.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-7 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-8"
          >

            {/* PERSONAL INFORMATION */}

            <section>

              <div className="mb-5">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Step 01
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Personal Information
                </h2>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Full Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Mobile Number *
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />
                </div>

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Email Address *
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seller@example.com"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

              </div>

            </section>

            {/* BUSINESS INFORMATION */}

            <section>

              <div className="mb-5">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Step 02
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Business Information
                </h2>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Business Name *
                  </label>

                  <input
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Your business name"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Business Type *
                  </label>

                  <select
                    name="businessType"
                    value={form.businessType}
                    onChange={handleChange}
                    className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  >

                    <option value="">
                      Select business type
                    </option>

                    <option value="Individual">
                      Individual
                    </option>

                    <option value="Boutique">
                      Boutique
                    </option>

                    <option value="Retailer">
                      Retailer
                    </option>

                    <option value="Wholesaler">
                      Wholesaler
                    </option>

                    <option value="Manufacturer">
                      Manufacturer
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    GST Number
                    <span className="ml-1 font-normal normal-case text-[#999999]">
                      (Optional)
                    </span>
                  </label>

                  <input
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleChange}
                    placeholder="GST number"
                    className="w-full border border-black/15 px-4 py-3 text-sm uppercase outline-none focus:border-[#c6a15b]"
                  />

                </div>

              </div>

            </section>

            {/* BUSINESS ADDRESS */}

            <section>

              <div className="mb-5">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Step 03
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Business Address
                </h2>

              </div>

              <div className="space-y-5">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Address *
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Shop / House / Street / Area"
                    className="w-full resize-none border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

                <div className="grid gap-5 sm:grid-cols-3">

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      City *
                    </label>

                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      State *
                    </label>

                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      PIN Code *
                    </label>

                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      placeholder="6-digit PIN"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* PASSWORD */}

            <section>

              <div className="mb-5">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Step 04
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Account Security
                </h2>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Password *
                  </label>

                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Confirm Password *
                  </label>

                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

              </div>

            </section>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Reseller Account"}
            </button>

          </form>

          {/* LOGIN */}

          <div className="mt-8 border-t border-black/10 pt-7 text-center">

            <p className="text-sm text-[#6b6258]">
              Already have a reseller account?
            </p>

            <Link
              href="/login"
              className="mt-2 inline-block text-sm font-semibold underline underline-offset-4 transition hover:text-[#c6a15b]"
            >
              Sign In
            </Link>

          </div>

          {/* CUSTOMER SIGNUP */}

          <div className="mt-5 text-center">

            <Link
              href="/signup"
              className="text-xs text-[#6b6258] transition hover:text-[#111111]"
            >
              Create Customer Account →
            </Link>

          </div>

          <div className="mt-5 text-center">

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