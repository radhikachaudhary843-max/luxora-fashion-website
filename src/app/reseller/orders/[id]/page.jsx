
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import { getCurrentUser } from "@/services/authService";

const ORDERS_KEY = "luxora_orders";
const PRODUCTS_KEY = "luxora_reseller_products";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    setUser(currentUser);

    const orderId = params?.id;

    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
      );

      const allOrders = Array.isArray(savedOrders)
        ? savedOrders
        : [];

      const foundOrder = allOrders.find(
        (item) =>
          String(item.id) === String(orderId)
      );

      if (!foundOrder) {
        setError("Order not found.");
        setLoading(false);
        return;
      }

      /*
       * --------------------------------------------------
       * ACCESS CONTROL
       * --------------------------------------------------
       *
       * Customer:
       * Can only view their own order.
       *
       * Reseller:
       * Can view an order only when it contains
       * at least one of their products.
       */

      if (currentUser.role === "reseller") {
        let allProducts = [];

        try {
          const savedProducts = JSON.parse(
            localStorage.getItem(PRODUCTS_KEY) || "[]"
          );

          allProducts = Array.isArray(savedProducts)
            ? savedProducts
            : [];
        } catch (productError) {
          console.error(
            "Failed to load reseller products:",
            productError
          );
        }

        const myProductIds = new Set(
          allProducts
            .filter(
              (product) =>
                String(product.resellerId) ===
                String(currentUser.id)
            )
            .map((product) =>
              String(product.id)
            )
        );

        const resellerItems = (
          foundOrder.items || []
        ).filter(
          (item) =>
            String(item.resellerId) ===
              String(currentUser.id) ||
            myProductIds.has(String(item.id))
        );

        if (resellerItems.length === 0) {
          setError(
            "You do not have access to this order."
          );
          setLoading(false);
          return;
        }

        /*
         * Reseller should only see their own products.
         */

        const resellerTotal =
          resellerItems.reduce(
            (sum, item) =>
              sum +
              Number(item.price || 0) *
                Number(item.quantity || 1),
            0
          );

        setOrder({
          ...foundOrder,
          items: resellerItems,
          resellerTotal,
          isResellerView: true,
        });
      } else {
        /*
         * Customer/Admin view.
         *
         * Customer can see their own order.
         * Admin can see any order.
         */

        const isOwner =
          String(foundOrder.userId) ===
          String(currentUser.id);

        const isAdmin =
          currentUser.role === "admin";

        if (!isOwner && !isAdmin) {
          setError(
            "You do not have access to this order."
          );
          setLoading(false);
          return;
        }

        setOrder({
          ...foundOrder,
          isResellerView: false,
        });
      }
    } catch (loadError) {
      console.error(
        "Failed to load order:",
        loadError
      );

      setError(
        "Unable to load order details."
      );
    }

    setLoading(false);
  }, [params, router]);

  const orderSubtotal = useMemo(() => {
    if (!order) {
      return 0;
    }

    if (order.isResellerView) {
      return Number(
        order.resellerTotal || 0
      );
    }

    if (
      typeof order.subtotal === "number"
    ) {
      return order.subtotal;
    }

    return (order.items || []).reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 1),
      0
    );
  }, [order]);

  const delivery = order?.isResellerView
    ? 0
    : Number(order?.delivery || 0);

  const displayedTotal = order?.isResellerView
    ? orderSubtotal
    : Number(
        order?.total ||
          orderSubtotal + delivery
      );

  const formattedDate = order?.date
    ? new Date(order.date).toLocaleString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      )
    : "—";

  const paymentLabel =
    order?.paymentMethod === "cod"
      ? "Cash on Delivery"
      : order?.paymentMethod === "upi"
        ? "UPI"
        : order?.paymentMethod === "card"
          ? "Credit / Debit Card"
          : "—";

  const status = order?.status || "Order Placed";

  const statusLower = String(
    status
  ).toLowerCase();

  const statusClass =
    statusLower.includes("deliver") ||
    statusLower.includes("complete")
      ? "border-green-200 bg-green-50 text-green-700"
      : statusLower.includes("cancel")
        ? "border-red-200 bg-red-50 text-red-700"
        : statusLower.includes("process")
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-orange-200 bg-orange-50 text-orange-700";

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6] px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6258]">
            Loading Order Details...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />

        <main className="min-h-[70vh] bg-[#f5efe6] px-6 py-20">
          <div className="mx-auto max-w-lg bg-white px-6 py-14 text-center">

            <div className="text-5xl">
              📦
            </div>

            <h1 className="mt-6 font-serif text-3xl text-[#111111]">
              Order Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6b6258]">
              {error ||
                "We couldn't find the order you're looking for."}
            </p>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-7 bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
            >
              Go Back
            </button>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* --------------------------------------------------
            HEADER
        -------------------------------------------------- */}

        <section className="border-b border-black/10 px-6 py-10 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <button
              type="button"
              onClick={() => router.back()}
              className="text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:text-[#c6a15b]"
            >
              ← Back
            </button>

            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
                  LUXORA
                </p>

                <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
                  Order Details
                </h1>

                <p className="mt-3 text-sm text-[#6b6258]">
                  Order #{order.id}
                </p>

              </div>

              <span
                className={`w-fit border px-4 py-2 text-[10px] font-semibold uppercase tracking-wider ${statusClass}`}
              >
                {status}
              </span>

            </div>

          </div>

        </section>

        {/* --------------------------------------------------
            CONTENT
        -------------------------------------------------- */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-7xl">

            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

              {/* ==================================================
                  LEFT
              ================================================== */}

              <div className="space-y-6">

                {/* ORDER INFO */}

                <section className="bg-white p-6 sm:p-8">

                  <div className="border-b border-black/10 pb-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Order Information
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                      Order Summary
                    </h2>

                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-3">

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                        Order ID
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                        Order Date
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {formattedDate}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                        Payment
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {paymentLabel}
                      </p>
                    </div>

                  </div>

                </section>

                {/* CUSTOMER */}

                <section className="bg-white p-6 sm:p-8">

                  <div className="border-b border-black/10 pb-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      {order.isResellerView
                        ? "Customer"
                        : "Delivery Information"}
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                      {order.isResellerView
                        ? "Customer Details"
                        : "Delivery Address"}
                    </h2>

                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                        Full Name
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {order.customer?.name ||
                          "Customer"}
                      </p>

                    </div>

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                        Mobile
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {order.customer?.phone ||
                          "—"}
                      </p>

                    </div>

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold">
                        {order.customer?.email ||
                          "—"}
                      </p>

                    </div>

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                        Address Type
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {order.address?.type ||
                          "Home"}
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 border-t border-black/10 pt-6">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                      Delivery Address
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#111111]">
                      {order.address?.address ||
                        "—"}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#6b6258]">
                      {order.address?.city ||
                        "—"}
                      ,{" "}
                      {order.address?.state ||
                        "—"}{" "}
                      -{" "}
                      {order.address?.pincode ||
                        "—"}
                    </p>

                  </div>

                </section>

                {/* PRODUCTS */}

                <section className="bg-white p-6 sm:p-8">

                  <div className="border-b border-black/10 pb-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      {order.isResellerView
                        ? "Your Products"
                        : "Order Items"}
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                      Products
                    </h2>

                  </div>

                  <div className="mt-6 space-y-6">

                    {(order.items || []).map(
                      (item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="flex gap-4 border-b border-black/10 pb-6 last:border-0 last:pb-0"
                        >

                          {/* IMAGE */}

                          <div className="h-28 w-20 flex-shrink-0 overflow-hidden bg-[#eee4d6] sm:h-32 sm:w-24">

                            {item.image ? (
                              <img
                                src={item.image}
                                alt={
                                  item.name ||
                                  "Product"
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-[#999999]">
                                No Image
                              </div>
                            )}

                          </div>

                          {/* DETAILS */}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                              <div>

                                <h3 className="text-sm font-semibold text-[#111111] sm:text-base">
                                  {item.name ||
                                    "Product"}
                                </h3>

                                {item.category && (
                                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#6b6258]">
                                    {item.category}
                                  </p>
                                )}

                                {item.brand && (
                                  <p className="mt-1 text-xs text-[#6b6258]">
                                    Brand:{" "}
                                    {item.brand}
                                  </p>
                                )}

                              </div>

                              <p className="text-sm font-semibold text-[#111111]">
                                ₹
                                {(
                                  Number(
                                    item.price || 0
                                  ) *
                                  Number(
                                    item.quantity ||
                                      1
                                  )
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#6b6258]">

                              <span>
                                Qty:{" "}
                                <strong className="text-[#111111]">
                                  {item.quantity ||
                                    1}
                                </strong>
                              </span>

                              <span>
                                Unit Price: ₹
                                {Number(
                                  item.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>

                            {order.isResellerView &&
                              item.resellerName && (
                                <p className="mt-3 text-[10px] uppercase tracking-wider text-[#c6a15b]">
                                  Seller:{" "}
                                  {
                                    item.resellerName
                                  }
                                </p>
                              )}

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </section>

              </div>

              {/* ==================================================
                  RIGHT
              ================================================== */}

              <aside>

                <div className="sticky top-24 space-y-6">

                  {/* PRICE SUMMARY */}

                  <section className="bg-white p-6 sm:p-7">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Payment
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                      Price Details
                    </h2>

                    <div className="mt-6 space-y-4 border-y border-black/10 py-5">

                      <div className="flex justify-between text-sm">

                        <span className="text-[#6b6258]">
                          {order.isResellerView
                            ? "Your Sales"
                            : "Subtotal"}
                        </span>

                        <span>
                          ₹
                          {orderSubtotal.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                      {!order.isResellerView && (
                        <div className="flex justify-between text-sm">

                          <span className="text-[#6b6258]">
                            Delivery
                          </span>

                          <span>
                            {delivery === 0
                              ? "FREE"
                              : `₹${delivery.toLocaleString(
                                  "en-IN"
                                )}`}
                          </span>

                        </div>
                      )}

                    </div>

                    <div className="mt-5 flex items-center justify-between">

                      <span className="font-semibold text-[#111111]">
                        {order.isResellerView
                          ? "Sales Value"
                          : "Total"}
                      </span>

                      <span className="text-xl font-semibold text-[#111111]">
                        ₹
                        {displayedTotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                  </section>

                  {/* STATUS */}

                  <section className="bg-white p-6 sm:p-7">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Order Status
                    </p>

                    <div className="mt-5">

                      <div
                        className={`border px-4 py-4 ${statusClass}`}
                      >

                        <p className="text-[10px] font-semibold uppercase tracking-wider">
                          Current Status
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {status}
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 space-y-3">

                      <div className="flex gap-3">

                        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#c6a15b]" />

                        <div>
                          <p className="text-xs font-semibold">
                            Order Placed
                          </p>

                          <p className="mt-1 text-[10px] text-[#6b6258]">
                            Your order has been
                            successfully placed.
                          </p>
                        </div>

                      </div>

                      <div className="flex gap-3">

                        <div
                          className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                            statusLower.includes(
                              "process"
                            ) ||
                            statusLower.includes(
                              "deliver"
                            ) ||
                            statusLower.includes(
                              "complete"
                            )
                              ? "bg-[#c6a15b]"
                              : "bg-black/15"
                          }`}
                        />

                        <div>
                          <p className="text-xs font-semibold">
                            Processing
                          </p>

                          <p className="mt-1 text-[10px] text-[#6b6258]">
                            Your order is being
                            prepared.
                          </p>
                        </div>

                      </div>

                      <div className="flex gap-3">

                        <div
                          className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                            statusLower.includes(
                              "deliver"
                            ) ||
                            statusLower.includes(
                              "complete"
                            )
                              ? "bg-green-600"
                              : "bg-black/15"
                          }`}
                        />

                        <div>
                          <p className="text-xs font-semibold">
                            Delivered
                          </p>

                          <p className="mt-1 text-[10px] text-[#6b6258]">
                            Order successfully
                            delivered.
                          </p>
                        </div>

                      </div>

                    </div>

                  </section>

                  {/* ACTIONS */}

                  <section className="bg-white p-6 sm:p-7">

                    <div className="space-y-3">

                      {user?.role === "reseller" ? (
                        <Link
                          href="/reseller/orders"
                          className="block w-full bg-[#111111] px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
                        >
                          Back to My Orders
                        </Link>
                      ) : (
                        <Link
                          href="/orders"
                          className="block w-full bg-[#111111] px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
                        >
                          My Orders
                        </Link>
                      )}

                      <Link
                        href="/products"
                        className="block w-full border border-black/15 px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#111111] transition hover:border-[#c6a15b] hover:bg-[#faf7f2]"
                      >
                        Continue Shopping
                      </Link>

                    </div>

                  </section>

                </div>

              </aside>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

