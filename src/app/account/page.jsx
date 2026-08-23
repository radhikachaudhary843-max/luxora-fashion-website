
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import {
  getCurrentUser,
  updateProfile,
  logout,
} from "@/services/authService";

import { getCart } from "@/services/cartService";

import { getWishlist } from "@/services/wishlistService";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    cart: 0,
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    const userData = {
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
    };

    setUser(userData);
    setForm(userData);

    const savedOrders =
      JSON.parse(localStorage.getItem("luxora_orders") || "[]");

    const wishlistItems = getWishlist();
    const cartItems = getCart();

    const cartCount = cartItems.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );

    setStats({
      orders: savedOrders.length,
      wishlist: wishlistItems.length,
      cart: cartCount,
    });

    setLoading(false);
  }, [router]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      return;
    }

    const result = updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });

    if (!result.success) {
      return;
    }

    const updatedUser = {
      name: result.user.name || "",
      email: result.user.email || "",
      phone: result.user.phone || "",
    };

    setUser(updatedUser);
    setForm(updatedUser);
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6]">
          <p className="text-sm text-[#6b6258]">
            Loading profile...
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
              My Profile
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Manage your account, orders and preferences.
            </p>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[240px_1fr]">

            {/* SIDEBAR */}

            <aside>

              <div className="bg-white p-5">

                <div className="flex items-center gap-4 border-b border-black/10 pb-5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] font-serif text-xl text-white">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : "L"}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold">
                      {user.name || "LUXORA Customer"}
                    </p>

                    <p className="truncate text-xs text-[#6b6258]">
                      {user.email || "Welcome to LUXORA"}
                    </p>

                  </div>

                </div>

                <nav className="mt-5 space-y-1">

                  <Link
                    href="/account/profile"
                    className="block bg-[#111111] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:bg-[#f5efe6] hover:text-[#111111]"
                  >
                    <span>My Orders</span>

                    <span className="text-[10px]">
                      {stats.orders}
                    </span>
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:bg-[#f5efe6] hover:text-[#111111]"
                  >
                    <span>Wishlist</span>

                    <span className="text-[10px]">
                      {stats.wishlist}
                    </span>
                  </Link>

                  <Link
                    href="/cart"
                    className="flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:bg-[#f5efe6] hover:text-[#111111]"
                  >
                    <span>Shopping Cart</span>

                    <span className="text-[10px]">
                      {stats.cart}
                    </span>
                  </Link>

                </nav>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-5 w-full border border-red-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>

              </div>

            </aside>

            {/* MAIN */}

            <div className="space-y-6">

              {/* PROFILE */}

              <section className="bg-white p-6 sm:p-8">

                <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Personal Information
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      Account Details
                    </h2>

                  </div>

                  {!editing && (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                    >
                      Edit Profile
                    </button>
                  )}

                </div>

                {saved && (
                  <div className="mt-5 bg-green-50 px-4 py-3 text-xs text-green-700">
                    Profile updated successfully.
                  </div>
                )}

                {editing ? (

                  <form
                    onSubmit={handleSave}
                    className="mt-7 space-y-5"
                  >

                    <div>

                      <label className="mb-2 block text-xs font-semibold">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-semibold">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-semibold">
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                      />

                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                      <button
                        type="submit"
                        className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForm(user);
                          setEditing(false);
                        }}
                        className="border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                      >
                        Cancel
                      </button>

                    </div>

                  </form>

                ) : (

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">

                    <div className="border border-black/10 bg-[#faf7f2] p-5">

                      <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                        Full Name
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {user.name || "Not added"}
                      </p>

                    </div>

                    <div className="border border-black/10 bg-[#faf7f2] p-5">

                      <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm font-medium">
                        {user.email || "Not added"}
                      </p>

                    </div>

                    <div className="border border-black/10 bg-[#faf7f2] p-5">

                      <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                        Mobile
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {user.phone || "Not added"}
                      </p>

                    </div>

                  </div>

                )}

              </section>

              {/* QUICK LINKS */}

              <section className="grid gap-4 sm:grid-cols-3">

                <Link
                  href="/orders"
                  className="group bg-white p-6 transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">

                    <p className="text-2xl">📦</p>

                    <span className="text-xs font-semibold text-[#c6a15b]">
                      {stats.orders}
                    </span>

                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    My Orders
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    View and track your purchases.
                  </p>

                </Link>

                <Link
                  href="/wishlist"
                  className="group bg-white p-6 transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">

                    <p className="text-2xl">♡</p>

                    <span className="text-xs font-semibold text-[#c6a15b]">
                      {stats.wishlist}
                    </span>

                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    Wishlist
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    View your saved favourites.
                  </p>

                </Link>

                <Link
                  href="/cart"
                  className="group bg-white p-6 transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">

                    <p className="text-2xl">🛒</p>

                    <span className="text-xs font-semibold text-[#c6a15b]">
                      {stats.cart}
                    </span>

                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    Shopping Cart
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    Review your selected products.
                  </p>

                </Link>

              </section>

              {/* ADDRESS */}

              <section className="bg-white p-6 sm:p-8">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Delivery
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Address Management
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6b6258]">
                  Your delivery address is collected securely during
                  checkout. You can update it whenever you place a new order.
                </p>

                <Link
                  href="/checkout"
                  className="mt-6 inline-block bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                >
                  Go to Checkout
                </Link>

              </section>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
