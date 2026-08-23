
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import { getCurrentUser, logout } from "@/services/authService";

const RESELLER_PRODUCTS_KEY = "luxora_reseller_products";

export default function ResellerPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const allProducts = JSON.parse(
        localStorage.getItem(RESELLER_PRODUCTS_KEY) || "[]"
      );

      const myProducts = Array.isArray(allProducts)
        ? allProducts.filter(
            (product) =>
              product.resellerId === currentUser.id
          )
        : [];

      setProducts(myProducts);
    } catch (error) {
      console.error(
        "Failed to load reseller products:",
        error
      );

      setProducts([]);
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    logout();

    window.dispatchEvent(new Event("authUpdated"));

    router.push("/login");
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6258]">
            Loading Reseller Dashboard...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) =>
      product.status !== "inactive"
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) <= 0
  ).length;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* HEADER */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA Seller Centre
            </p>

            <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <h1 className="font-serif text-4xl text-[#111111] sm:text-5xl">
                  Reseller Dashboard
                </h1>

                <p className="mt-3 text-sm text-[#6b6258]">
                  Welcome back, {user.name || "Reseller"}.
                </p>

              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-fit border border-red-200 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>

            </div>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-7xl space-y-8">

            {/* WELCOME CARD */}

            <section className="bg-[#111111] p-6 text-white sm:p-8">

              <div className="max-w-2xl">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Reseller Account
                </p>

                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                  Sell your products with LUXORA.
                </h2>

                <p className="mt-4 text-sm leading-6 text-white/70">
                  Add your products, manage your listings and grow your
                  business through the LUXORA marketplace.
                </p>

                <Link
                  href="/reseller/products/add"
                  className="mt-6 inline-block bg-[#c6a15b] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#111111]"
                >
                  + Add New Product
                </Link>

              </div>

            </section>

            {/* STATS */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* TOTAL */}

              <div className="bg-white p-6">

                <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                  Total Products
                </p>

                <p className="mt-3 font-serif text-3xl text-[#111111]">
                  {totalProducts}
                </p>

                <p className="mt-2 text-xs text-[#6b6258]">
                  Products listed
                </p>

              </div>

              {/* ACTIVE */}

              <div className="bg-white p-6">

                <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                  Active Products
                </p>

                <p className="mt-3 font-serif text-3xl text-green-700">
                  {activeProducts}
                </p>

                <p className="mt-2 text-xs text-[#6b6258]">
                  Currently visible
                </p>

              </div>

              {/* OUT OF STOCK */}

              <div className="bg-white p-6">

                <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                  Out of Stock
                </p>

                <p className="mt-3 font-serif text-3xl text-red-600">
                  {outOfStockProducts}
                </p>

                <p className="mt-2 text-xs text-[#6b6258]">
                  Need restocking
                </p>

              </div>

              {/* EARNINGS */}

              <div className="bg-white p-6">

                <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                  Earnings
                </p>

                <p className="mt-3 font-serif text-3xl text-[#111111]">
                  ₹0
                </p>

                <p className="mt-2 text-xs text-[#6b6258]">
                  Total earnings
                </p>

              </div>

            </div>

            {/* MAIN GRID */}

            <div className="grid gap-6 lg:grid-cols-3">

              {/* PROFILE */}

              <section className="bg-white p-6 sm:p-8 lg:col-span-2">

                <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Seller Information
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      Business Profile
                    </h2>

                  </div>

                  <Link
                    href="/reseller/profile"
                    className="w-fit border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                  >
                    Edit Profile
                  </Link>

                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <div className="border border-black/10 bg-[#faf7f2] p-5">

                    <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                      Seller Name
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {user.name || "Not added"}
                    </p>

                  </div>

                  <div className="border border-black/10 bg-[#faf7f2] p-5">

                    <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                      Email
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold">
                      {user.email || "Not added"}
                    </p>

                  </div>

                  <div className="border border-black/10 bg-[#faf7f2] p-5">

                    <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                      Business Name
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {user.businessName || "Not added"}
                    </p>

                  </div>

                  <div className="border border-black/10 bg-[#faf7f2] p-5">

                    <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                      Business Type
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {user.businessType || "Not added"}
                    </p>

                  </div>

                </div>

              </section>

              {/* QUICK ACTIONS */}

              <section className="bg-white p-6 sm:p-8">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Manage
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Quick Actions
                </h2>

                <div className="mt-6 space-y-3">

                  <Link
                    href="/reseller/products/add"
                    className="block bg-[#111111] px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                  >
                    + Add Product
                  </Link>

                  <Link
                    href="/reseller/products"
                    className="block border border-black/15 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                  >
                    My Products
                  </Link>

                  <Link
                    href="/reseller/orders"
                    className="block border border-black/15 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                  >
                    My Orders
                  </Link>

                  <Link
                    href="/reseller/profile"
                    className="block border border-black/15 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                  >
                    Seller Profile
                  </Link>

                </div>

              </section>

            </div>

            {/* PRODUCT MANAGEMENT */}

            <section className="bg-white p-6 sm:p-8">

              <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Marketplace
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Product Management
                  </h2>

                  <p className="mt-3 text-sm text-[#6b6258]">
                    Add and manage the products you want to sell on LUXORA.
                  </p>

                </div>

                <Link
                  href="/reseller/products"
                  className="w-fit border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                >
                  Manage Products
                </Link>

              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">

                <div className="border border-black/10 bg-[#faf7f2] p-6">

                  <div className="text-2xl">
                    📦
                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    Your Products
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    You currently have{" "}
                    <strong className="text-[#111111]">
                      {totalProducts}
                    </strong>{" "}
                    products listed on LUXORA.
                  </p>

                </div>

                <div className="border border-black/10 bg-[#faf7f2] p-6">

                  <div className="text-2xl">
                    ✦
                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    Add Products
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    Create new product listings with images, pricing and
                    details.
                  </p>

                </div>

                <div className="border border-black/10 bg-[#faf7f2] p-6">

                  <div className="text-2xl">
                    ₹
                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    Your Earnings
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    Track your sales and earnings from LUXORA orders.
                  </p>

                </div>

              </div>

            </section>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

