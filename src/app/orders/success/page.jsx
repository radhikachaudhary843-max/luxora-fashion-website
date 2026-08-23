
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("luxora_last_order");

      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);

        if (parsedOrder && parsedOrder.id) {
          setOrder(parsedOrder);
        }
      }
    } catch (error) {
      console.error("Failed to load recent order:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6] px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6258]">
            Loading Order...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />

        <main className="min-h-[70vh] bg-[#f5efe6] px-6 py-20">

          <div className="mx-auto max-w-lg bg-white px-6 py-14 text-center">

            <div className="text-5xl">
              📦
            </div>

            <h1 className="mt-6 font-serif text-3xl">
              No Recent Order Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6b6258]">
              We couldn't find your recent order. You can continue
              shopping and place a new order.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                href="/products"
                className="bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
              >
                Continue Shopping
              </Link>

              <Link
                href="/orders"
                className="border border-black/15 px-8 py-4 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
              >
                My Orders
              </Link>

            </div>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  const formattedDate = order.date
    ? new Date(order.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : order.paymentMethod === "upi"
        ? "UPI"
        : order.paymentMethod === "card"
          ? "Credit / Debit Card"
          : "—";

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const total = Number(order.total || 0);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6] px-6 py-12 lg:px-8 lg:py-16">

        <div className="mx-auto max-w-4xl">

          {/* SUCCESS */}

          <section className="bg-white px-6 py-12 text-center sm:px-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
              ✓
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              Order Confirmed
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#6b6258]">
              Thank you for shopping with LUXORA. Your order has been
              successfully placed and is now being prepared.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                href="/orders"
                className="bg-[#111111] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
              >
                View My Orders
              </Link>

              <Link
                href="/products"
                className="border border-black/15 bg-white px-7 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
              >
                Continue Shopping
              </Link>

            </div>

          </section>

          {/* ORDER INFO */}

          <section className="mt-6 grid gap-6 md:grid-cols-2">

            {/* ORDER DETAILS */}

            <div className="bg-white p-6 sm:p-7">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                Order Details
              </p>

              <div className="mt-5 space-y-4">

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-[#6b6258]">
                    Order ID
                  </span>

                  <span className="break-all text-right font-semibold">
                    {order.id}
                  </span>

                </div>

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-[#6b6258]">
                    Date
                  </span>

                  <span>
                    {formattedDate}
                  </span>

                </div>

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-[#6b6258]">
                    Payment
                  </span>

                  <span className="text-right">
                    {paymentLabel}
                  </span>

                </div>

                <div className="flex justify-between gap-4 border-t border-black/10 pt-4 text-sm">

                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="font-semibold">
                    ₹{total.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

            </div>

            {/* ADDRESS */}

            <div className="bg-white p-6 sm:p-7">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                Delivery Address
              </p>

              <div className="mt-5 text-sm leading-6">

                <p className="font-semibold">
                  {order.customer?.name || "Customer"}
                </p>

                <p className="mt-2 text-[#6b6258]">

                  {order.address?.address || "—"}

                  <br />

                  {order.address?.city || "—"}
                  {order.address?.state
                    ? `, ${order.address.state}`
                    : ""}

                  <br />

                  PIN - {order.address?.pincode || "—"}

                </p>

                <p className="mt-3 text-[#6b6258]">
                  {order.customer?.phone || "—"}
                </p>

              </div>

            </div>

          </section>

          {/* PRODUCTS */}

          <section className="mt-6 bg-white p-6 sm:p-7">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
              Ordered Products
            </p>

            {items.length === 0 ? (

              <p className="mt-6 text-sm text-[#6b6258]">
                No product information available.
              </p>

            ) : (

              <div className="mt-6 divide-y divide-black/10">

                {items.map((item, index) => {

                  const itemPrice =
                    Number(item.price || 0);

                  const quantity =
                    Number(item.quantity || 1);

                  const itemTotal =
                    itemPrice * quantity;

                  return (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >

                      {/* IMAGE */}

                      <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-[#eee4d6]">

                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                          className="h-full w-full object-cover"
                        />

                      </div>

                      {/* INFO */}

                      <div className="min-w-0 flex-1">

                        <h3 className="text-sm font-medium">
                          {item.name || "Product"}
                        </h3>

                        <p className="mt-1 text-xs text-[#6b6258]">
                          Quantity: {quantity}
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            )}

          </section>

          {/* DELIVERY */}

          <div className="mt-6 bg-[#111111] px-6 py-5 text-center text-xs text-white sm:px-8">

            <p className="font-semibold uppercase tracking-[0.15em]">
              Estimated Delivery
            </p>

            <p className="mt-2 text-white/70">
              Your order will be delivered within 5–7 business days.
            </p>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

