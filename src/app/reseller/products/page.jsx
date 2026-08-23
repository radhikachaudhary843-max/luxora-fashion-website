"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import {
  getCurrentUser,
  getUsers,
} from "@/services/authService";

const RESELLER_PRODUCTS_KEY = "luxora_reseller_products";

export default function ResellerProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
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

    const users = getUsers();

    const reseller = users.find(
      (item) => item.id === currentUser.id
    );

    if (!reseller) {
      router.replace("/login");
      return;
    }

    setUser(reseller);

    try {
      const savedProducts = JSON.parse(
        localStorage.getItem(RESELLER_PRODUCTS_KEY) || "[]"
      );

      const myProducts = Array.isArray(savedProducts)
        ? savedProducts.filter(
            (product) => product.resellerId === currentUser.id
          )
        : [];

      setProducts(myProducts);
    } catch {
      setProducts([]);
    }

    setLoading(false);
  }, [router]);

  const handleDelete = (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const allProducts = JSON.parse(
        localStorage.getItem(RESELLER_PRODUCTS_KEY) || "[]"
      );

      const updatedProducts = allProducts.filter(
        (product) =>
          !(
            product.id === productId &&
            product.resellerId === user.id
          )
      );

      localStorage.setItem(
        RESELLER_PRODUCTS_KEY,
        JSON.stringify(updatedProducts)
      );

      setProducts(
        updatedProducts.filter(
          (product) => product.resellerId === user.id
        )
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6258]">
            Loading Products...
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

            <Link
              href="/reseller"
              className="text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:text-[#c6a15b]"
            >
              ← Back to Dashboard
            </Link>

            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
                  LUXORA Seller Centre
                </p>

                <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
                  My Products
                </h1>

                <p className="mt-3 text-sm text-[#6b6258]">
                  Manage the products you sell on LUXORA.
                </p>

              </div>

              <Link
                href="/reseller/products/add"
                className="w-fit bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
              >
                + Add Product
              </Link>

            </div>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-7xl">

            {/* STATS */}

            <div className="mb-8 grid gap-4 sm:grid-cols-3">

              <div className="bg-white p-6">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                  Total Products
                </p>

                <p className="mt-2 font-serif text-3xl text-[#111111]">
                  {products.length}
                </p>

              </div>

              <div className="bg-white p-6">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                  Active Products
                </p>

                <p className="mt-2 font-serif text-3xl text-green-700">
                  {
                    products.filter(
                      (product) =>
                        product.status !== "inactive"
                    ).length
                  }
                </p>

              </div>

              <div className="bg-white p-6">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6258]">
                  Out of Stock
                </p>

                <p className="mt-2 font-serif text-3xl text-red-600">
                  {
                    products.filter(
                      (product) =>
                        Number(product.stock || 0) <= 0
                    ).length
                  }
                </p>

              </div>

            </div>

            {/* EMPTY */}

            {products.length === 0 ? (

              <div className="bg-white px-6 py-20 text-center">

                <div className="text-5xl">
                  🛍️
                </div>

                <h2 className="mt-6 font-serif text-3xl text-[#111111]">
                  No Products Yet
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b6258]">
                  Add your first product and start selling
                  on LUXORA.
                </p>

                <Link
                  href="/reseller/products/add"
                  className="mt-7 inline-block bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
                >
                  Add Your First Product
                </Link>

              </div>

            ) : (

              /* PRODUCTS */

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {products.map((product) => (

                  <article
                    key={product.id}
                    className="group overflow-hidden bg-white"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[3/4] overflow-hidden bg-[#eee4d6]">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#999999]">
                          No Image
                        </div>
                      )}

                      {/* STATUS */}

                      <span
                        className={`absolute left-3 top-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          product.status === "inactive"
                            ? "bg-gray-600 text-white"
                            : Number(product.stock || 0) <= 0
                              ? "bg-red-600 text-white"
                              : "bg-green-600 text-white"
                        }`}
                      >
                        {product.status === "inactive"
                          ? "Inactive"
                          : Number(product.stock || 0) <= 0
                            ? "Out of Stock"
                            : "Active"}
                      </span>

                    </div>

                    {/* INFO */}

                    <div className="p-5">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#c6a15b]">
                        {product.category || "Product"}
                      </p>

                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#111111]">
                        {product.name}
                      </h3>

                      <div className="mt-3 flex items-center gap-2">

                        <span className="text-sm font-semibold">
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString("en-IN")}
                        </span>

                        {product.originalPrice && (
                          <span className="text-xs text-[#999999] line-through">
                            ₹
                            {Number(
                              product.originalPrice
                            ).toLocaleString("en-IN")}
                          </span>
                        )}

                      </div>

                      <div className="mt-3 flex justify-between border-t border-black/10 pt-3 text-xs text-[#6b6258]">

                        <span>
                          Stock:{" "}
                          <strong className="text-[#111111]">
                            {product.stock || 0}
                          </strong>
                        </span>

                        {product.sku && (
                          <span>
                            SKU: {product.sku}
                          </span>
                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-5 grid grid-cols-2 gap-2">

                        <Link
                          href={`/reseller/products/${product.id}/edit`}
                          className="border border-black/15 px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          className="border border-red-200 px-3 py-3 text-[10px] font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>

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