"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  getCurrentUser,
  getUsers,
  logout,
} from "@/services/authService";

import {
  getAdminProducts,
} from "@/services/adminProductService";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    customers: 0,
    resellers: 0,
    products: 0,
    orders: 0,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      router.replace("/");
      return;
    }

    setUser(currentUser);

    /* =====================================================
       LOAD ADMIN STATS
    ===================================================== */

    const users = getUsers();
    const products = getAdminProducts();

    const customers = users.filter(
      (item) =>
        String(item.role || "").toLowerCase() ===
        "customer"
    );

    const resellers = users.filter(
      (item) =>
        String(item.role || "").toLowerCase() ===
        "reseller"
    );

    /* =====================================================
       ORDERS
       Abhi orders ka system nahi bana hai.
       Baad me real order count yahan connect hoga.
    ===================================================== */

    let orders = [];

    try {
      const savedOrders =
        localStorage.getItem("luxora_orders");

      if (savedOrders) {
        const parsedOrders =
          JSON.parse(savedOrders);

        if (Array.isArray(parsedOrders)) {
          orders = parsedOrders;
        }
      }
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error
      );
    }

    setStats({
      customers: customers.length,
      resellers: resellers.length,
      products: products.length,
      orders: orders.length,
    });
  }, [router]);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5efe6]">
        <p className="text-sm text-[#6b6258]">
          Loading Admin Dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5efe6]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-black/10 bg-white">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6">

          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.2em] text-[#111111]"
          >
            LUXORA
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">

            <div className="hidden text-right sm:block">

              <p className="text-xs font-semibold uppercase tracking-wider text-[#999999]">
                Logged in as
              </p>

              <p className="text-sm font-medium text-[#111111]">
                {user.name}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#111111] transition hover:border-[#111111] hover:bg-[#111111] hover:text-white"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
            Admin Panel
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#111111] sm:text-4xl">
            Welcome, {user.name}
          </h1>

          <p className="mt-2 text-sm text-[#6b6258]">
            Manage your LUXORA store from the admin dashboard.
          </p>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* CUSTOMERS */}

          <div className="bg-white p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#999999]">
              Total Customers
            </p>

            <p className="mt-3 font-serif text-3xl text-[#111111]">
              {stats.customers}
            </p>

            <Link
              href="/admin/customers"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-[#c6a15b] hover:text-[#111111]"
            >
              Manage →
            </Link>

          </div>

          {/* RESELLERS */}

          <div className="bg-white p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#999999]">
              Total Resellers
            </p>

            <p className="mt-3 font-serif text-3xl text-[#111111]">
              {stats.resellers}
            </p>

            <Link
              href="/admin/resellers"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-[#c6a15b] hover:text-[#111111]"
            >
              Manage →
            </Link>

          </div>

          {/* PRODUCTS */}

          <div className="bg-white p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#999999]">
              Total Products
            </p>

            <p className="mt-3 font-serif text-3xl text-[#111111]">
              {stats.products}
            </p>

            <Link
              href="/admin/products"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-[#c6a15b] hover:text-[#111111]"
            >
              Manage →
            </Link>

          </div>

          {/* ORDERS */}

          <div className="bg-white p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#999999]">
              Total Orders
            </p>

            <p className="mt-3 font-serif text-3xl text-[#111111]">
              {stats.orders}
            </p>

            <Link
              href="/admin/orders"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-[#c6a15b] hover:text-[#111111]"
            >
              Manage →
            </Link>

          </div>

        </section>

        {/* =================================================
            ADMIN MENU
        ================================================= */}

        <section className="mt-10">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                Control Center
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[#111111]">
                Store Management
              </h2>
            </div>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* PRODUCTS */}

            <Link
              href="/admin/products"
              className="group bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <p className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b]">
                Products
              </p>

              <h3 className="mt-2 font-serif text-xl text-[#111111]">
                Manage Products
              </h3>

              <p className="mt-2 text-sm text-[#6b6258]">
                Add, edit, delete and manage LUXORA products.
              </p>

              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Open →
              </span>

            </Link>

            {/* ORDERS */}

            <Link
              href="/admin/orders"
              className="group bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <p className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b]">
                Orders
              </p>

              <h3 className="mt-2 font-serif text-xl text-[#111111]">
                Manage Orders
              </h3>

              <p className="mt-2 text-sm text-[#6b6258]">
                View orders, update status and manage customer purchases.
              </p>

              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Open →
              </span>

            </Link>

            {/* CUSTOMERS */}

            <Link
              href="/admin/customers"
              className="group bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <p className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b]">
                Customers
              </p>

              <h3 className="mt-2 font-serif text-xl text-[#111111]">
                Manage Customers
              </h3>

              <p className="mt-2 text-sm text-[#6b6258]">
                View customer accounts and manage customer information.
              </p>

              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Open →
              </span>

            </Link>

            {/* RESELLERS */}

            <Link
              href="/admin/resellers"
              className="group bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <p className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b]">
                Resellers
              </p>

              <h3 className="mt-2 font-serif text-xl text-[#111111]">
                Manage Resellers
              </h3>

              <p className="mt-2 text-sm text-[#6b6258]">
                View and manage reseller accounts and business details.
              </p>

              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Open →
              </span>

            </Link>

            {/* CATEGORIES */}

            <Link
              href="/admin/categories"
              className="group bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <p className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b]">
                Categories
              </p>

              <h3 className="mt-2 font-serif text-xl text-[#111111]">
                Manage Categories
              </h3>

              <p className="mt-2 text-sm text-[#6b6258]">
                Create, edit and organize your store categories.
              </p>

              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Open →
              </span>

            </Link>

            {/* STORE */}

            <Link
              href="/"
              className="group bg-[#111111] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <p className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b]">
                Store
              </p>

              <h3 className="mt-2 font-serif text-xl text-white">
                View LUXORA Store
              </h3>

              <p className="mt-2 text-sm text-white/60">
                Open the customer-facing website.
              </p>

              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-white">
                Open Store →
              </span>

            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}