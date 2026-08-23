"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import ProductGrid from "@/components/products/ProductGrid";

import {
  getWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlist());

    const updateWishlist = () => {
      setWishlist(getWishlist());
    };

    window.addEventListener(
      "wishlistUpdated",
      updateWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        updateWishlist
      );
    };
  }, []);

  const handleRemove = (productId) => {
    const updated = removeFromWishlist(productId);
    setWishlist(updated);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* HEADER */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA Collection
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              My Wishlist
            </h1>

            <p className="mt-4 text-sm text-[#6b6258]">
              Your saved favourites, all in one place.
            </p>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-7xl">

            {wishlist.length === 0 ? (

              /* EMPTY */

              <div className="mx-auto max-w-lg bg-white px-6 py-16 text-center">

                <div className="text-5xl">
                  ♡
                </div>

                <h2 className="mt-6 font-serif text-3xl">
                  Your Wishlist is Empty
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6b6258]">
                  Save products you love and they'll appear here.
                </p>

                <Link
                  href="/products"
                  className="mt-7 inline-block bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                >
                  Explore Products
                </Link>

              </div>

            ) : (

              <div>

                {/* TOP */}

                <div className="mb-7 flex items-center justify-between">

                  <p className="text-sm text-[#6b6258]">

                    <span className="font-semibold text-[#111111]">
                      {wishlist.length}
                    </span>{" "}

                    {wishlist.length === 1
                      ? "item"
                      : "items"}

                  </p>

                  <Link
                    href="/products"
                    className="text-xs font-semibold uppercase tracking-wider underline underline-offset-4 transition hover:text-[#c6a15b]"
                  >
                    Continue Shopping
                  </Link>

                </div>

                {/* PRODUCTS */}

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

                  {wishlist.map((product) => (

                    <div
                      key={product.id}
                      className="group"
                    >

                      <div className="relative">

                        <Link
                          href={`/products/${product.id}`}
                        >

                          <div className="relative aspect-[3/4] overflow-hidden bg-[#eee4d6]">

                            {product.badge && (
                              <span className="absolute left-3 top-3 z-10 bg-[#c6a15b] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                {product.badge}
                              </span>
                            )}

                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />

                          </div>

                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(product.id)
                          }
                          aria-label="Remove from wishlist"
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-[#c6a15b] shadow-sm transition hover:bg-[#111111] hover:text-white"
                        >
                          ♥
                        </button>

                      </div>

                      <div className="pt-4">

                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#c6a15b]">
                          {product.category}
                        </p>

                        <Link
                          href={`/products/${product.id}`}
                        >
                          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-[#111111] transition hover:text-[#c6a15b]">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="mt-2 flex items-center gap-2">

                          <span className="text-sm font-semibold">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>

                          {product.originalPrice && (
                            <span className="text-xs text-[#999999] line-through">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}

                        </div>

                        {/* ADD TO CART */}

                        <Link
                          href={`/products/${product.id}`}
                          className="mt-4 block w-full bg-[#111111] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                        >
                          View Product
                        </Link>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}