const CART_KEY = "luxora_cart";

export function getCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
}

function saveCart(cart) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

  // Navbar / Cart components ko update karne ke liye
  window.dispatchEvent(
    new Event("cartUpdated")
  );
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();

  const safeQuantity = Math.max(
    1,
    Number(quantity) || 1
  );

  const existingItem = cart.find(
    (item) =>
      String(item.id) === String(product.id)
  );

  if (existingItem) {
    existingItem.quantity =
      Number(existingItem.quantity || 0) +
      safeQuantity;

    /*
     * Agar existing cart item me resellerId nahi hai
     * aur product me resellerId available hai,
     * to resellerId update kar do.
     */
    if (
      !existingItem.resellerId &&
      product.resellerId
    ) {
      existingItem.resellerId =
        product.resellerId;
    }
  } else {
    cart.push({
      id: product.id,

      name: product.name || "",

      image: product.image || "",

      price: Number(product.price || 0),

      originalPrice: Number(
        product.originalPrice ||
          product.price ||
          0
      ),

      discount:
        product.discount || 0,

      category:
        product.category || "",

      /*
       * IMPORTANT:
       * Reseller product ki ID cart me preserve hogi.
       */
      resellerId:
        product.resellerId || null,

      resellerName:
        product.resellerName || "",

      brand:
        product.brand || "",

      sku:
        product.sku || "",

      material:
        product.material || "",

      sizes:
        Array.isArray(product.sizes)
          ? product.sizes
          : [],

      colors:
        Array.isArray(product.colors)
          ? product.colors
          : [],

      quantity: safeQuantity,
    });
  }

  saveCart(cart);

  return cart;
}

export function updateCartQuantity(
  productId,
  quantity
) {
  const cart = getCart();

  const item = cart.find(
    (product) =>
      String(product.id) ===
      String(productId)
  );

  if (!item) {
    return cart;
  }

  const newQuantity = Number(quantity);

  if (
    !Number.isFinite(newQuantity) ||
    newQuantity <= 0
  ) {
    return removeFromCart(productId);
  }

  item.quantity = Math.floor(
    newQuantity
  );

  saveCart(cart);

  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) =>
      String(item.id) !==
      String(productId)
  );

  saveCart(updatedCart);

  return updatedCart;
}

export function clearCart() {
  saveCart([]);

  return [];
}

export function getCartCount() {
  return getCart().reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0),
    0
  );
}

export function getCartSubtotal() {
  return getCart().reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );
}