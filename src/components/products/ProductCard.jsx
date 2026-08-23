"use client";

import Link from "next/link";
import WishlistButton from "@/components/wishlist/WishlistButton";

export default function ProductCard({ product }) {
  return (
    <article className="group relative">

      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f5efe6]">

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

          {/* Wishlist */}
          
           <WishlistButton
  product={product}
  className="absolute right-3 top-3 z-20"
/>

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-[#111111]/95 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white transition duration-300 group-hover:translate-y-0">
            Quick Add
          </div>

        </div>
      </Link>

      {/* Product Info */}
      <div className="pt-4">

        <p className="text-[10px] uppercase tracking-[0.15em] text-[#c6a15b]">
          {product.category}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 line-clamp-1 text-sm font-medium text-[#111111] transition hover:text-[#c6a15b]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-[#c6a15b]">
            ★ {product.rating}
          </span>

          <span className="text-xs text-[#6b6258]">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">

          <span className="text-sm font-semibold text-[#111111]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span className="text-xs text-[#999999] line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>

          <span className="text-[10px] font-medium text-[#c6a15b]">
            {product.discount}% OFF
          </span>

        </div>

      </div>
    </article>
  );
}