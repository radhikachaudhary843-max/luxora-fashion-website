const USERS_KEY = "luxora_users";
const CURRENT_USER_KEY = "luxora_current_user";

/* =========================================================
   HELPERS
========================================================= */

function isBrowser() {
  return typeof window !== "undefined";
}

/* =========================================================
   GET ALL USERS
========================================================= */

export function getUsers() {
  if (!isBrowser()) return [];

  try {
    const users = localStorage.getItem(USERS_KEY);

    if (!users) return [];

    const parsedUsers = JSON.parse(users);

    return Array.isArray(parsedUsers) ? parsedUsers : [];
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
   REGISTER CUSTOMER
========================================================= */

export function registerCustomer({
  name,
  email,
  password,
}) {
  if (!isBrowser()) {
    return {
      success: false,
      message: "Browser storage is not available.",
    };
  }

  const cleanName = String(name || "").trim();

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  const cleanPassword = String(password || "");

  if (
    !cleanName ||
    !normalizedEmail ||
    !cleanPassword
  ) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  if (cleanPassword.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters.",
    };
  }

  const users = getUsers();

  const existingUser = users.find(
    (user) =>
      String(user.email || "").toLowerCase() ===
      normalizedEmail
  );

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  const newUser = {
    id: `user_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    name: cleanName,

    email: normalizedEmail,

    password: cleanPassword,

    phone: "",

    role: "customer",

    createdAt: new Date().toISOString(),
  };

  const saved = saveUsers([
    ...users,
    newUser,
  ]);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to create account. Please try again.",
    };
  }

  return {
    success: true,

    message: "Account created successfully.",

    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
  };
}

/* =========================================================
   REGISTER RESELLER
========================================================= */

export function registerReseller({
  name,
  businessName,
  email,
  phone,
  password,
  businessType,
  gstNumber,
  address,
  city,
  state,
  pincode,
}) {
  if (!isBrowser()) {
    return {
      success: false,
      message: "Browser storage is not available.",
    };
  }

  const cleanName = String(name || "").trim();

  const cleanBusinessName = String(
    businessName || ""
  ).trim();

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  const cleanPhone = String(phone || "").trim();

  const cleanPassword = String(password || "");

  const cleanBusinessType = String(
    businessType || ""
  ).trim();

  const cleanGstNumber = String(
    gstNumber || ""
  ).trim();

  const cleanAddress = String(
    address || ""
  ).trim();

  const cleanCity = String(city || "").trim();

  const cleanState = String(state || "").trim();

  const cleanPincode = String(
    pincode || ""
  ).trim();

  /* -------------------------------------------------------
     REQUIRED VALIDATION
  ------------------------------------------------------- */

  if (
    !cleanName ||
    !cleanBusinessName ||
    !normalizedEmail ||
    !cleanPhone ||
    !cleanPassword ||
    !cleanBusinessType ||
    !cleanAddress ||
    !cleanCity ||
    !cleanState ||
    !cleanPincode
  ) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return {
      success: false,
      message:
        "Please enter a valid 10-digit mobile number.",
    };
  }

  if (cleanPassword.length < 6) {
    return {
      success: false,
      message:
        "Password must be at least 6 characters.",
    };
  }

  if (!/^\d{6}$/.test(cleanPincode)) {
    return {
      success: false,
      message:
        "Please enter a valid 6-digit PIN code.",
    };
  }

  /* -------------------------------------------------------
     CHECK EXISTING EMAIL
  ------------------------------------------------------- */

  const users = getUsers();

  const existingUser = users.find(
    (user) =>
      String(user.email || "").toLowerCase() ===
      normalizedEmail
  );

  if (existingUser) {
    return {
      success: false,
      message:
        "An account with this email already exists.",
    };
  }

  /* -------------------------------------------------------
     CREATE RESELLER
  ------------------------------------------------------- */

  const newUser = {
    id: `reseller_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    name: cleanName,

    email: normalizedEmail,

    password: cleanPassword,

    phone: cleanPhone,

    role: "reseller",

    businessName: cleanBusinessName,

    businessType: cleanBusinessType,

    gstNumber: cleanGstNumber,

    address: cleanAddress,

    city: cleanCity,

    state: cleanState,

    pincode: cleanPincode,

    createdAt: new Date().toISOString(),
  };

  const saved = saveUsers([
    ...users,
    newUser,
  ]);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to create reseller account. Please try again.",
    };
  }

  return {
    success: true,

    message:
      "Reseller account created successfully.",

    user: {
      id: newUser.id,

      name: newUser.name,

      email: newUser.email,

      phone: newUser.phone,

      role: newUser.role,

      businessName: newUser.businessName,

      businessType: newUser.businessType,

      gstNumber: newUser.gstNumber,

      address: newUser.address,

      city: newUser.city,

      state: newUser.state,

      pincode: newUser.pincode,
    },
  };
}

