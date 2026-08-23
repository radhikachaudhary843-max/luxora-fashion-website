"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import {
  getCurrentUser,
  getUsers,
} from "@/services/authService";

const USERS_KEY = "luxora_users";
const CURRENT_USER_KEY = "luxora_current_user";

export default function ResellerProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    businessType: "",
    phone: "",
    businessEmail: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
    pan: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    storeDescription: "",
  });

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "reseller") {
      router.replace("/");
      return;
    }

    const users = getUsers();

    const reseller = users.find(
      (item) => item.id === currentUser.id
    );

    if (!reseller) {
      router.replace("/login");
      return;
    }

    setUser(reseller);

    setForm({
      name: reseller.name || "",
      businessName: reseller.businessName || "",
      businessType: reseller.businessType || "",
      phone: reseller.phone || "",
      businessEmail:
        reseller.businessEmail || reseller.email || "",
      address: reseller.address || "",
      city: reseller.city || "",
      state: reseller.state || "",
      pincode: reseller.pincode || "",
      gstin: reseller.gstin || "",
      pan: reseller.pan || "",
      bankName: reseller.bankName || "",
      accountHolderName:
        reseller.accountHolderName || "",
      accountNumber: reseller.accountNumber || "",
      ifsc: reseller.ifsc || "",
      storeDescription:
        reseller.storeDescription || "",
    });

    setLoading(false);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Seller name is required.");
      return;
    }

    if (!form.businessName.trim()) {
      setError("Business name is required.");
      return;
    }

    if (!form.businessType.trim()) {
      setError("Please select a business type.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!form.address.trim()) {
      setError("Business address is required.");
      return;
    }

    if (!form.city.trim()) {
      setError("City is required.");
      return;
    }

    if (!form.state.trim()) {
      setError("State is required.");
      return;
    }

    if (!form.pincode.trim()) {
      setError("Pincode is required.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (form.gstin.trim()) {
      const gstin = form.gstin.trim().toUpperCase();

      if (
        gstin.length !== 15
      ) {
        setError("GSTIN must contain 15 characters.");
        return;
      }
    }

    setSaving(true);

    try {
      const users = getUsers();

      const userIndex = users.findIndex(
        (item) => item.id === user.id
      );

      if (userIndex === -1) {
        setError("Reseller account not found.");
        setSaving(false);
        return;
      }

      const updatedReseller = {
        ...users[userIndex],

        name: form.name.trim(),

        businessName:
          form.businessName.trim(),

        businessType:
          form.businessType.trim(),

        phone:
          form.phone.trim(),

        businessEmail:
          form.businessEmail.trim().toLowerCase(),

        address:
          form.address.trim(),

        city:
          form.city.trim(),

        state:
          form.state.trim(),

        pincode:
          form.pincode.trim(),

        gstin:
          form.gstin.trim().toUpperCase(),

        pan:
          form.pan.trim().toUpperCase(),

        bankName:
          form.bankName.trim(),

        accountHolderName:
          form.accountHolderName.trim(),

        accountNumber:
          form.accountNumber.trim(),

        ifsc:
          form.ifsc.trim().toUpperCase(),

        storeDescription:
          form.storeDescription.trim(),

        updatedAt:
          new Date().toISOString(),
      };

      const updatedUsers = [...users];

      updatedUsers[userIndex] =
        updatedReseller;

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify(updatedUsers)
      );

      const updatedCurrentUser = {
        id: updatedReseller.id,
        name: updatedReseller.name,
        email: updatedReseller.email,
        phone: updatedReseller.phone,
        role: updatedReseller.role,
        businessName:
          updatedReseller.businessName,
      };

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(updatedCurrentUser)
      );

      window.dispatchEvent(
        new Event("authUpdated")
      );

      setUser(updatedReseller);

      setMessage(
        "Your reseller profile has been updated successfully."
      );
    } catch (saveError) {
      console.error(
        "Failed to update reseller profile:",
        saveError
      );

      setError(
        "Unable to save profile. Please try again."
      );
    }

    setSaving(false);
  };

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

        {/* HEADER */}

        <section className="border-b border-black/10 px-6 py-12 lg:px-8">

          <div className="mx-auto max-w-5xl">

            <Link
              href="/reseller"
              className="text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:text-[#c6a15b]"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA Seller Centre
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              Seller Profile
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Manage your business and seller information.
            </p>

          </div>

        </section>

        {/* CONTENT */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-5xl">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* ACCOUNT INFORMATION */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-6">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Account
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Account Information
                  </h2>

                  <p className="mt-2 text-xs text-[#6b6258]">
                    Your login email, account ID and role cannot
                    be changed from this page.
                  </p>

                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Seller Name
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6b6258]">
                      Login Email
                    </label>

                    <input
                      value={user?.email || ""}
                      disabled
                      className="w-full cursor-not-allowed border border-black/10 bg-[#f5f2ed] px-4 py-3 text-sm text-[#777777]"
                    />

                  </div>

                </div>

              </section>

              {/* BUSINESS INFORMATION */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-6">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Business
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Business Information
                  </h2>

                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Business Name *
                    </label>

                    <input
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Your business name"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Business Type *
                    </label>

                    <select
                      name="businessType"
                      value={form.businessType}
                      onChange={handleChange}
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    >
                      <option value="">
                        Select business type
                      </option>

                      <option value="Fashion Brand">
                        Fashion Brand
                      </option>

                      <option value="Clothing Store">
                        Clothing Store
                      </option>

                      <option value="Jewellery">
                        Jewellery
                      </option>

                      <option value="Beauty & Personal Care">
                        Beauty & Personal Care
                      </option>

                      <option value="Accessories">
                        Accessories
                      </option>

                      <option value="Footwear">
                        Footwear
                      </option>

                      <option value="Home & Lifestyle">
                        Home & Lifestyle
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Business Email
                    </label>

                    <input
                      name="businessEmail"
                      type="email"
                      value={form.businessEmail}
                      onChange={handleChange}
                      placeholder="business@example.com"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Phone Number *
                    </label>

                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10 digit mobile number"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

                <div className="mt-5">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Store Description
                  </label>

                  <textarea
                    name="storeDescription"
                    value={form.storeDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell customers about your store..."
                    className="w-full resize-none border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                  />

                </div>

              </section>

              {/* ADDRESS */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-6">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Location
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Business Address
                  </h2>

                </div>

                <div className="mt-7 space-y-5">

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Address *
                    </label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="House / shop / street address"
                      className="w-full resize-none border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">

                    <div>

                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                        City *
                      </label>

                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                        State *
                      </label>

                      <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                        Pincode *
                      </label>

                      <input
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="6 digit"
                        className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                      />

                    </div>

                  </div>

                </div>

              </section>

              {/* TAX INFORMATION */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-6">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Verification
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Tax Information
                  </h2>

                  <p className="mt-2 text-xs text-[#6b6258]">
                    These fields are optional for now.
                  </p>

                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      GSTIN
                    </label>

                    <input
                      name="gstin"
                      value={form.gstin}
                      onChange={handleChange}
                      maxLength={15}
                      placeholder="15 character GSTIN"
                      className="w-full border border-black/15 px-4 py-3 text-sm uppercase outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      PAN
                    </label>

                    <input
                      name="pan"
                      value={form.pan}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="PAN number"
                      className="w-full border border-black/15 px-4 py-3 text-sm uppercase outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </section>

              {/* BANK DETAILS */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-6">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Payout
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Bank Details
                  </h2>

                  <p className="mt-2 text-xs text-[#6b6258]">
                    Used later for reseller payouts.
                  </p>

                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Bank Name
                    </label>

                    <input
                      name="bankName"
                      value={form.bankName}
                      onChange={handleChange}
                      placeholder="Bank name"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Account Holder Name
                    </label>

                    <input
                      name="accountHolderName"
                      value={form.accountHolderName}
                      onChange={handleChange}
                      placeholder="Account holder name"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Account Number
                    </label>

                    <input
                      name="accountNumber"
                      value={form.accountNumber}
                      onChange={handleChange}
                      inputMode="numeric"
                      placeholder="Account number"
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      IFSC Code
                    </label>

                    <input
                      name="ifsc"
                      value={form.ifsc}
                      onChange={handleChange}
                      maxLength={11}
                      placeholder="IFSC code"
                      className="w-full border border-black/15 px-4 py-3 text-sm uppercase outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </section>

              {/* MESSAGE */}

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                <Link
                  href="/reseller"
                  className="border border-black/15 px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-[#c6a15b]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>

              </div>

            </form>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}