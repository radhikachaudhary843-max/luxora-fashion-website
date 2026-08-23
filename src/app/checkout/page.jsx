
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import {
  getCart,
  clearCart,
} from "@/services/cartService";

import { getCurrentUser } from "@/services/authService";

const ORDERS_KEY = "luxora_orders";
const PRODUCTS_KEY = "luxora_reseller_products";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
  });

  useEffect(() => {
    const savedCart = getCart();
    setCart(savedCart);

    const currentUser = getCurrentUser();

    if (currentUser) {
      setForm((current) => ({
        ...current,
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const delivery =
    subtotal === 0
      ? 0
      : subtotal >= 999
        ? 0
        : 99;

  const total = subtotal + delivery;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    setError("");

    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError(
        "Please fill in all delivery details."
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError(
        "Please enter a valid 6-digit PIN code."
      );
      return;
    }

    setPlacingOrder(true);

    try {
      /*
       * --------------------------------------------------
       * LOAD RESELLER PRODUCTS
       * --------------------------------------------------
       *
       * Cart me resellerId normally already present hoga.
       * Lekin old cart items ke liye fallback ke taur par
       * reseller product list se resellerId find karenge.
       */

      let allResellerProducts = [];

      try {
        const savedProducts = JSON.parse(
          localStorage.getItem(PRODUCTS_KEY) || "[]"
        );

        allResellerProducts = Array.isArray(
          savedProducts
        )
          ? savedProducts
          : [];
      } catch (productError) {
        console.error(
          "Failed to load reseller products:",
          productError
        );

        allResellerProducts = [];
      }

      /*
       * --------------------------------------------------
       * PREPARE ORDER ITEMS
       * --------------------------------------------------
       */

      const orderItems = cart.map((cartItem) => {
        const resellerProduct =
          allResellerProducts.find(
            (product) =>
              String(product.id) ===
              String(cartItem.id)
          );

        const resellerId =
          cartItem.resellerId ||
          resellerProduct?.resellerId ||
          null;

        const resellerName =
          cartItem.resellerName ||
          resellerProduct?.resellerName ||
          "";

        return {
          ...cartItem,

          /*
           * IMPORTANT:
           * Every product carries its resellerId.
           */

          resellerId,

          resellerName,

          quantity: Number(
            cartItem.quantity || 1
          ),

          price: Number(
            cartItem.price || 0
          ),
        };
      });

      /*
       * --------------------------------------------------
       * CREATE ORDER
       * --------------------------------------------------
       */

      const order = {
        id: `LUX-${Date.now()}`,

        userId: currentUser.id,

        date: new Date().toISOString(),

        customer: {
          id: currentUser.id,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email
            .trim()
            .toLowerCase(),
        },

        address: {
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          type: form.addressType,
        },

        /*
         * Order contains every product,
         * but each reseller product has its own resellerId.
         */

        items: orderItems,

        paymentMethod,

        subtotal,

        delivery,

        total,

        status: "Order Placed",

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),
      };

      /*
       * --------------------------------------------------
       * LOAD EXISTING ORDERS
       * --------------------------------------------------
       */

      let existingOrders = [];

      try {
        const savedOrders = JSON.parse(
          localStorage.getItem(ORDERS_KEY) || "[]"
        );

        existingOrders = Array.isArray(
          savedOrders
        )
          ? savedOrders
          : [];
      } catch (orderError) {
        console.error(
          "Failed to load existing orders:",
          orderError
        );

        existingOrders = [];
      }

      /*
       * --------------------------------------------------
       * SAVE ORDER
       * --------------------------------------------------
       */

      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify([
          order,
          ...existingOrders,
        ])
      );

      /*
       * --------------------------------------------------
       * CLEAR CART
       * --------------------------------------------------
       */

      clearCart();

      /*
       * --------------------------------------------------
       * SAVE LAST ORDER
       * --------------------------------------------------
       */

      localStorage.setItem(
        "luxora_last_order",
        JSON.stringify(order)
      );

      /*
       * --------------------------------------------------
       * REDIRECT
       * --------------------------------------------------
       */

      router.push("/order-success");
    } catch (orderError) {
      console.error(
        "Failed to place order:",
        orderError
      );

      setError(
        "Unable to place order. Please try again."
      );

      setPlacingOrder(false);
    }
  };

  /*
   * --------------------------------------------------
   * EMPTY CART
   * --------------------------------------------------
   */

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-[70vh] bg-[#f5efe6] px-6 py-20">
          <div className="mx-auto max-w-lg bg-white px-6 py-14 text-center">

            <div className="text-5xl">
              🛒
            </div>

            <h1 className="mt-6 font-serif text-3xl">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Add some products before proceeding
              to checkout.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-block bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
            >
              Continue Shopping
            </Link>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  /*
   * --------------------------------------------------
   * CHECKOUT PAGE
   * --------------------------------------------------
   */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* HEADER */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              Checkout
            </h1>

            <div className="mt-5 flex items-center gap-3 text-xs text-[#6b6258]">
              <span>Cart</span>

              <span>→</span>

              <span className="font-semibold text-[#111111]">
                Checkout
              </span>

              <span>→</span>

              <span>Confirmation</span>
            </div>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-7xl">

            <form onSubmit={handlePlaceOrder}>

              <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

                {/* LEFT */}

                <div className="space-y-6">

                  {error && (
                    <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {/* CONTACT */}

                  <section className="bg-white p-6 sm:p-8">

                    <div className="mb-6">

                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                        Step 01
                      </p>

                      <h2 className="mt-2 font-serif text-2xl">
                        Contact Information
                      </h2>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                      <div>
                        <label className="mb-2 block text-xs font-semibold">
                          Full Name *
                        </label>

                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold">
                          Mobile Number *
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                        />
                      </div>

                      <div className="sm:col-span-2">

                        <label className="mb-2 block text-xs font-semibold">
                          Email Address *
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                        />

                      </div>

                    </div>

                  </section>

                  {/* ADDRESS */}

                  <section className="bg-white p-6 sm:p-8">

                    <div className="mb-6">

                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                        Step 02
                      </p>

                      <h2 className="mt-2 font-serif text-2xl">
                        Delivery Address
                      </h2>

                    </div>

                    <div className="space-y-5">

                      <div>

                        <label className="mb-2 block text-xs font-semibold">
                          Address *
                        </label>

                        <textarea
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          rows={3}
                          placeholder="House / Flat / Street / Area"
                          className="w-full resize-none border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                        />

                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">

                        <div>

                          <label className="mb-2 block text-xs font-semibold">
                            City *
                          </label>

                          <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                          />

                        </div>

                        <div>

                          <label className="mb-2 block text-xs font-semibold">
                            State *
                          </label>

                          <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                          />

                        </div>

                        <div>

                          <label className="mb-2 block text-xs font-semibold">
                            PIN Code *
                          </label>

                          <input
                            type="text"
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            placeholder="6-digit PIN"
                            maxLength={6}
                            className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                          />

                        </div>

                      </div>

                      <div>

                        <label className="mb-3 block text-xs font-semibold">
                          Address Type
                        </label>

                        <div className="flex flex-wrap gap-3">

                          {["Home", "Work"].map(
                            (type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  setForm(
                                    (current) => ({
                                      ...current,
                                      addressType:
                                        type,
                                    })
                                  )
                                }
                                className={`border px-6 py-3 text-xs font-medium transition ${
                                  form.addressType ===
                                  type
                                    ? "border-[#111111] bg-[#111111] text-white"
                                    : "border-black/15 bg-white hover:border-[#c6a15b]"
                                }`}
                              >
                                {type}
                              </button>
                            )
                          )}

                        </div>

                      </div>

                    </div>

                  </section>

                  {/* PAYMENT */}

                  <section className="bg-white p-6 sm:p-8">

                    <div className="mb-6">

                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                        Step 03
                      </p>

                      <h2 className="mt-2 font-serif text-2xl">
                        Payment Method
                      </h2>

                    </div>

                    <div className="space-y-3">

                      {/* COD */}

                      <label
                        className={`flex cursor-pointer items-center gap-4 border p-4 ${
                          paymentMethod === "cod"
                            ? "border-[#c6a15b] bg-[#fffaf3]"
                            : "border-black/10"
                        }`}
                      >

                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={
                            paymentMethod === "cod"
                          }
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value
                            )
                          }
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            Cash on Delivery
                          </p>

                          <p className="mt-1 text-xs text-[#6b6258]">
                            Pay when your order arrives.
                          </p>
                        </div>

                      </label>

                      {/* UPI */}

                      <label
                        className={`flex cursor-pointer items-center gap-4 border p-4 ${
                          paymentMethod === "upi"
                            ? "border-[#c6a15b] bg-[#fffaf3]"
                            : "border-black/10"
                        }`}
                      >

                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={
                            paymentMethod === "upi"
                          }
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value
                            )
                          }
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            UPI
                          </p>

                          <p className="mt-1 text-xs text-[#6b6258]">
                            Pay securely using UPI.
                          </p>
                        </div>

                      </label>

                      {/* CARD */}

                      <label
                        className={`flex cursor-pointer items-center gap-4 border p-4 ${
                          paymentMethod === "card"
                            ? "border-[#c6a15b] bg-[#fffaf3]"
                            : "border-black/10"
                        }`}
                      >

                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={
                            paymentMethod === "card"
                          }
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value
                            )
                          }
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            Credit / Debit Card
                          </p>

                          <p className="mt-1 text-xs text-[#6b6258]">
                            Secure card payment.
                          </p>
                        </div>

                      </label>

                    </div>

                    {paymentMethod !== "cod" && (
                      <div className="mt-4 bg-[#f5efe6] px-4 py-3 text-xs text-[#6b6258]">
                        Payment gateway integration
                        will be connected later.
                        For now, your order will be
                        created using localStorage.
                      </div>
                    )}

                  </section>

                </div>

                {/* RIGHT */}

                <aside>

                  <div className="sticky top-24 bg-white p-6 sm:p-7">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Your Order
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      Order Summary
                    </h2>

                    <div className="mt-6 max-h-72 space-y-4 overflow-y-auto">

                      {cart.map(
                        (item, index) => (
                          <div
                            key={`${item.id}-${index}`}
                            className="flex gap-3"
                          >

                            <div className="h-16 w-12 flex-shrink-0 overflow-hidden bg-[#eee4d6]">

                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-[9px] text-[#999999]">
                                  No Image
                                </div>
                              )}

                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="line-clamp-2 text-xs font-medium">
                                {item.name}
                              </p>

                              <p className="mt-1 text-[10px] text-[#6b6258]">
                                Qty: {item.quantity}
                              </p>

                              {item.resellerId && (
                                <p className="mt-1 text-[9px] text-[#c6a15b]">
                                  Seller Product
                                </p>
                              )}

                            </div>

                            <p className="text-xs font-semibold">
                              ₹
                              {(
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 1
                                )
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>
                        )
                      )}

                    </div>

                    <div className="mt-6 space-y-4 border-y border-black/10 py-5">

                      <div className="flex justify-between text-sm">

                        <span className="text-[#6b6258]">
                          Subtotal
                        </span>

                        <span>
                          ₹
                          {subtotal.toLocaleString(
                            "en-IN"
                          )}
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

                    <div className="mt-5 flex items-center justify-between">

                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-xl font-semibold">
                        ₹
                        {total.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                    <button
                      type="submit"
                      disabled={placingOrder}
                      className="mt-6 w-full bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {placingOrder
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>

                    <p className="mt-4 text-center text-[10px] leading-5 text-[#999999]">
                      By placing your order, you agree
                      to LUXORA's Terms & Privacy Policy.
                    </p>

                  </div>

                </aside>

              </div>

            </form>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

