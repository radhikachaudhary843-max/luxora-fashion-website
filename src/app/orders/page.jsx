"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import { getCurrentUser } from "@/services/authService";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
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

      const userOrders = allOrders.filter(
        (order) => order.userId === currentUser.id
      );

      setOrders(userOrders);
    } catch {
      setOrders([]);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6258]">
            Loading Orders...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* HEADER */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA Account
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              View and track all your LUXORA purchases.
            </p>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-7xl">

            {/* EMPTY ORDERS */}

            {orders.length === 0 ? (

              <div className="mx-auto max-w-lg bg-white px-6 py-16 text-center">

                <div className="text-5xl">
                  📦
                </div>

                <h2 className="mt-6 font-serif text-3xl text-[#111111]">
                  No Orders Yet
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6b6258]">
                  You haven't placed any orders yet.
                  Start shopping and your orders will appear here.
                </p>

                <Link
                  href="/products"
                  className="mt-7 inline-block bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
                >
                  Start Shopping
                </Link>

              </div>

            ) : (

              <div className="space-y-6">

                {orders.map((order) => (

                  <article
                    key={order.id}
                    className="bg-white"
                  >

                    {/* ORDER HEADER */}

                    <div className="flex flex-col gap-4 border-b border-black/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

                      <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                            Order ID
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {order.id}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                            Order Date
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {order.date
                              ? new Date(order.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                            Payment
                          </p>

                          <p className="mt-1 text-xs font-semibold uppercase">
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : order.paymentMethod === "upi"
                                ? "UPI"
                                : "Card"}
                          </p>
                        </div>

                      </div>

                      {/* STATUS */}

                      <span className="w-fit border border-green-200 bg-green-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                        {order.status || "Order Placed"}
                      </span>

                    </div>

                    {/* PRODUCTS */}

                    <div className="p-5 sm:p-6">

                      <div className="space-y-5">

                        {(order.items || []).map((item, index) => (

                          <div
                            key={`${item.id}-${index}`}
                            className="flex gap-4"
                          >

                            {/* IMAGE */}

                            <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-[#eee4d6] sm:h-28 sm:w-24">

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

                            {/* DETAILS */}

                            <div className="min-w-0 flex-1">

                              <h3 className="text-sm font-semibold text-[#111111]">
                                {item.name}
                              </h3>

                              {item.category && (
                                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#6b6258]">
                                  {item.category}
                                </p>
                              )}

                              <p className="mt-2 text-xs text-[#6b6258]">
                                Qty: {item.quantity || 1}
                              </p>

                              <p className="mt-2 text-sm font-semibold">
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

                    </div>

                    {/* FOOTER */}

                    <div className="border-t border-black/10 bg-[#faf7f2] p-5 sm:p-6">

                      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">

                        {/* ADDRESS */}

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                            Delivered To
                          </p>

                          <p className="mt-2 text-sm font-medium">
                            {order.customer?.name || "Customer"}
                          </p>

                          <p className="mt-1 max-w-xl text-xs leading-5 text-[#6b6258]">
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

                        </div>

                        {/* TOTAL + DETAILS */}

                        <div className="lg:min-w-[220px] lg:text-right">

                          <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                            Order Total
                          </p>

                          <p className="mt-1 text-xl font-semibold text-[#111111]">
                            ₹
                            {Number(order.total || 0).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-[#6b6258]">
                            {order.items?.length || 0} item
                            {(order.items?.length || 0) !== 1
                              ? "s"
                              : ""}
                          </p>

                          {/* VIEW DETAILS */}

                          <Link
                            href={`/orders/${order.id}`}
                            className="mt-4 inline-block border border-black/15 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider transition hover:border-[#c6a15b] hover:bg-white"
                          >
                            View Order Details →
                          </Link>

                        </div>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}