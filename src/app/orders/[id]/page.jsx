"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import { getCurrentUser } from "@/services/authService";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    try {
      const allOrders = JSON.parse(
        localStorage.getItem("luxora_orders") || "[]"
      );

      const foundOrder = allOrders.find(
        (item) =>
          item.id === params.id &&
          item.userId === currentUser.id
      );

      setOrder(foundOrder || null);
    } catch {
      setOrder(null);
    }

    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6]">
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

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6] px-6">

          <div className="w-full max-w-lg bg-white px-6 py-14 text-center">

            <div className="text-5xl">
              📦
            </div>

            <h1 className="mt-6 font-serif text-3xl text-[#111111]">
              Order Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6b6258]">
              We couldn't find this order in your account.
            </p>

            <Link
              href="/orders"
              className="mt-7 inline-block bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
            >
              Back to Orders
            </Link>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  const orderDate = order.date
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
        : "Credit / Debit Card";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* HEADER */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <Link
              href="/orders"
              className="text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:text-[#c6a15b]"
            >
              ← Back to Orders
            </Link>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
                  LUXORA Order
                </p>

                <h1 className="mt-3 font-serif text-3xl text-[#111111] sm:text-4xl">
                  Order Details
                </h1>

                <p className="mt-3 text-xs text-[#6b6258]">
                  Order ID:{" "}
                  <span className="font-semibold text-[#111111]">
                    {order.id}
                  </span>
                </p>

              </div>

              <span className="w-fit border border-green-200 bg-green-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                {order.status || "Order Placed"}
              </span>

            </div>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">

            {/* LEFT */}

            <div className="space-y-6">

              {/* ORDER INFO */}

              <section className="bg-white p-6 sm:p-8">

                <div className="grid gap-6 sm:grid-cols-3">

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                      Order Date
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {orderDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                      Payment Method
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {paymentLabel}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                      Order Status
                    </p>

                    <p className="mt-2 text-sm font-semibold text-green-700">
                      {order.status || "Order Placed"}
                    </p>
                  </div>

                </div>

              </section>

              {/* ITEMS */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Order Items
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Products
                  </h2>

                </div>

                <div className="divide-y divide-black/10">

                  {(order.items || []).map((item, index) => (

                    <div
                      key={`${item.id}-${index}`}
                      className="flex gap-4 py-6"
                    >

                      <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-[#eee4d6]">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[#999999]">
                            No Image
                          </div>
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="text-sm font-semibold">
                          {item.name}
                        </h3>

                        {item.category && (
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-[#6b6258]">
                            {item.category}
                          </p>
                        )}

                        <p className="mt-3 text-xs text-[#6b6258]">
                          Quantity: {item.quantity || 1}
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          ₹
                          {Number(item.price || 0).toLocaleString(
                            "en-IN"
                          )}
                          {" "}each
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-sm font-semibold">
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </section>

              {/* DELIVERY ADDRESS */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Delivery
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Shipping Address
                  </h2>

                </div>

                <div className="mt-6">

                  <p className="text-sm font-semibold">
                    {order.customer?.name || "Customer"}
                  </p>

                  {order.customer?.phone && (
                    <p className="mt-1 text-xs text-[#6b6258]">
                      {order.customer.phone}
                    </p>
                  )}

                  <p className="mt-4 max-w-xl text-sm leading-6 text-[#6b6258]">
                    {order.address?.address}
                    {order.address?.city
                      ? `, ${order.address.city}`
                      : ""}
                    {order.address?.state
                      ? `, ${order.address.state}`
                      : ""}
                    {order.address?.pincode
                      ? ` - ${order.address.pincode}`
                      : ""}
                  </p>

                  {order.address?.type && (
                    <span className="mt-4 inline-block border border-black/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                      {order.address.type}
                    </span>
                  )}

                </div>

              </section>

            </div>

            {/* RIGHT */}

            <aside>

              <div className="sticky top-24 space-y-5">

                {/* SUMMARY */}

                <section className="bg-white p-6 sm:p-7">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Payment
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Order Summary
                  </h2>

                  <div className="mt-6 space-y-4 border-y border-black/10 py-5">

                    <div className="flex justify-between text-sm">

                      <span className="text-[#6b6258]">
                        Subtotal
                      </span>

                      <span>
                        ₹
                        {Number(order.subtotal || 0).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-[#6b6258]">
                        Delivery
                      </span>

                      <span>
                        {Number(order.delivery || 0) === 0
                          ? "FREE"
                          : `₹${Number(
                              order.delivery
                            ).toLocaleString("en-IN")}`}
                      </span>

                    </div>

                  </div>

                  <div className="mt-5 flex items-center justify-between">

                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-xl font-semibold">
                      ₹
                      {Number(order.total || 0).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="mt-6 bg-[#faf7f2] p-4">

                    <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                      Payment Method
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {paymentLabel}
                    </p>

                  </div>

                </section>

                {/* ACTIONS */}

                <section className="bg-white p-6 sm:p-7">

                  <Link
                    href="/products"
                    className="block w-full bg-[#111111] px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
                  >
                    Continue Shopping
                  </Link>

                  <Link
                    href="/orders"
                    className="mt-3 block w-full border border-black/15 px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-[#c6a15b]"
                  >
                    View All Orders
                  </Link>

                </section>

              </div>

            </aside>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}