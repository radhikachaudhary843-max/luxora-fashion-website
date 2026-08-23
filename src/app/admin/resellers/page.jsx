"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/services/authService";

import {
  getAdminResellers,
  updateAdminReseller,
  toggleAdminResellerStatus,
  deleteAdminReseller,
} from "@/services/adminResellerService";

export default function AdminResellersPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [resellers, setResellers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedReseller, setSelectedReseller] =
    useState(null);

  const [editMode, setEditMode] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      router.replace("/");
      return;
    }

    setUser(currentUser);
    loadResellers();
  }, [router]);

  const loadResellers = () => {
    setResellers(getAdminResellers());
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredResellers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resellers.filter((reseller) => {
      const searchableText = [
        reseller.name,
        reseller.email,
        reseller.phone,
        reseller.businessName,
        reseller.businessType,
        reseller.gstNumber,
        reseller.city,
        reseller.state,
      ]
        .map((value) =>
          String(value || "").toLowerCase()
        )
        .join(" ");

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const status =
        reseller.status === "inactive"
          ? "inactive"
          : "active";

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [resellers, search, statusFilter]);

  /* =====================================================
     OPEN EDIT
  ===================================================== */

  const openEdit = (reseller) => {
    setSelectedReseller(reseller);

    setEditForm({
      name: reseller.name || "",
      email: reseller.email || "",
      phone: reseller.phone || "",
      businessName: reseller.businessName || "",
      businessType: reseller.businessType || "",
      gstNumber: reseller.gstNumber || "",
      address: reseller.address || "",
      city: reseller.city || "",
      state: reseller.state || "",
      pincode: reseller.pincode || "",
    });

    setEditMode(true);
    setError("");
  };

  /* =====================================================
     UPDATE
  ===================================================== */

  const handleUpdate = (e) => {
    e.preventDefault();

    const result = updateAdminReseller(
      selectedReseller.id,
      editForm
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadResellers();

    setSelectedReseller(result.reseller);
    setEditMode(false);

    setSuccess(
      "Reseller updated successfully."
    );

    setTimeout(() => setSuccess(""), 1800);
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const handleStatusToggle = (reseller) => {
    const result =
      toggleAdminResellerStatus(
        reseller.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadResellers();

    if (
      selectedReseller?.id === reseller.id
    ) {
      setSelectedReseller(result.reseller);
    }

    setSuccess(result.message);

    setTimeout(() => setSuccess(""), 1800);
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = (reseller) => {
    const confirmed = window.confirm(
      `Delete reseller "${reseller.businessName || reseller.name}"?`
    );

    if (!confirmed) return;

    const result =
      deleteAdminReseller(reseller.id);

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadResellers();

    setSelectedReseller(null);
    setEditMode(false);

    setSuccess(
      "Reseller deleted successfully."
    );

    setTimeout(() => setSuccess(""), 1800);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "luxora_current_user"
    );

    router.replace("/login");
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5efe6]">
        <p className="text-sm text-[#6b6258]">
          Loading Resellers...
        </p>
      </main>
    );
  }

  const activeResellers =
    resellers.filter(
      (reseller) =>
        reseller.status !== "inactive"
    ).length;

  const inactiveResellers =
    resellers.filter(
      (reseller) =>
        reseller.status === "inactive"
    ).length;

  return (
    <main className="min-h-screen bg-[#f5efe6]">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-white">

        <div className="flex items-center justify-between px-4 py-5 sm:px-6">

          <div className="flex items-center gap-4">

            <Link
              href="/admin"
              className="text-sm text-[#6b6258] hover:text-[#111111]"
            >
              ← Dashboard
            </Link>

            <span className="hidden h-5 w-px bg-black/10 sm:block" />

            <Link
              href="/"
              className="font-serif text-xl tracking-[0.2em]"
            >
              LUXORA
            </Link>

          </div>

          <button
            onClick={handleLogout}
            className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white"
          >
            Logout
          </button>

        </div>

      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <section className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
            Admin Panel
          </p>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
            Resellers
          </h1>

          <p className="mt-2 text-sm text-[#6b6258]">
            View, edit and manage LUXORA reseller accounts.
          </p>

        </section>

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-3">

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Total Resellers
            </p>

            <p className="mt-2 font-serif text-3xl">
              {resellers.length}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Active
            </p>

            <p className="mt-2 font-serif text-3xl">
              {activeResellers}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Inactive
            </p>

            <p className="mt-2 font-serif text-3xl">
              {inactiveResellers}
            </p>
          </div>

        </section>

        {/* MESSAGES */}

        {success && (
          <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FILTERS */}

        <section className="mt-8 bg-white p-4 shadow-sm">

          <div className="grid gap-3 md:grid-cols-2">

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search reseller, business, GST, city..."
              className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            >
              <option value="all">
                All Resellers
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

          </div>

        </section>

        {/* TABLE */}

        <section className="mt-6">

          {filteredResellers.length === 0 ? (

            <div className="bg-white px-6 py-16 text-center shadow-sm">

              <p className="font-serif text-2xl">
                No Resellers Found
              </p>

              <p className="mt-2 text-sm text-[#6b6258]">
                Reseller accounts will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto bg-white shadow-sm">

              <table className="w-full min-w-[1000px]">

                <thead className="border-b border-black/10 bg-[#faf8f4]">

                  <tr>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-wider text-[#999999]">
                      Reseller
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-wider text-[#999999]">
                      Business
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-wider text-[#999999]">
                      GST
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-wider text-[#999999]">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-wider text-[#999999]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] uppercase tracking-wider text-[#999999]">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredResellers.map(
                    (reseller) => {

                      const inactive =
                        reseller.status ===
                        "inactive";

                      return (
                        <tr
                          key={reseller.id}
                          className="border-b border-black/5 last:border-0"
                        >

                          <td className="px-5 py-5">

                            <p className="text-sm font-semibold">
                              {reseller.name}
                            </p>

                            <p className="mt-1 text-xs text-[#999999]">
                              {reseller.email}
                            </p>

                            <p className="mt-1 text-xs text-[#999999]">
                              {reseller.phone || "—"}
                            </p>

                          </td>

                          <td className="px-5 py-5">

                            <p className="text-sm">
                              {reseller.businessName ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-[#999999]">
                              {reseller.businessType ||
                                "—"}
                            </p>

                          </td>

                          <td className="px-5 py-5 text-sm text-[#6b6258]">
                            {reseller.gstNumber ||
                              "—"}
                          </td>

                          <td className="px-5 py-5 text-sm text-[#6b6258]">
                            {[
                              reseller.city,
                              reseller.state,
                            ]
                              .filter(Boolean)
                              .join(", ") || "—"}
                          </td>

                          <td className="px-5 py-5">

                            <span
                              className={`inline-flex px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                                inactive
                                  ? "bg-red-50 text-red-600"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {inactive
                                ? "Inactive"
                                : "Active"}
                            </span>

                          </td>

                          <td className="px-5 py-5">

                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() => {
                                  setSelectedReseller(
                                    reseller
                                  );
                                  setEditMode(false);
                                }}
                                className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white"
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  openEdit(reseller)
                                }
                                className="border border-[#c6a15b] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#9b7739]"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusToggle(
                                    reseller
                                  )
                                }
                                className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
                              >
                                {inactive
                                  ? "Activate"
                                  : "Deactivate"}
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(reseller)
                                }
                                className="border border-red-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

      {/* =================================================
          RESELLER MODAL
      ================================================= */}

      {selectedReseller && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Reseller
                </p>

                <h2 className="mt-1 font-serif text-xl">
                  {editMode
                    ? "Edit Reseller"
                    : selectedReseller.name}
                </h2>

              </div>

              <button
                onClick={() => {
                  setSelectedReseller(null);
                  setEditMode(false);
                }}
                className="text-2xl text-[#6b6258]"
              >
                ×
              </button>

            </div>

            {editMode ? (

              <form
                onSubmit={handleUpdate}
                className="grid gap-5 p-6 sm:grid-cols-2"
              >

                {[
                  ["name", "Full Name"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                  ["businessName", "Business Name"],
                  ["businessType", "Business Type"],
                  ["gstNumber", "GST Number"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pincode", "PIN Code"],
                ].map(([field, label]) => (

                  <div key={field}>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      {label}
                    </label>

                    <input
                      type={
                        field === "email"
                          ? "email"
                          : "text"
                      }
                      value={
                        editForm[field]
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [field]:
                            e.target.value,
                        })
                      }
                      className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                  </div>

                ))}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Address
                  </label>

                  <textarea
                    rows={3}
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        address:
                          e.target.value,
                      })
                    }
                    className="w-full resize-none border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

                <div className="flex gap-3 sm:col-span-2">

                  <button
                    type="submit"
                    className="flex-1 bg-[#111111] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#c6a15b]"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditMode(false)
                    }
                    className="border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              <div className="space-y-6 p-6">

                <div className="grid gap-5 sm:grid-cols-2">

                  <Info
                    label="Full Name"
                    value={selectedReseller.name}
                  />

                  <Info
                    label="Email"
                    value={selectedReseller.email}
                  />

                  <Info
                    label="Phone"
                    value={
                      selectedReseller.phone ||
                      "Not provided"
                    }
                  />

                  <Info
                    label="Business Name"
                    value={
                      selectedReseller.businessName ||
                      "Not provided"
                    }
                  />

                  <Info
                    label="Business Type"
                    value={
                      selectedReseller.businessType ||
                      "Not provided"
                    }
                  />

                  <Info
                    label="GST Number"
                    value={
                      selectedReseller.gstNumber ||
                      "Not provided"
                    }
                  />

                  <Info
                    label="City"
                    value={
                      selectedReseller.city ||
                      "Not provided"
                    }
                  />

                  <Info
                    label="State"
                    value={
                      selectedReseller.state ||
                      "Not provided"
                    }
                  />

                  <Info
                    label="PIN Code"
                    value={
                      selectedReseller.pincode ||
                      "Not provided"
                    }
                  />

                  <Info
                    label="Status"
                    value={
                      selectedReseller.status ===
                      "inactive"
                        ? "Inactive"
                        : "Active"
                    }
                  />

                </div>

                <Info
                  label="Address"
                  value={
                    selectedReseller.address ||
                    "Not provided"
                  }
                />

                <Info
                  label="Reseller ID"
                  value={
                    selectedReseller.id
                  }
                />

                <div className="flex gap-3 pt-2">

                  <button
                    onClick={() =>
                      openEdit(
                        selectedReseller
                      )
                    }
                    className="flex-1 bg-[#111111] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#c6a15b]"
                  >
                    Edit Reseller
                  </button>

                  <button
                    onClick={() =>
                      handleStatusToggle(
                        selectedReseller
                      )
                    }
                    className="border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  >
                    {selectedReseller.status ===
                    "inactive"
                      ? "Activate"
                      : "Deactivate"}
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </main>
  );
}

/* =========================================================
   INFO COMPONENT
========================================================= */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[#999999]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-[#111111]">
        {value}
      </p>
    </div>
  );
}