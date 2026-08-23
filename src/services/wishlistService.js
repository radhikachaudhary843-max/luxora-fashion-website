const WISHLIST_KEY = "luxora_wishlist";

export function getWishlist() {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveWishlist(items) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(items)
  );

  window.dispatchEvent(new Event("wishlistUpdated"));
}

export function isInWishlist(productId) {
  return getWishlist().some(
    (item) => String(item.id) === String(productId)
  );
}

export function addToWishlist(product) {
  const wishlist = getWishlist();

  const exists = wishlist.some(
    (item) => String(item.id) === String(product.id)
  );

  if (exists) return wishlist;

  const updated = [...wishlist, product];

  saveWishlist(updated);

  return updated;
}

export function removeFromWishlist(productId) {
  const wishlist = getWishlist();

  const updated = wishlist.filter(
    (item) => String(item.id) !== String(productId)
  );

  saveWishlist(updated);

  return updated;
}

export function toggleWishlist(product) {
  if (isInWishlist(product.id)) {
    return removeFromWishlist(product.id);
  }

  return addToWishlist(product);
}

export function clearWishlist() {
  saveWishlist([]);
}