const USERS_KEY = "luxora_users";

function isBrowser() {
  return typeof window !== "undefined";
}

/* =========================================================
   GET ALL USERS
========================================================= */

function getAllUsers() {
  if (!isBrowser()) return [];

  try {
    const savedUsers =
      localStorage.getItem(USERS_KEY);

    if (!savedUsers) return [];

    const users = JSON.parse(savedUsers);

    return Array.isArray(users)
      ? users
      : [];
  } catch (error) {
    console.error(
      "Failed to load users:",
      error
    );

    return [];
  }
}

/* =========================================================
   SAVE USERS
========================================================= */

function saveUsers(users) {
  if (!isBrowser()) return false;

  try {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save users:",
      error
    );

    return false;
  }
}

/* =========================================================
   GET CUSTOMERS
========================================================= */

export function getAdminCustomers() {
  const users = getAllUsers();

  return users.filter(
    (user) =>
      String(user.role || "")
        .toLowerCase() === "customer"
  );
}

/* =========================================================
   GET CUSTOMER BY ID
========================================================= */

export function getAdminCustomerById(
  customerId
) {
  if (!customerId) return null;

  const customers =
    getAdminCustomers();

  return (
    customers.find(
      (customer) =>
        customer.id === customerId
    ) || null
  );
}

/* =========================================================
   UPDATE CUSTOMER
========================================================= */

export function updateAdminCustomer(
  customerId,
  updates = {}
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const users = getAllUsers();

  const index =
    users.findIndex(
      (user) =>
        user.id === customerId &&
        String(user.role || "")
          .toLowerCase() === "customer"
    );

  if (index === -1) {
    return {
      success: false,
      message: "Customer not found.",
    };
  }

  const currentCustomer =
    users[index];

  const updatedName =
    updates.name !== undefined
      ? String(updates.name).trim()
      : currentCustomer.name || "";

  const updatedEmail =
    updates.email !== undefined
      ? String(updates.email)
          .trim()
          .toLowerCase()
      : currentCustomer.email || "";

  const updatedPhone =
    updates.phone !== undefined
      ? String(updates.phone).trim()
      : currentCustomer.phone || "";

  if (!updatedName) {
    return {
      success: false,
      message: "Name cannot be empty.",
    };
  }

  if (!updatedEmail) {
    return {
      success: false,
      message: "Email cannot be empty.",
    };
  }

  const emailExists =
    users.some(
      (user, userIndex) =>
        userIndex !== index &&
        String(user.email || "")
          .toLowerCase() ===
          updatedEmail
    );

  if (emailExists) {
    return {
      success: false,
      message:
        "This email is already used by another account.",
    };
  }

  const updatedCustomer = {
    ...currentCustomer,
    name: updatedName,
    email: updatedEmail,
    phone: updatedPhone,
    updatedAt:
      new Date().toISOString(),
  };

  const updatedUsers = [
    ...users,
  ];

  updatedUsers[index] =
    updatedCustomer;

  const saved =
    saveUsers(updatedUsers);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to update customer.",
    };
  }

  return {
    success: true,
    message:
      "Customer updated successfully.",
    customer: updatedCustomer,
  };
}

/* =========================================================
   TOGGLE CUSTOMER STATUS
========================================================= */

export function toggleAdminCustomerStatus(
  customerId
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const users = getAllUsers();

  const index =
    users.findIndex(
      (user) =>
        user.id === customerId &&
        String(user.role || "")
          .toLowerCase() === "customer"
    );

  if (index === -1) {
    return {
      success: false,
      message: "Customer not found.",
    };
  }

  const customer =
    users[index];

  const currentStatus =
    customer.status === "inactive"
      ? "inactive"
      : "active";

  const newStatus =
    currentStatus === "active"
      ? "inactive"
      : "active";

  const updatedCustomer = {
    ...customer,
    status: newStatus,
    updatedAt:
      new Date().toISOString(),
  };

  const updatedUsers = [
    ...users,
  ];

  updatedUsers[index] =
    updatedCustomer;

  const saved =
    saveUsers(updatedUsers);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to update customer status.",
    };
  }

  return {
    success: true,
    message:
      `Customer ${newStatus === "active" ? "activated" : "deactivated"} successfully.`,
    customer: updatedCustomer,
  };
}

/* =========================================================
   DELETE CUSTOMER
========================================================= */

export function deleteAdminCustomer(
  customerId
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const users = getAllUsers();

  const customerExists =
    users.some(
      (user) =>
        user.id === customerId &&
        String(user.role || "")
          .toLowerCase() === "customer"
    );

  if (!customerExists) {
    return {
      success: false,
      message: "Customer not found.",
    };
  }

  const updatedUsers =
    users.filter(
      (user) =>
        user.id !== customerId
    );

  const saved =
    saveUsers(updatedUsers);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to delete customer.",
    };
  }

  return {
    success: true,
    message:
      "Customer deleted successfully.",
  };
}