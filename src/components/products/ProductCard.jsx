"use client";

import Link from "next/link";
import WishlistButton from "@/components/wishlist/WishlistButton";

export default function ProductCard({ product }) {
  return (
    <article className="group relative min-w-0">

      {/* PRODUCT IMAGE */}
      <Link
        href={`/products/${product.id}`}
        className="block"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5efe6]">

          {/* BADGE */}
          {product.badge && (
            <span className="absolute left-2 top-2 z-10 bg-[#c6a15b] px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">
              {product.badge}
            </span>
          )}

          {/* IMAGE */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {/* WISHLIST */}
          <WishlistButton
            product={product}
            className="absolute right-2 top-2 z-20 sm:right-3 sm:top-3"
          />

          {/* QUICK ADD */}
          <div className="absolute bottom-0 left-0 right-0 hidden translate-y-full bg-[#111111]/95 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white transition duration-300 group-hover:translate-y-0 sm:block">
            Quick Add
          </div>

        </div>
      </Link>

      {/* PRODUCT INFO */}
      <div className="min-w-0 pt-3 sm:pt-4">

        {/* CATEGORY */}
        <p className="truncate text-[8px] uppercase tracking-[0.12em] text-[#c6a15b] sm:text-[10px] sm:tracking-[0.15em]">
          {product.category}
        </p>

        {/* PRODUCT NAME */}
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs font-medium leading-5 text-[#111111] transition hover:text-[#c6a15b] sm:text-sm">
            {product.name}
          </h3>
        </Link>

        {/* RATING */}
        <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2 sm:gap-2">
          <span className="text-[10px] text-[#c6a15b] sm:text-xs">
            ★ {product.rating}
          </span>

          <span className="text-[10px] text-[#6b6258] sm:text-xs">
            ({product.reviews})
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-2">

          <span className="text-xs font-semibold text-[#111111] sm:text-sm">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span className="text-[10px] text-[#999999] line-through sm:text-xs">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>

          <span className="text-[9px] font-medium text-[#c6a15b] sm:text-[10px]">
            {product.discount}% OFF
          </span>

        </div>

      </div>

    </article>
  );
}