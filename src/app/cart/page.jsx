"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "@/services/cartService";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleIncrease = (id, quantity) => {
    const updatedCart = updateCartQuantity(id, quantity + 1);
    setCart(updatedCart);
  };

  const handleDecrease = (id, quantity) => {
    const updatedCart = updateCartQuantity(id, quantity - 1);
    setCart(updatedCart);
  };

  const handleRemove = (id) => {
    const updatedCart = removeFromCart(id);
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    const updatedCart = clearCart();
    setCart(updatedCart);
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discount = couponApplied
    ? Math.round(subtotal * 0.1)
    : 0;

  const delivery = subtotal === 0
    ? 0
    : subtotal >= 999
      ? 0
      : 99;

  const total = subtotal - discount + delivery;

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCoupon = (e) => {
    e.preventDefault();

    if (coupon.trim().toUpperCase() === "LUXORA10") {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      alert("Invalid coupon code.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* HEADER */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              Your Selection
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              Shopping Cart
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              {totalItems === 0
                ? "Your cart is currently empty."
                : `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart.`}
            </p>

          </div>

        </section>

        {/* EMPTY CART */}

        {cart.length === 0 ? (

          <section className="flex min-h-[55vh] items-center justify-center px-6 py-16">

            <div className="w-full max-w-lg bg-white px-6 py-14 text-center sm:px-10">

              <div className="text-5xl">
                🛒
              </div>

              <h2 className="mt-6 font-serif text-3xl text-[#111111]">
                Your Cart is Empty
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6b6258]">
                Looks like you haven't added anything to your cart yet.
                Discover something beautiful from our collection.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-block bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
              >
                Continue Shopping
              </Link>

            </div>

          </section>

        ) : (

          /* CART */

          <section className="px-6 py-10 lg:px-8 lg:py-14">

            <div className="mx-auto max-w-7xl">

              <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

                {/* LEFT */}

                <div>

                  {/* CART TOP */}

                  <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                      Cart Items
                    </p>

                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-xs text-red-600 underline underline-offset-4"
                    >
                      Clear Cart
                    </button>

                  </div>

                  {/* ITEMS */}

                  <div className="space-y-4">

                    {cart.map((item) => (

                      <article
                        key={item.id}
                        className="bg-white p-4 sm:p-5"
                      >

                        <div className="flex gap-4 sm:gap-6">

                          {/* IMAGE */}

                          <Link
                            href={`/products/${item.id}`}
                            className="block h-32 w-24 flex-shrink-0 overflow-hidden bg-[#eee4d6] sm:h-40 sm:w-32"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          </Link>

                          {/* INFO */}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <p className="text-[10px] uppercase tracking-[0.15em] text-[#c6a15b]">
                                  {item.category}
                                </p>

                                <Link
                                  href={`/products/${item.id}`}
                                >
                                  <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-[#111111] transition hover:text-[#c6a15b] sm:text-base">
                                    {item.name}
                                  </h2>
                                </Link>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemove(item.id)
                                }
                                className="flex-shrink-0 text-lg text-[#999999] transition hover:text-red-600"
                                aria-label={`Remove ${item.name}`}
                              >
                                ×
                              </button>

                            </div>

                            {/* PRICE */}

                            <div className="mt-3 flex flex-wrap items-center gap-2">

                              <span className="text-sm font-semibold">
                                ₹{item.price.toLocaleString("en-IN")}
                              </span>

                              {item.originalPrice && (
                                <span className="text-xs text-[#999999] line-through">
                                  ₹{item.originalPrice.toLocaleString("en-IN")}
                                </span>
                              )}

                            </div>

                            {/* QUANTITY */}

                            <div className="mt-4 flex items-center justify-between">

                              <div className="flex h-9 border border-black/15">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDecrease(
                                      item.id,
                                      item.quantity
                                    )
                                  }
                                  className="w-9 text-sm transition hover:bg-[#f5efe6]"
                                >
                                  −
                                </button>

                                <span className="flex w-10 items-center justify-center border-x border-black/10 text-xs font-medium">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleIncrease(
                                      item.id,
                                      item.quantity
                                    )
                                  }
                                  className="w-9 text-sm transition hover:bg-[#f5efe6]"
                                >
                                  +
                                </button>

                              </div>

                              <p className="text-sm font-semibold">
                                ₹{(
                                  item.price * item.quantity
                                ).toLocaleString("en-IN")}
                              </p>

                            </div>

                          </div>

                        </div>

                      </article>

                    ))}

                  </div>

                  {/* CONTINUE SHOPPING */}

                  <Link
                    href="/products"
                    className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-[#111111] underline underline-offset-4 transition hover:text-[#c6a15b]"
                  >
                    ← Continue Shopping
                  </Link>

                </div>

                {/* RIGHT - SUMMARY */}

                <aside>

                  <div className="sticky top-24 bg-white p-6 sm:p-7">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Order Summary
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      Checkout Details
                    </h2>

                    {/* COUPON */}

                    <form
                      onSubmit={handleCoupon}
                      className="mt-6"
                    >

                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                        Coupon Code
                      </label>

                      <div className="flex">

                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) =>
                            setCoupon(e.target.value)
                          }
                          placeholder="LUXORA10"
                          className="min-w-0 flex-1 border border-black/15 px-3 py-3 text-xs uppercase outline-none focus:border-[#c6a15b]"
                        />

                        <button
                          type="submit"
                          className="bg-[#111111] px-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                        >
                          Apply
                        </button>

                      </div>

                      {couponApplied && (
                        <p className="mt-2 text-xs text-green-600">
                          Coupon applied — 10% off
                        </p>
                      )}

                    </form>

                    {/* SUMMARY */}

                    <div className="mt-7 space-y-4 border-y border-black/10 py-6">

                      <div className="flex justify-between text-sm">

                        <span className="text-[#6b6258]">
                          Subtotal
                        </span>

                        <span>
                          ₹{subtotal.toLocaleString("en-IN")}
                        </span>

                      </div>

                      <div className="flex justify-between text-sm">

                        <span className="text-[#6b6258]">
                          Discount
                        </span>

                        <span className="text-green-600">
                          {discount > 0
                            ? `−₹${discount.toLocaleString("en-IN")}`
                            : "₹0"}
                        </span>

                      </div>

                      <div className="flex justify-between text-sm">

                        <span className="text-[#6b6258]">
                          Delivery
                        </span>

                        <span>
                          {delivery === 0
                            ? "FREE"
                            : `₹${delivery}`}
                        </span>

                      </div>

                    </div>

                    {/* TOTAL */}

                    <div className="mt-5 flex items-center justify-between">

                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-xl font-semibold">
                        ₹{total.toLocaleString("en-IN")}
                      </span>

                    </div>

                    {/* FREE DELIVERY */}

                    {subtotal < 999 && (
                      <div className="mt-5 bg-[#f5efe6] px-4 py-3 text-xs leading-5 text-[#6b6258]">
                        Add ₹
                        {(999 - subtotal).toLocaleString("en-IN")}
                        {" "}more to get <strong>FREE delivery</strong>.
                      </div>
                    )}

                    {subtotal >= 999 && (
                      <div className="mt-5 bg-green-50 px-4 py-3 text-xs text-green-700">
                        🎉 You have unlocked FREE delivery!
                      </div>
                    )}

                    {/* CHECKOUT */}

                    <Link
                      href="/checkout"
                      className="mt-6 block w-full bg-[#111111] px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
                    >
                      Proceed to Checkout
                    </Link>

                    <div className="mt-5 space-y-2 text-center text-[10px] uppercase tracking-wider text-[#999999]">
                      <p>Secure Checkout</p>
                      <p>Easy Returns · Premium Packaging</p>
                    </div>

                  </div>

                </aside>

              </div>

            </div>

          </section>

        )}

      </main>

      <Footer />
    </>
  );
}