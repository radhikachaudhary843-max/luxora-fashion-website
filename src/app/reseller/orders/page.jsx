
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import { getCurrentUser } from "@/services/authService";

const ORDERS_KEY = "luxora_orders";
const PRODUCTS_KEY = "luxora_reseller_products";

export default function ResellerOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "reseller") {
      router.replace("/");
      return;
    }

    setUser(currentUser);

    try {
      const allOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
      );

      const allProducts = JSON.parse(
        localStorage.getItem(PRODUCTS_KEY) || "[]"
      );

      const myProductIds = new Set(
        Array.isArray(allProducts)
          ? allProducts
              .filter(
                (product) =>
                  product.resellerId === currentUser.id
              )
              .map((product) => String(product.id))
          : []
      );

      const resellerOrders = [];

      if (Array.isArray(allOrders)) {
        allOrders.forEach((order) => {
          const resellerItems = (order.items || []).filter(
            (item) =>
              item.resellerId === currentUser.id ||
              myProductIds.has(String(item.id))
          );

          if (resellerItems.length > 0) {
            const resellerTotal = resellerItems.reduce(
              (sum, item) =>
                sum +
                Number(item.price || 0) *
                  Number(item.quantity || 1),
              0
            );

            resellerOrders.push({
              ...order,
              items: resellerItems,
              resellerTotal,
            });
          }
        });
      }

      setOrders(resellerOrders);
    } catch (error) {
      console.error(
        "Failed to load reseller orders:",
        error
      );

      setOrders([]);
    }

    setLoading(false);
  }, [router]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const pendingOrders = orders.filter((order) => {
      const status = String(
        order.status || ""
      ).toLowerCase();

      return [
        "pending",
        "placed",
        "order placed",
        "processing",
      ].includes(status);
    }).length;

    const completedOrders = orders.filter((order) => {
      const status = String(
        order.status || ""
      ).toLowerCase();

      return [
        "delivered",
        "completed",
        "complete",
      ].includes(status);
    }).length;

    const earnings = orders.reduce(
      (sum, order) =>
        sum + Number(order.resellerTotal || 0),
      0
    );

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      earnings,
    };
  }, [orders]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6258]">
            Loading Reseller Orders...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* HEADER */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <Link
              href="/reseller"
              className="text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:text-[#c6a15b]"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA Seller Centre
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              View orders containing your products and track your sales.
            </p>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-7xl">

            {/* STATS */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="bg-white p-6">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                  Total Orders
                </p>

                <p className="mt-2 font-serif text-3xl text-[#111111]">
                  {stats.totalOrders}
                </p>

                <p className="mt-2 text-xs text-[#6b6258]">
                  Orders containing your products
                </p>

              </div>

              <div className="bg-white p-6">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                  Pending Orders
                </p>

                <p className="mt-2 font-serif text-3xl text-orange-600">
                  {stats.pendingOrders}
                </p>

                <p className="mt-2 text-xs text-[#6b6258]">
                  Need attention
                </p>

              </div>

              <div className="bg-white p-6">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                  Completed
                </p>

                <p className="mt-2 font-serif text-3xl text-green-700">
                  {stats.completedOrders}
                </p>

                <p className="mt-2 text-xs text-[#6b6258]">
                  Successfully delivered
                </p>

              </div>

              <div className="bg-white p-6">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                  Sales Value
                </p>

                <p className="mt-2 font-serif text-3xl text-[#111111]">
                  ₹
                  {stats.earnings.toLocaleString("en-IN")}
                </p>

                <p className="mt-2 text-xs text-[#6b6258]">
                  Value of your products sold
                </p>

              </div>

            </div>

            {/* EMPTY */}

            {orders.length === 0 ? (

              <div className="bg-white px-6 py-20 text-center">

                <div className="text-5xl">
                  📦
                </div>

                <h2 className="mt-6 font-serif text-3xl text-[#111111]">
                  No Orders Yet
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b6258]">
                  Orders containing your products will appear here
                  once customers start purchasing them.
                </p>

                <Link
                  href="/reseller/products"
                  className="mt-7 inline-block bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
                >
                  Manage Products
                </Link>

              </div>

            ) : (

              /* ORDERS */

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
                              ? new Date(
                                  order.date
                                ).toLocaleDateString(
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

                      <span className="w-fit border border-green-200 bg-green-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                        {order.status || "Order Placed"}
                      </span>

                    </div>

                    {/* CUSTOMER */}

                    <div className="border-b border-black/10 bg-[#faf7f2] p-5 sm:p-6">

                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                            Customer
                          </p>

                          <p className="mt-2 text-sm font-semibold">
                            {order.customer?.name ||
                              "Customer"}
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                            Delivery City
                          </p>

                          <p className="mt-2 text-sm font-semibold">
                            {order.address?.city ||
                              "—"}
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                            Pincode
                          </p>

                          <p className="mt-2 text-sm font-semibold">
                            {order.address?.pincode ||
                              "—"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* PRODUCTS */}

                    <div className="p-5 sm:p-6">

                      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                        Your Products
                      </p>

                      <div className="space-y-5">

                        {order.items.map(
                          (item, index) => (

                            <div
                              key={`${item.id}-${index}`}
                              className="flex gap-4 border-b border-black/10 pb-5 last:border-0 last:pb-0"
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

                                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#6b6258]">

                                  <span>
                                    Qty:{" "}
                                    <strong className="text-[#111111]">
                                      {item.quantity ||
                                        1}
                                    </strong>
                                  </span>

                                  <span>
                                    Price: ₹
                                    {Number(
                                      item.price || 0
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>

                                </div>

                                <p className="mt-3 text-sm font-semibold">
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

                            </div>

                          )
                        )}

                      </div>

                    </div>

                    {/* FOOTER */}

                    <div className="border-t border-black/10 p-5 sm:p-6">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                            Your Sales Value
                          </p>

                          <p className="mt-1 text-xl font-semibold text-[#111111]">
                            ₹
                            {Number(
                              order.resellerTotal || 0
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                        <Link
                          href={`/orders/${order.id}`}
                          className="w-fit border border-black/15 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider transition hover:border-[#c6a15b] hover:bg-[#faf7f2]"
                        >
                          View Order Details →
                        </Link>

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