/* =========================================================
   LOGIN
========================================================= */

export function login({
  email,
  password,
  role = "customer",
}) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  const enteredPassword = String(
    password || ""
  );

  const selectedRole = String(
    role || "customer"
  )
    .trim()
    .toLowerCase();

  if (
    !normalizedEmail ||
    !enteredPassword
  ) {
    return {
      success: false,
      message:
        "Please enter your email and password.",
    };
  }

  /* -------------------------------------------------------
     ALLOWED ROLES
  ------------------------------------------------------- */

  const allowedRoles = [
    "customer",
    "reseller",
    "admin",
  ];

  if (!allowedRoles.includes(selectedRole)) {
    return {
      success: false,
      message: "Invalid account type.",
    };
  }

  const users = getUsers();

  /* -------------------------------------------------------
     FIND USER
  ------------------------------------------------------- */

  const user = users.find(
    (item) =>
      String(item.email || "").toLowerCase() ===
        normalizedEmail &&
      String(item.password || "") ===
        enteredPassword
  );

  if (!user) {
    return {
      success: false,
      message:
        "Invalid email or password.",
    };
  }

  /* -------------------------------------------------------
     ROLE CHECK
  ------------------------------------------------------- */

  const userRole = String(
    user.role || "customer"
  )
    .trim()
    .toLowerCase();

  if (userRole !== selectedRole) {
    return {
      success: false,
      message: `This account is registered as ${userRole}. Please select the correct account type.`,
    };
  }

  /* -------------------------------------------------------
     CURRENT USER
  ------------------------------------------------------- */

  const currentUser = {
    id: user.id,

    name: user.name || "",

    email: user.email || "",

    phone: user.phone || "",

    role: userRole,

    /* Reseller details */

    businessName:
      user.businessName || "",

    businessType:
      user.businessType || "",

    gstNumber:
      user.gstNumber || "",

    address:
      user.address || "",

    city:
      user.city || "",

    state:
      user.state || "",

    pincode:
      user.pincode || "",

    createdAt:
      user.createdAt || "",
  };

  /* -------------------------------------------------------
     SAVE CURRENT USER
  ------------------------------------------------------- */

  try {
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(currentUser)
    );
  } catch (error) {
    console.error(
      "Failed to save current user:",
      error
    );

    return {
      success: false,
      message:
        "Unable to login. Please try again.",
    };
  }

  return {
    success: true,

    message: "Login successful.",

    user: currentUser,
  };
}

/* =========================================================
   GET CURRENT USER
========================================================= */

export function getCurrentUser() {
  if (!isBrowser()) return null;

  try {
    const savedUser =
      localStorage.getItem(
        CURRENT_USER_KEY
      );

    if (!savedUser) return null;

    const user = JSON.parse(savedUser);

    if (!user || !user.id) {
      return null;
    }

    return user;
  } catch (error) {
    console.error(
      "Failed to load current user:",
      error
    );

    return null;
  }
}

/* =========================================================
   LOGOUT
========================================================= */

export function logout() {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(
      CURRENT_USER_KEY
    );
  } catch (error) {
    console.error(
      "Failed to logout:",
      error
    );
  }
}

/* =========================================================
   CHECK LOGIN
========================================================= */

export function isLoggedIn() {
  return !!getCurrentUser();
}

/* =========================================================
   UPDATE PROFILE
========================================================= */

