"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-[#e8dccb] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
          Join LUXORA
        </p>

        <h2 className="mt-4 font-serif text-3xl text-[#111111] sm:text-4xl">
          Stay in the Style Loop
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#6b6258]">
          Get first access to new collections, exclusive offers and
          curated fashion inspiration.
        </p>

        {submitted ? (
          <p className="mt-8 text-sm font-medium text-[#111111]">
            Thank you for subscribing to LUXORA.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="min-h-12 flex-1 border border-[#111111]/20 bg-white px-4 text-sm outline-none focus:border-[#c6a15b]"
            />

            <button
              type="submit"
              className="min-h-12 bg-[#111111] px-7 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}