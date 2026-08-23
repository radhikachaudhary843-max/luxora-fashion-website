"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/services/authService";

import {
  getAdminOrders,
  updateAdminOrderStatus,
  deleteAdminOrder,
} from "@/services/adminOrderService";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatStatus(status) {
  if (!status) return "Pending";

  return String(status)
    .charAt(0)
    .toUpperCase() +
    String(status)
      .slice(1)
      .toLowerCase();
}

function formatDate(date) {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "—";
  }
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN"
  )}`;
}

export default function AdminOrdersPage() {
  const router = useRouter();

  const [user, setUser] =
    useState(null);

  const [orders, setOrders] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    const currentUser =
      getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      router.replace("/");
      return;
    }

    setUser(currentUser);
    loadOrders();
  }, [router]);

  const loadOrders = () => {
    setOrders(
      getAdminOrders()
    );
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredOrders =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return orders.filter(
        (order) => {
          const orderId =
            String(
              order.id || ""
            ).toLowerCase();

          const customerName =
            String(
              order.customerName ||
                order.userName ||
                order.customer?.name ||
                ""
            ).toLowerCase();

          const customerEmail =
            String(
              order.customerEmail ||
                order.userEmail ||
                order.customer?.email ||
                ""
            ).toLowerCase();

          const matchesSearch =
            !query ||
            orderId.includes(query) ||
            customerName.includes(query) ||
            customerEmail.includes(query);

          const currentStatus =
            String(
              order.status ||
                "pending"
            ).toLowerCase();

          const matchesStatus =
            statusFilter === "all" ||
            currentStatus ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      orders,
      search,
      statusFilter,
    ]);

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const handleStatusChange = (
    orderId,
    status
  ) => {
    const result =
      updateAdminOrderStatus(
        orderId,
        status
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadOrders();

    if (
      selectedOrder?.id === orderId
    ) {
      setSelectedOrder(
        result.order
      );
    }

    setSuccess(
      "Order status updated."
    );

    setTimeout(
      () => setSuccess(""),
      1800
    );
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = (
    order
  ) => {
    const confirmed =
      window.confirm(
        `Delete order "${order.id}"?`
      );

    if (!confirmed) return;

    const result =
      deleteAdminOrder(
        order.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadOrders();

    if (
      selectedOrder?.id ===
      order.id
    ) {
      setSelectedOrder(null);
    }

    setSuccess(
      "Order deleted successfully."
    );

    setTimeout(
      () => setSuccess(""),
      1800
    );
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "luxora_current_user"
    );

    router.replace("/login");
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5efe6]">
        <p className="text-sm text-[#6b6258]">
          Loading Orders...
        </p>
      </main>
    );
  }

  /* =====================================================
     STATS
  ===================================================== */

  const pending =
    orders.filter(
      (order) =>
        String(
          order.status ||
            "pending"
        ).toLowerCase() ===
        "pending"
    ).length;

  const processing =
    orders.filter((order) =>
      [
        "confirmed",
        "processing",
      ].includes(
        String(
          order.status || ""
        ).toLowerCase()
      )
    ).length;

  const shipped =
    orders.filter(
      (order) =>
        String(
          order.status || ""
        ).toLowerCase() ===
        "shipped"
    ).length;

  const delivered =
    orders.filter(
      (order) =>
        String(
          order.status || ""
        ).toLowerCase() ===
        "delivered"
    ).length;

  return (
    <main className="min-h-screen bg-[#f5efe6]">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-white">

        <div className="flex items-center justify-between px-4 py-5 sm:px-6">

          <div className="flex items-center gap-4">

            <Link
              href="/admin"
              className="text-sm text-[#6b6258] hover:text-[#111111]"
            >
              ← Dashboard
            </Link>

            <span className="hidden h-5 w-px bg-black/10 sm:block" />

            <Link
              href="/"
              className="font-serif text-xl tracking-[0.2em] text-[#111111]"
            >
              LUXORA
            </Link>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-[10px] uppercase tracking-wider text-[#999999]">
                Admin
              </p>

              <p className="text-sm font-medium text-[#111111]">
                {user.name}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* TITLE */}

        <section className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
            Admin Panel
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#111111] sm:text-4xl">
            Orders
          </h1>

          <p className="mt-2 text-sm text-[#6b6258]">
            View and manage customer orders.
          </p>

        </section>

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Pending
            </p>
            <p className="mt-2 font-serif text-3xl">
              {pending}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Processing
            </p>
            <p className="mt-2 font-serif text-3xl">
              {processing}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Shipped
            </p>
            <p className="mt-2 font-serif text-3xl">
              {shipped}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Delivered
            </p>
            <p className="mt-2 font-serif text-3xl">
              {delivered}
            </p>
          </div>

        </section>

        {/* MESSAGES */}

        {success && (
          <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FILTERS */}

        <section className="mt-8 bg-white p-4 shadow-sm">

          <div className="grid gap-3 md:grid-cols-2">

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search order ID, customer name or email..."
              className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            >

              <option value="all">
                All Orders
              </option>

              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(
                      status
                    )}
                  </option>
                )
              )}

            </select>

          </div>

        </section>

        {/* ORDERS */}

        <section className="mt-6">

          {filteredOrders.length ===
          0 ? (

            <div className="bg-white px-6 py-16 text-center shadow-sm">

              <p className="font-serif text-2xl text-[#111111]">
                No Orders Found
              </p>

              <p className="mt-2 text-sm text-[#6b6258]">
                Customer orders will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto bg-white shadow-sm">

              <table className="w-full min-w-[850px]">

                <thead className="border-b border-black/10 bg-[#faf8f4]">

                  <tr>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                      Order
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                      Total
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredOrders.map(
                    (order) => {

                      const customerName =
                        order.customerName ||
                        order.userName ||
                        order.customer?.name ||
                        "Customer";

                      const customerEmail =
                        order.customerEmail ||
                        order.userEmail ||
                        order.customer?.email ||
                        "";

                      const total =
                        order.total ??
                        order.totalAmount ??
                        order.grandTotal ??
                        0;

                      const status =
                        String(
                          order.status ||
                            "pending"
                        ).toLowerCase();

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-black/5 last:border-0"
                        >

                          <td className="px-5 py-5">

                            <p className="font-semibold text-[#111111]">
                              {order.id}
                            </p>

                            <p className="mt-1 text-xs text-[#999999]">
                              {order.items?.length ||
                                0}{" "}
                              item(s)
                            </p>

                          </td>

                          <td className="px-5 py-5">

                            <p className="text-sm font-medium text-[#111111]">
                              {customerName}
                            </p>

                            <p className="mt-1 text-xs text-[#999999]">
                              {customerEmail}
                            </p>

                          </td>

                          <td className="px-5 py-5 text-sm text-[#6b6258]">
                            {formatDate(
                              order.createdAt ||
                                order.date
                            )}
                          </td>

                          <td className="px-5 py-5 text-sm font-semibold text-[#111111]">
                            {formatCurrency(
                              total
                            )}
                          </td>

                          <td className="px-5 py-5">

                            <select
                              value={status}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.id,
                                  e.target.value
                                )
                              }
                              className="border border-black/15 bg-white px-3 py-2 text-xs outline-none focus:border-[#c6a15b]"
                            >

                              {STATUS_OPTIONS.map(
                                (option) => (
                                  <option
                                    key={option}
                                    value={option}
                                  >
                                    {formatStatus(
                                      option
                                    )}
                                  </option>
                                )
                              )}

                            </select>

                          </td>

                          <td className="px-5 py-5">

                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  setSelectedOrder(
                                    order
                                  )
                                }
                                className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:border-[#111111]"
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    order
                                  )
                                }
                                className="border border-red-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white shadow-xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Order Details
                </p>

                <h2 className="mt-1 font-serif text-xl text-[#111111]">
                  {selectedOrder.id}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="text-2xl text-[#6b6258] hover:text-[#111111]"
              >
                ×
              </button>

            </div>

            <div className="space-y-6 p-5 sm:p-6">

              {/* CUSTOMER */}

              <div>

                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                  Customer
                </p>

                <div className="border border-black/10 p-4">

                  <p className="font-medium text-[#111111]">
                    {selectedOrder.customerName ||
                      selectedOrder.userName ||
                      selectedOrder.customer?.name ||
                      "Customer"}
                  </p>

                  <p className="mt-1 text-sm text-[#6b6258]">
                    {selectedOrder.customerEmail ||
                      selectedOrder.userEmail ||
                      selectedOrder.customer?.email ||
                      ""}
                  </p>

                </div>

              </div>

              {/* ITEMS */}

              <div>

                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                  Items
                </p>

                <div className="divide-y divide-black/10 border border-black/10">

                  {Array.isArray(
                    selectedOrder.items
                  ) &&
                    selectedOrder.items.map(
                      (item, index) => (
                        <div
                          key={
                            item.id ||
                            item.productId ||
                            index
                          }
                          className="flex items-center justify-between gap-4 p-4"
                        >

                          <div>

                            <p className="text-sm font-medium text-[#111111]">
                              {item.name ||
                                item.productName ||
                                "Product"}
                            </p>

                            <p className="mt-1 text-xs text-[#999999]">
                              Qty:{" "}
                              {item.quantity ||
                                1}
                            </p>

                          </div>

                          <p className="text-sm font-semibold text-[#111111]">
                            {formatCurrency(
                              item.total ??
                                Number(
                                  item.price ||
                                    0
                                ) *
                                  Number(
                                    item.quantity ||
                                      1
                                  )
                            )}
                          </p>

                        </div>
                      )
                    )}

                  {(!selectedOrder.items ||
                    selectedOrder.items
                      .length === 0) && (
                    <p className="p-4 text-sm text-[#999999]">
                      No item details available.
                    </p>
                  )}

                </div>

              </div>

              {/* TOTAL */}

              <div className="flex items-center justify-between border-t border-black/10 pt-5">

                <span className="text-xs font-semibold uppercase tracking-wider text-[#999999]">
                  Order Total
                </span>

                <span className="font-serif text-2xl text-[#111111]">
                  {formatCurrency(
                    selectedOrder.total ??
                      selectedOrder.totalAmount ??
                      selectedOrder.grandTotal ??
                      0
                  )}
                </span>

              </div>

              {/* STATUS */}

              <div>

                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
                  Update Status
                </label>

                <select
                  value={String(
                    selectedOrder.status ||
                      "pending"
                  ).toLowerCase()}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder.id,
                      e.target.value
                    )
                  }
                  className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                >

                  {STATUS_OPTIONS.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {formatStatus(
                          status
                        )}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}