export function updateProfile(
  updates = {}
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const currentUser =
    getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message:
        "Please login first.",
    };
  }

  const users = getUsers();

  const userIndex = users.findIndex(
    (user) =>
      user.id === currentUser.id
  );

  if (userIndex === -1) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  /* -------------------------------------------------------
     BASIC DETAILS
  ------------------------------------------------------- */

  const updatedName =
    updates.name !== undefined
      ? String(updates.name).trim()
      : users[userIndex].name;

  const updatedEmail =
    updates.email !== undefined
      ? String(updates.email)
          .trim()
          .toLowerCase()
      : users[userIndex].email;

  const updatedPhone =
    updates.phone !== undefined
      ? String(updates.phone).trim()
      : users[userIndex].phone || "";

  if (!updatedName) {
    return {
      success: false,
      message:
        "Name cannot be empty.",
    };
  }

  if (!updatedEmail) {
    return {
      success: false,
      message:
        "Email cannot be empty.",
    };
  }

  /* -------------------------------------------------------
     EMAIL DUPLICATE CHECK
  ------------------------------------------------------- */

  const emailAlreadyUsed =
    users.some(
      (user, index) =>
        index !== userIndex &&
        String(
          user.email || ""
        ).toLowerCase() ===
          updatedEmail
    );

  if (emailAlreadyUsed) {
    return {
      success: false,
      message:
        "This email is already used by another account.",
    };
  }

  /* -------------------------------------------------------
     UPDATED USER
  ------------------------------------------------------- */

  const updatedUserRecord = {
    ...users[userIndex],

    name: updatedName,

    email: updatedEmail,

    phone: updatedPhone,

    updatedAt:
      new Date().toISOString(),
  };

  /* -------------------------------------------------------
     RESELLER PROFILE UPDATES
  ------------------------------------------------------- */

  if (
    updatedUserRecord.role ===
    "reseller"
  ) {
    if (
      updates.businessName !==
      undefined
    ) {
      updatedUserRecord.businessName =
        String(
          updates.businessName
        ).trim();
    }

    if (
      updates.businessType !==
      undefined
    ) {
      updatedUserRecord.businessType =
        String(
          updates.businessType
        ).trim();
    }

    if (
      updates.gstNumber !==
      undefined
    ) {
      updatedUserRecord.gstNumber =
        String(
          updates.gstNumber
        ).trim();
    }

    if (
      updates.address !==
      undefined
    ) {
      updatedUserRecord.address =
        String(
          updates.address
        ).trim();
    }

    if (
      updates.city !==
      undefined
    ) {
      updatedUserRecord.city =
        String(
          updates.city
        ).trim();
    }

    if (
      updates.state !==
      undefined
    ) {
      updatedUserRecord.state =
        String(
          updates.state
        ).trim();
    }

    if (
      updates.pincode !==
      undefined
    ) {
      updatedUserRecord.pincode =
        String(
          updates.pincode
        ).trim();
    }
  }

  /* -------------------------------------------------------
     SAVE USERS
  ------------------------------------------------------- */

  const updatedUsers = [
    ...users,
  ];

  updatedUsers[userIndex] =
    updatedUserRecord;

  const saved =
    saveUsers(updatedUsers);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to update profile. Please try again.",
    };
  }
  /* -------------------------------------------------------
     UPDATE CURRENT USER
  ------------------------------------------------------- */

  const updatedCurrentUser = {
    ...currentUser,

    id: updatedUserRecord.id,

    name: updatedUserRecord.name,

    email: updatedUserRecord.email,

    phone:
      updatedUserRecord.phone || "",

    role:
      updatedUserRecord.role ||
      "customer",

    businessName:
      updatedUserRecord.businessName ||
      "",

    businessType:
      updatedUserRecord.businessType ||
      "",

    gstNumber:
      updatedUserRecord.gstNumber ||
      "",

    address:
      updatedUserRecord.address ||
      "",

    city:
      updatedUserRecord.city ||
      "",

    state:
      updatedUserRecord.state ||
      "",

    pincode:
      updatedUserRecord.pincode ||
      "",
  };

  try {
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(
        updatedCurrentUser
      )
    );
  } catch (error) {
    console.error(
      "Failed to update current user:",
      error
    );

    return {
      success: false,
      message:
        "Profile updated but session could not be saved.",
    };
  }

  return {
    success: true,

    message:
      "Profile updated successfully.",

    user: updatedCurrentUser,
  };
}

/* =========================================================
   INITIALIZE ADMIN ACCOUNT
   Admin signup nahi karega.
   Ye account automatically create hoga.
========================================================= */

export function initializeAdminAccount() {
  if (!isBrowser()) return;

  const users = getUsers();
  const adminEmail = "admin@luxora.com";

  const adminExists = users.some(
    (user) =>
      String(user.email || "").toLowerCase() ===
      adminEmail
  );

  if (adminExists) return;

  const adminUser = {
    id: "luxora_admin_001",
    name: "LUXORA Admin",
    email: adminEmail,
    password: "Luxora@123",
    phone: "",
    role: "admin",
    businessName: "",
    businessType: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    createdAt: new Date().toISOString(),
  };

  saveUsers([
    ...users,
    adminUser,
  ]);
}

/* =========================================================
   GET USER BY ID
========================================================= */

export function getUserById(
  userId
) {
  if (!userId) return null;

  const users = getUsers();

  return (
    users.find(
      (user) =>
        user.id === userId
    ) || null
  );
}

/* =========================================================
   GET USER BY EMAIL
========================================================= */

export function getUserByEmail(
  email
) {
  if (!email) return null;

  const normalizedEmail =
    String(email)
      .trim()
      .toLowerCase();

  const users = getUsers();

  return (
    users.find(
      (user) =>
        String(
          user.email || ""
        ).toLowerCase() ===
        normalizedEmail
    ) || null
  );
}

/* =========================================================
   CLEAR ALL AUTH DATA
========================================================= */

export function clearAuthData() {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(
      USERS_KEY
    );

    localStorage.removeItem(
      CURRENT_USER_KEY
    );
  } catch (error) {
    console.error(
      "Failed to clear auth data:",
      error
    );
  }
}