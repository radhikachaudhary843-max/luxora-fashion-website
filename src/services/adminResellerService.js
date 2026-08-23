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

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Failed to load users:", error);
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
    console.error("Failed to save users:", error);
    return false;
  }
}

/* =========================================================
   GET RESELLERS
========================================================= */

export function getAdminResellers() {
  return getAllUsers().filter(
    (user) =>
      String(user.role || "").toLowerCase() ===
      "reseller"
  );
}

/* =========================================================
   UPDATE RESELLER
========================================================= */

export function updateAdminReseller(
  resellerId,
  updates = {}
) {
  if (!isBrowser()) {
    return {
      success: false,
      message: "Browser storage is not available.",
    };
  }

  const users = getAllUsers();

  const index = users.findIndex(
    (user) =>
      user.id === resellerId &&
      String(user.role || "").toLowerCase() ===
        "reseller"
  );

  if (index === -1) {
    return {
      success: false,
      message: "Reseller not found.",
    };
  }

  const current = users[index];

  const updatedName =
    updates.name !== undefined
      ? String(updates.name).trim()
      : current.name || "";

  const updatedEmail =
    updates.email !== undefined
      ? String(updates.email).trim().toLowerCase()
      : current.email || "";

  const updatedPhone =
    updates.phone !== undefined
      ? String(updates.phone).trim()
      : current.phone || "";

  const updatedBusinessName =
    updates.businessName !== undefined
      ? String(updates.businessName).trim()
      : current.businessName || "";

  const updatedBusinessType =
    updates.businessType !== undefined
      ? String(updates.businessType).trim()
      : current.businessType || "";

  const updatedGstNumber =
    updates.gstNumber !== undefined
      ? String(updates.gstNumber).trim().toUpperCase()
      : current.gstNumber || "";

  const updatedAddress =
    updates.address !== undefined
      ? String(updates.address).trim()
      : current.address || "";

  const updatedCity =
    updates.city !== undefined
      ? String(updates.city).trim()
      : current.city || "";

  const updatedState =
    updates.state !== undefined
      ? String(updates.state).trim()
      : current.state || "";

  const updatedPincode =
    updates.pincode !== undefined
      ? String(updates.pincode).trim()
      : current.pincode || "";

  if (!updatedName || !updatedEmail) {
    return {
      success: false,
      message: "Name and email are required.",
    };
  }

  if (
    updatedPhone &&
    !/^[6-9]\d{9}$/.test(updatedPhone)
  ) {
    return {
      success: false,
      message: "Please enter a valid 10-digit mobile number.",
    };
  }

  if (
    updatedPincode &&
    !/^\d{6}$/.test(updatedPincode)
  ) {
    return {
      success: false,
      message: "Please enter a valid 6-digit PIN code.",
    };
  }

  const emailExists = users.some(
    (user, userIndex) =>
      userIndex !== index &&
      String(user.email || "").toLowerCase() ===
        updatedEmail
  );

  if (emailExists) {
    return {
      success: false,
      message:
        "This email is already used by another account.",
    };
  }

  const updatedReseller = {
    ...current,

    name: updatedName,
    email: updatedEmail,
    phone: updatedPhone,

    businessName: updatedBusinessName,
    businessType: updatedBusinessType,
    gstNumber: updatedGstNumber,

    address: updatedAddress,
    city: updatedCity,
    state: updatedState,
    pincode: updatedPincode,

    updatedAt: new Date().toISOString(),
  };

  const updatedUsers = [...users];

  updatedUsers[index] = updatedReseller;

  if (!saveUsers(updatedUsers)) {
    return {
      success: false,
      message: "Unable to update reseller.",
    };
  }

  return {
    success: true,
    message: "Reseller updated successfully.",
    reseller: updatedReseller,
  };
}

/* =========================================================
   TOGGLE RESELLER STATUS
========================================================= */

export function toggleAdminResellerStatus(
  resellerId
) {
  if (!isBrowser()) {
    return {
      success: false,
      message: "Browser storage is not available.",
    };
  }

  const users = getAllUsers();

  const index = users.findIndex(
    (user) =>
      user.id === resellerId &&
      String(user.role || "").toLowerCase() ===
        "reseller"
  );

  if (index === -1) {
    return {
      success: false,
      message: "Reseller not found.",
    };
  }

  const reseller = users[index];

  const currentStatus =
    reseller.status === "inactive"
      ? "inactive"
      : "active";

  const newStatus =
    currentStatus === "active"
      ? "inactive"
      : "active";

  const updatedReseller = {
    ...reseller,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  const updatedUsers = [...users];

  updatedUsers[index] = updatedReseller;

  if (!saveUsers(updatedUsers)) {
    return {
      success: false,
      message: "Unable to update reseller status.",
    };
  }

  return {
    success: true,
    message:
      newStatus === "active"
        ? "Reseller activated successfully."
        : "Reseller deactivated successfully.",
    reseller: updatedReseller,
  };
}

/* =========================================================
   DELETE RESELLER
========================================================= */

export function deleteAdminReseller(
  resellerId
) {
  if (!isBrowser()) {
    return {
      success: false,
      message: "Browser storage is not available.",
    };
  }

  const users = getAllUsers();

  const exists = users.some(
    (user) =>
      user.id === resellerId &&
      String(user.role || "").toLowerCase() ===
        "reseller"
  );

  if (!exists) {
    return {
      success: false,
      message: "Reseller not found.",
    };
  }

  const updatedUsers = users.filter(
    (user) => user.id !== resellerId
  );

  if (!saveUsers(updatedUsers)) {
    return {
      success: false,
      message: "Unable to delete reseller.",
    };
  }

  return {
    success: true,
    message: "Reseller deleted successfully.",
  };
}