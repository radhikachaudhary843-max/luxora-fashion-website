"use client";

import { useEffect, useState } from "react";

import {
  isInWishlist,
  toggleWishlist,
} from "@/services/wishlistService";

export default function WishlistButton({
  product,
  className = "",
}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const syncWishlist = () => {
      setLiked(isInWishlist(product.id));
    };

    // Initial state
    syncWishlist();

    // Listen for wishlist changes
    window.addEventListener("wishlistUpdated", syncWishlist);

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        syncWishlist
      );
    };
  }, [product.id]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedWishlist = toggleWishlist(product);

    setLiked(
      updatedWishlist.some(
        (item) => String(item.id) === String(product.id)
      )
    );
  };

  return (
    <button
      type="button"
      onClick={handleWishlist}
      aria-label={
        liked
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl shadow-sm transition hover:bg-[#c6a15b] hover:text-white ${className}`}
    >
      {liked ? "♥" : "♡"}
    </button>
  );
}