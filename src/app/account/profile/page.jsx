"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import {
  getCurrentUser,
  updateProfile,
  logout,
} from "@/services/authService";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/services/addressService";

export default function ProfilePage() {
  const router = useRouter();

  // ================================
  // USER
  // ================================

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================================
  // ADDRESS
  // ================================

  const [addresses, setAddresses] = useState([]);

  const [addressModal, setAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressMessage, setAddressMessage] = useState("");
  const [addressError, setAddressError] = useState("");

  const emptyAddressForm = {
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
    isDefault: false,
  };

  const [addressForm, setAddressForm] =
    useState(emptyAddressForm);

  // ================================
  // LOAD PROFILE
  // ================================

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    const userData = {
      id: currentUser.id || "",
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
    };

    setUser(userData);
    setForm(userData);

    loadAddresses(userData.id);

    setLoading(false);
  }, [router]);

  // ================================
  // LOAD ADDRESSES
  // ================================

  const loadAddresses = (userId) => {
    const savedAddresses = getAddresses(userId);
    setAddresses(savedAddresses);
  };

  // ================================
  // PROFILE CHANGE
  // ================================

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  // ================================
  // SAVE PROFILE
  // ================================

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      return;
    }

    const result = updateProfile({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
    });

    if (!result.success) {
      return;
    }

    const updatedUser = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone || "",
    };

    setUser(updatedUser);
    setForm(updatedUser);
    setEditing(false);
    setSaved(true);

    window.dispatchEvent(new Event("authUpdated"));

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    logout();

    window.dispatchEvent(new Event("authUpdated"));

    router.push("/login");
  };

  // ================================
  // OPEN ADD ADDRESS
  // ================================

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      ...emptyAddressForm,
      name: user.name || "",
      phone: user.phone || "",
      isDefault: addresses.length === 0,
    });

    setAddressMessage("");
    setAddressError("");
    setAddressModal(true);
  };

  // ================================
  // OPEN EDIT ADDRESS
  // ================================

  const openEditAddress = (address) => {
    setEditingAddressId(address.id);

    setAddressForm({
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      type: address.type || "Home",
      isDefault: Boolean(address.isDefault),
    });

    setAddressMessage("");
    setAddressError("");
    setAddressModal(true);
  };

  // ================================
  // ADDRESS CHANGE
  // ================================

  const handleAddressChange = (e) => {
    setAddressForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

    setAddressError("");
    setAddressMessage("");
  };

  // ================================
  // SAVE ADDRESS
  // ================================

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    setAddressError("");
    setAddressMessage("");

    const name = addressForm.name.trim();
    const phone = addressForm.phone.trim();
    const address = addressForm.address.trim();
    const city = addressForm.city.trim();
    const state = addressForm.state.trim();
    const pincode = addressForm.pincode.trim();

    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      setAddressError(
        "Please fill in all address details."
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setAddressError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setAddressError(
        "Please enter a valid 6-digit PIN code."
      );
      return;
    }

    const data = {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      type: addressForm.type,
      isDefault: addressForm.isDefault,
    };

    let result;

    if (editingAddressId) {
      result = updateAddress(
        user.id,
        editingAddressId,
        data
      );
    } else {
      result = addAddress(user.id, data);
    }

    if (!result.success) {
      setAddressError(result.message);
      return;
    }

    loadAddresses(user.id);

    setAddressMessage(
      editingAddressId
        ? "Address updated successfully."
        : "Address added successfully."
    );

    setTimeout(() => {
      setAddressModal(false);
      setAddressMessage("");
    }, 800);
  };

  // ================================
  // DELETE ADDRESS
  // ================================

  const handleDeleteAddress = (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    const result = deleteAddress(
      user.id,
      addressId
    );

    if (!result.success) {
      setAddressError(result.message);
      return;
    }

    loadAddresses(user.id);
    setAddressMessage(
      "Address deleted successfully."
    );

    setTimeout(() => {
      setAddressMessage("");
    }, 2000);
  };

  // ================================
  // DEFAULT ADDRESS
  // ================================

  const handleDefaultAddress = (addressId) => {
    const result = setDefaultAddress(
      user.id,
      addressId
    );

    if (!result.success) {
      setAddressError(result.message);
      return;
    }

    loadAddresses(user.id);

    setAddressMessage(
      "Default address updated."
    );

    setTimeout(() => {
      setAddressMessage("");
    }, 2000);
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6258]">
            Loading Profile...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* ================================
            HEADER
        ================================= */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA Account
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              My Profile
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Manage your account, orders and preferences.
            </p>

          </div>

        </section>

        {/* ================================
            CONTENT
        ================================= */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[240px_1fr]">

            {/* ================================
                SIDEBAR
            ================================= */}

            <aside>

              <div className="bg-white p-5">

                <div className="flex items-center gap-4 border-b border-black/10 pb-5">

                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#111111] font-serif text-xl text-white">
                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "L"}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold">
                      {user.name ||
                        "LUXORA Customer"}
                    </p>

                    <p className="truncate text-xs text-[#6b6258]">
                      {user.email ||
                        "Welcome to LUXORA"}
                    </p>

                  </div>

                </div>

                <nav className="mt-5 space-y-1">

                  <Link
                    href="/account/profile"
                    className="block bg-[#111111] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/orders"
                    className="block px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:bg-[#f5efe6] hover:text-[#111111]"
                  >
                    My Orders
                  </Link>

                  <Link
                    href="/wishlist"
                    className="block px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:bg-[#f5efe6] hover:text-[#111111]"
                  >
                    Wishlist
                  </Link>

                  <Link
                    href="/cart"
                    className="block px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:bg-[#f5efe6] hover:text-[#111111]"
                  >
                    Shopping Cart
                  </Link>

                </nav>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-5 w-full border border-red-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>

              </div>

            </aside>

            {/* ================================
                MAIN
            ================================= */}

            <div className="space-y-6">

              {/* ================================
                  PROFILE
              ================================= */}

              <section className="bg-white p-6 sm:p-8">

                <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Personal Information
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      Account Details
                    </h2>

                  </div>

                  {!editing && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditing(true)
                      }
                      className="border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                    >
                      Edit Profile
                    </button>
                  )}

                </div>

                {saved && (
                  <div className="mt-5 bg-green-50 px-4 py-3 text-xs text-green-700">
                    Profile updated successfully.
                  </div>
                )}

                {editing ? (

                  <form
                    onSubmit={handleSave}
                    className="mt-7 space-y-5"
                  >

                    <div>

                      <label className="mb-2 block text-xs font-semibold">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-semibold">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-semibold">
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                      />

                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                      <button
                        type="submit"
                        className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForm(user);
                          setEditing(false);
                        }}
                        className="border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                      >
                        Cancel
                      </button>

                    </div>

                  </form>

                ) : (

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">

                    <div className="border border-black/10 bg-[#faf7f2] p-5">

                      <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                        Full Name
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {user.name ||
                          "Not added"}
                      </p>

                    </div>

                    <div className="border border-black/10 bg-[#faf7f2] p-5">

                      <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm font-medium">
                        {user.email ||
                          "Not added"}
                      </p>

                    </div>

                    <div className="border border-black/10 bg-[#faf7f2] p-5">

                      <p className="text-[10px] uppercase tracking-wider text-[#6b6258]">
                        Mobile
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {user.phone ||
                          "Not added"}
                      </p>

                    </div>

                  </div>

                )}

              </section>

              {/* ================================
                  QUICK LINKS
              ================================= */}

              <section className="grid gap-4 sm:grid-cols-3">

                <Link
                  href="/orders"
                  className="group bg-white p-6 transition hover:-translate-y-1"
                >

                  <p className="text-2xl">
                    📦
                  </p>

                  <h3 className="mt-4 font-serif text-xl">
                    My Orders
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    View and track your purchases.
                  </p>

                </Link>

                <Link
                  href="/wishlist"
                  className="group bg-white p-6 transition hover:-translate-y-1"
                >

                  <p className="text-2xl">
                    ♡
                  </p>

                  <h3 className="mt-4 font-serif text-xl">
                    Wishlist
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    View your saved favourites.
                  </p>

                </Link>

                <Link
                  href="/cart"
                  className="group bg-white p-6 transition hover:-translate-y-1"
                >

                  <p className="text-2xl">
                    🛒
                  </p>

                  <h3 className="mt-4 font-serif text-xl">
                    Shopping Cart
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b6258]">
                    Review your selected products.
                  </p>

                </Link>

              </section>

              {/* ================================
                  ADDRESS MANAGEMENT
              ================================= */}

              <section className="bg-white p-6 sm:p-8">

                <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      Delivery
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      Saved Addresses
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#6b6258]">
                      Manage your saved delivery
                      addresses for faster checkout.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={openAddAddress}
                    className="bg-[#111111] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                  >
                    + Add Address
                  </button>

                </div>

                {/* MESSAGE */}

                {addressMessage && (
                  <div className="mt-5 bg-green-50 px-4 py-3 text-xs text-green-700">
                    {addressMessage}
                  </div>
                )}

                {addressError && (
                  <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                    {addressError}
                  </div>
                )}

                {/* NO ADDRESS */}

                {addresses.length === 0 ? (

                  <div className="mt-7 border border-dashed border-black/15 bg-[#faf7f2] px-6 py-12 text-center">

                    <p className="text-4xl">
                      📍
                    </p>

                    <h3 className="mt-4 font-serif text-xl">
                      No Saved Addresses
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#6b6258]">
                      Add your delivery address now
                      and make your next checkout
                      faster.
                    </p>

                    <button
                      type="button"
                      onClick={openAddAddress}
                      className="mt-5 bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                    >
                      Add Your First Address
                    </button>

                  </div>

                ) : (

                  <div className="mt-7 grid gap-5 md:grid-cols-2">

                    {addresses.map((address) => (

                      <div
                        key={address.id}
                        className={`relative border p-5 ${
                          address.isDefault
                            ? "border-[#c6a15b] bg-[#fffaf3]"
                            : "border-black/10 bg-[#faf7f2]"
                        }`}
                      >

                        {/* DEFAULT */}

                        {address.isDefault && (
                          <span className="absolute right-4 top-4 bg-[#c6a15b] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                            Default
                          </span>
                        )}

                        {/* TYPE */}

                        <div className="flex items-center gap-2">

                          <span className="text-xl">
                            {address.type ===
                            "Work"
                              ? "💼"
                              : "🏠"}
                          </span>

                          <h3 className="text-sm font-semibold">
                            {address.type ||
                              "Home"}
                          </h3>

                        </div>

                        {/* DETAILS */}

                        <div className="mt-5 space-y-2 text-xs leading-5 text-[#6b6258]">

                          <p className="font-semibold text-[#111111]">
                            {address.name}
                          </p>

                          <p>
                            {address.phone}
                          </p>

                          <p>
                            {address.address}
                          </p>

                          <p>
                            {address.city},{" "}
                            {address.state} -{" "}
                            {address.pincode}
                          </p>

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-black/10 pt-4">

                          <button
                            type="button"
                            onClick={() =>
                              openEditAddress(
                                address
                              )
                            }
                            className="border border-black/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAddress(
                                address.id
                              )
                            }
                            className="border border-red-200 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>

                          {!address.isDefault && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDefaultAddress(
                                  address.id
                                )
                              }
                              className="border border-[#c6a15b] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#8d6b2e] transition hover:bg-[#fffaf3]"
                            >
                              Set Default
                            </button>
                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </section>

            </div>

          </div>

        </section>

      </main>

      {/* ================================
          ADDRESS MODAL
      ================================= */}

      {addressModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-6 py-5 sm:px-8">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  LUXORA
                </p>

                <h2 className="mt-1 font-serif text-2xl">
                  {editingAddressId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setAddressModal(false)
                }
                className="flex h-9 w-9 items-center justify-center text-xl text-[#6b6258] transition hover:text-[#111111]"
              >
                ×
              </button>

            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={handleAddressSubmit}
              className="space-y-5 p-6 sm:p-8"
            >

              {addressError && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                  {addressError}
                </div>
              )}

              {addressMessage && (
                <div className="bg-green-50 px-4 py-3 text-xs text-green-700">
                  {addressMessage}
                </div>
              )}

              {/* NAME + PHONE */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-semibold">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressChange}
                    placeholder="Full name"
                    required
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold">
                    Mobile Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    required
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

              </div>

              {/* ADDRESS */}

              <div>

                <label className="mb-2 block text-xs font-semibold">
                  Complete Address *
                </label>

                <textarea
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressChange}
                  placeholder="House / Flat / Street / Area"
                  rows={3}
                  required
                  className="w-full resize-none border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                />

              </div>

              {/* CITY + STATE */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-semibold">
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    required
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold">
                    State *
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    required
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

              </div>

              {/* PIN */}

              <div>

                <label className="mb-2 block text-xs font-semibold">
                  PIN Code *
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={addressForm.pincode}
                  onChange={handleAddressChange}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  required
                  className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                />

              </div>

              {/* ADDRESS TYPE */}

              <div>

                <label className="mb-3 block text-xs font-semibold">
                  Address Type
                </label>

                <div className="flex gap-3">

                  {["Home", "Work"].map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setAddressForm(
                            (current) => ({
                              ...current,
                              type,
                            })
                          )
                        }
                        className={`border px-6 py-3 text-xs font-semibold transition ${
                          addressForm.type ===
                          type
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-black/15 bg-white hover:border-[#c6a15b]"
                        }`}
                      >
                        {type === "Home"
                          ? "🏠 Home"
                          : "💼 Work"}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* DEFAULT */}

              <label className="flex cursor-pointer items-center gap-3 border border-black/10 bg-[#faf7f2] px-4 py-4">

                <input
                  type="checkbox"
                  checked={
                    addressForm.isDefault
                  }
                  onChange={(e) =>
                    setAddressForm(
                      (current) => ({
                        ...current,
                        isDefault:
                          e.target.checked,
                      })
                    )
                  }
                />

                <div>

                  <p className="text-xs font-semibold">
                    Set as default address
                  </p>

                  <p className="mt-1 text-[10px] text-[#6b6258]">
                    Use this address automatically
                    for future orders.
                  </p>

                </div>

              </label>

              {/* BUTTONS */}

              <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setAddressModal(false)
                  }
                  className="border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#c6a15b]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                >
                  {editingAddressId
                    ? "Save Address"
                    : "Add Address"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      <Footer />
    </>
  );
}