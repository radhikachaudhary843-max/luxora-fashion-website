const ORDERS_KEY = "luxora_orders";

function isBrowser() {
  return typeof window !== "undefined";
}

/* =========================================================
   GET ALL ORDERS
========================================================= */

export function getAdminOrders() {
  if (!isBrowser()) return [];

  try {
    const saved =
      localStorage.getItem(ORDERS_KEY);

    if (!saved) return [];

    const orders = JSON.parse(saved);

    return Array.isArray(orders)
      ? orders
      : [];
  } catch (error) {
    console.error(
      "Failed to load orders:",
      error
    );

    return [];
  }
}

/* =========================================================
   SAVE ORDERS
========================================================= */

function saveOrders(orders) {
  if (!isBrowser()) return false;

  try {
    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify(orders)
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save orders:",
      error
    );

    return false;
  }
}

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

export function updateAdminOrderStatus(
  orderId,
  status
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  if (!orderId || !status) {
    return {
      success: false,
      message:
        "Order and status are required.",
    };
  }

  const allowedStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const normalizedStatus =
    String(status)
      .trim()
      .toLowerCase();

  if (
    !allowedStatuses.includes(
      normalizedStatus
    )
  ) {
    return {
      success: false,
      message:
        "Invalid order status.",
    };
  }

  const orders =
    getAdminOrders();

  const index =
    orders.findIndex(
      (order) =>
        order.id === orderId
    );

  if (index === -1) {
    return {
      success: false,
      message:
        "Order not found.",
    };
  }

  const updatedOrder = {
    ...orders[index],

    status:
      normalizedStatus,

    updatedAt:
      new Date().toISOString(),
  };

  const updatedOrders =
    [...orders];

  updatedOrders[index] =
    updatedOrder;

  const saved =
    saveOrders(updatedOrders);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to update order.",
    };
  }

  return {
    success: true,
    message:
      "Order status updated successfully.",
    order: updatedOrder,
  };
}

/* =========================================================
   DELETE ORDER
========================================================= */

export function deleteAdminOrder(
  orderId
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const orders =
    getAdminOrders();

  const exists =
    orders.some(
      (order) =>
        order.id === orderId
    );

  if (!exists) {
    return {
      success: false,
      message:
        "Order not found.",
    };
  }

  const filtered =
    orders.filter(
      (order) =>
        order.id !== orderId
    );

  const saved =
    saveOrders(filtered);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to delete order.",
    };
  }

  return {
    success: true,
    message:
      "Order deleted successfully.",
  };
}

/* =========================================================
   GET ORDER BY ID
========================================================= */

export function getAdminOrderById(
  orderId
) {
  if (!orderId) return null;

  const orders =
    getAdminOrders();

  return (
    orders.find(
      (order) =>
        order.id === orderId
    ) || null
  );
}