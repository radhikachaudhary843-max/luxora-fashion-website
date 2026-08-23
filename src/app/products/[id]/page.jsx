"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import products from "@/data/products";
import { addToCart } from "@/services/cartService";

export default function ProductDetailsPage() {
  const params = useParams();

  const product = useMemo(() => {
    return products.find(
      (item) => String(item.id) === String(params.id)
    );
  }, [params.id]);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6] px-6">
          <div className="text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
              LUXORA
            </p>

            <h1 className="mt-3 font-serif text-3xl text-[#111111]">
              Product Not Found
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Sorry, this product does not exist.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block bg-[#111111] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
            >
              Back to Products
            </Link>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  const handleQuantityDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((current) => current + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  const discountedPrice = product.price * quantity;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* BREADCRUMB */}

        <section className="border-b border-black/10 px-6 py-4 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b6258]">

              <Link
                href="/"
                className="transition hover:text-[#c6a15b]"
              >
                Home
              </Link>

              <span>/</span>

              <Link
                href="/products"
                className="transition hover:text-[#c6a15b]"
              >
                Products
              </Link>

              <span>/</span>

              <span className="text-[#111111]">
                {product.name}
              </span>

            </div>

          </div>
        </section>

        {/* PRODUCT */}

        <section className="px-6 py-8 sm:py-12 lg:px-8 lg:py-16">

          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">

            {/* IMAGE */}

            <div className="relative">

              <div className="relative aspect-[3/4] overflow-hidden bg-[#eee4d6]">

                {product.badge && (
                  <span className="absolute left-4 top-4 z-10 bg-[#c6a15b] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {product.badge}
                  </span>
                )}

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

              </div>

            </div>

            {/* INFORMATION */}

            <div className="flex flex-col justify-center">

              {/* CATEGORY */}

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
                {product.category}
              </p>

              {/* NAME */}

              <h1 className="mt-3 font-serif text-3xl leading-tight text-[#111111] sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {/* RATING */}

              <div className="mt-5 flex items-center gap-3">

                <span className="text-sm tracking-wider text-[#c6a15b]">
                  ★ {product.rating}
                </span>

                <span className="text-sm text-[#6b6258]">
                  ({product.reviews} reviews)
                </span>

              </div>

              {/* PRICE */}

              <div className="mt-6 flex flex-wrap items-center gap-3">

                <span className="text-2xl font-semibold text-[#111111]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                {product.originalPrice && (
                  <span className="text-sm text-[#999999] line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}

                {product.discount > 0 && (
                  <span className="text-xs font-semibold text-[#c6a15b]">
                    {product.discount}% OFF
                  </span>
                )}

              </div>

              {/* DESCRIPTION */}

              <div className="mt-7 border-y border-black/10 py-6">

                <p className="text-sm leading-7 text-[#6b6258]">
                  {product.description ||
                    "Discover timeless style and premium quality with this LUXORA piece. Designed for modern wardrobes with an elegant and refined finish."}
                </p>

              </div>

              {/* DETAILS */}

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">

                <div className="border border-black/10 bg-white p-4">

                  <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                    Category
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {product.category}
                  </p>

                </div>

                <div className="border border-black/10 bg-white p-4">

                  <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                    Quality
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    Premium
                  </p>

                </div>

                <div className="border border-black/10 bg-white p-4">

                  <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                    Delivery
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    Available
                  </p>

                </div>

              </div>

              {/* QUANTITY */}

              <div className="mt-8">

                <p className="mb-3 text-xs font-semibold uppercase tracking-wider">
                  Quantity
                </p>

                <div className="flex h-12 w-fit border border-black/15 bg-white">

                  <button
                    type="button"
                    onClick={handleQuantityDecrease}
                    className="w-12 text-lg transition hover:bg-[#f5efe6]"
                  >
                    −
                  </button>

                  <span className="flex w-14 items-center justify-center border-x border-black/10 text-sm font-medium">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleQuantityIncrease}
                    className="w-12 text-lg transition hover:bg-[#f5efe6]"
                  >
                    +
                  </button>

                </div>

              </div>

              {/* ADD TO CART */}

              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-6 w-full bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
              >
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>

              {/* BUY NOW */}

              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  window.location.href = "/cart";
                }}
                className="mt-3 w-full border border-[#111111] bg-transparent px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#111111] transition hover:bg-[#111111] hover:text-white"
              >
                Buy Now
              </button>

              {/* TOTAL */}

              {quantity > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">

                  <span className="text-sm text-[#6b6258]">
                    Item Total
                  </span>

                  <span className="text-sm font-semibold">
                    ₹{discountedPrice.toLocaleString("en-IN")}
                  </span>

                </div>
              )}

              {/* EXTRA INFO */}

              <div className="mt-7 space-y-3 text-xs text-[#6b6258]">

                <div className="flex gap-3">
                  <span>✓</span>
                  <span>Secure and reliable shopping experience</span>
                </div>

                <div className="flex gap-3">
                  <span>✓</span>
                  <span>Easy returns on eligible products</span>
                </div>

                <div className="flex gap-3">
                  <span>✓</span>
                  <span>Premium LUXORA packaging</span>
                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}