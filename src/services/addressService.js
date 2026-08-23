const ADDRESSES_KEY = "luxora_addresses";

// Get all addresses
export function getAddresses(userId) {
  if (typeof window === "undefined" || !userId) {
    return [];
  }

  try {
    const addresses = JSON.parse(
      localStorage.getItem(ADDRESSES_KEY) || "[]"
    );

    return addresses.filter(
      (address) => address.userId === userId
    );
  } catch {
    return [];
  }
}

// Save all addresses
function saveAddresses(addresses) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    ADDRESSES_KEY,
    JSON.stringify(addresses)
  );
}

// Add address
export function addAddress(userId, addressData) {
  if (!userId) {
    return {
      success: false,
      message: "Please login first.",
    };
  }

  const allAddresses = getAllAddresses();

  const userAddresses = allAddresses.filter(
    (address) => address.userId === userId
  );

  const shouldBeDefault =
    addressData.isDefault || userAddresses.length === 0;

  // If this address is default, remove default from others
  if (shouldBeDefault) {
    allAddresses.forEach((address) => {
      if (address.userId === userId) {
        address.isDefault = false;
      }
    });
  }

  const newAddress = {
    id: `address_${Date.now()}`,
    userId,
    name: addressData.name?.trim() || "",
    phone: addressData.phone?.trim() || "",
    address: addressData.address?.trim() || "",
    city: addressData.city?.trim() || "",
    state: addressData.state?.trim() || "",
    pincode: addressData.pincode?.trim() || "",
    type: addressData.type || "Home",
    isDefault: shouldBeDefault,
    createdAt: new Date().toISOString(),
  };

  allAddresses.push(newAddress);

  saveAddresses(allAddresses);

  return {
    success: true,
    message: "Address added successfully.",
    address: newAddress,
  };
}

// Update address
export function updateAddress(userId, addressId, updates) {
  if (!userId || !addressId) {
    return {
      success: false,
      message: "Invalid address.",
    };
  }

  const allAddresses = getAllAddresses();

  const index = allAddresses.findIndex(
    (address) =>
      address.id === addressId &&
      address.userId === userId
  );

  if (index === -1) {
    return {
      success: false,
      message: "Address not found.",
    };
  }

  if (updates.isDefault) {
    allAddresses.forEach((address) => {
      if (address.userId === userId) {
        address.isDefault = false;
      }
    });
  }

  allAddresses[index] = {
    ...allAddresses[index],
    ...updates,
    name:
      updates.name !== undefined
        ? updates.name.trim()
        : allAddresses[index].name,
    phone:
      updates.phone !== undefined
        ? updates.phone.trim()
        : allAddresses[index].phone,
    address:
      updates.address !== undefined
        ? updates.address.trim()
        : allAddresses[index].address,
    city:
      updates.city !== undefined
        ? updates.city.trim()
        : allAddresses[index].city,
    state:
      updates.state !== undefined
        ? updates.state.trim()
        : allAddresses[index].state,
    pincode:
      updates.pincode !== undefined
        ? updates.pincode.trim()
        : allAddresses[index].pincode,
  };

  saveAddresses(allAddresses);

  return {
    success: true,
    message: "Address updated successfully.",
    address: allAddresses[index],
  };
}

// Delete address
export function deleteAddress(userId, addressId) {
  if (!userId || !addressId) {
    return {
      success: false,
      message: "Invalid address.",
    };
  }

  const allAddresses = getAllAddresses();

  const addressToDelete = allAddresses.find(
    (address) =>
      address.id === addressId &&
      address.userId === userId
  );

  if (!addressToDelete) {
    return {
      success: false,
      message: "Address not found.",
    };
  }

  let remainingAddresses = allAddresses.filter(
    (address) => address.id !== addressId
  );

  // If default address was deleted,
  // make the first remaining address default
  if (addressToDelete.isDefault) {
    const firstRemaining = remainingAddresses.find(
      (address) => address.userId === userId
    );

    if (firstRemaining) {
      firstRemaining.isDefault = true;
    }
  }

  saveAddresses(remainingAddresses);

  return {
    success: true,
    message: "Address deleted successfully.",
  };
}

// Set default address
export function setDefaultAddress(userId, addressId) {
  if (!userId || !addressId) {
    return {
      success: false,
      message: "Invalid address.",
    };
  }

  const allAddresses = getAllAddresses();

  const addressExists = allAddresses.some(
    (address) =>
      address.id === addressId &&
      address.userId === userId
  );

  if (!addressExists) {
    return {
      success: false,
      message: "Address not found.",
    };
  }

  allAddresses.forEach((address) => {
    if (address.userId === userId) {
      address.isDefault = address.id === addressId;
    }
  });

  saveAddresses(allAddresses);

  return {
    success: true,
    message: "Default address updated.",
  };
}

// Internal: get every stored address
function getAllAddresses() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(
      localStorage.getItem(ADDRESSES_KEY) || "[]"
    );
  } catch {
    return [];
  }
}