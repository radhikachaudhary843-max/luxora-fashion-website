"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  getCurrentUser,
} from "@/services/authService";

import {
  getAdminCustomers,
  updateAdminCustomer,
  toggleAdminCustomerStatus,
  deleteAdminCustomer,
} from "@/services/adminCustomerService";

export default function AdminCustomersPage() {
  const router = useRouter();

  const [user, setUser] =
    useState(null);

  const [customers, setCustomers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [editMode, setEditMode] =
    useState(false);

  const [editForm, setEditForm] =
    useState({
      name: "",
      email: "",
      phone: "",
    });

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    const currentUser =
      getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      router.replace("/");
      return;
    }

    setUser(currentUser);
    loadCustomers();
  }, [router]);

  const loadCustomers = () => {
    setCustomers(
      getAdminCustomers()
    );
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredCustomers =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return customers.filter(
        (customer) => {
          const name =
            String(
              customer.name || ""
            ).toLowerCase();

          const email =
            String(
              customer.email || ""
            ).toLowerCase();

          const phone =
            String(
              customer.phone || ""
            ).toLowerCase();

          const matchesSearch =
            !query ||
            name.includes(query) ||
            email.includes(query) ||
            phone.includes(query);

          const status =
            customer.status === "inactive"
              ? "inactive"
              : "active";

          const matchesStatus =
            statusFilter === "all" ||
            status === statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      customers,
      search,
      statusFilter,
    ]);

  /* =====================================================
     OPEN EDIT
  ===================================================== */

  const openEdit = (customer) => {
    setSelectedCustomer(customer);

    setEditForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
    });

    setEditMode(true);
    setError("");
  };

  /* =====================================================
     SAVE EDIT
  ===================================================== */

  const handleUpdate = (e) => {
    e.preventDefault();

    const result =
      updateAdminCustomer(
        selectedCustomer.id,
        editForm
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadCustomers();

    setSelectedCustomer(
      result.customer
    );

    setEditMode(false);

    setSuccess(
      "Customer updated successfully."
    );

    setTimeout(
      () => setSuccess(""),
      1800
    );
  };

  /* =====================================================
     TOGGLE STATUS
  ===================================================== */

  const handleStatusToggle = (
    customer
  ) => {
    const result =
      toggleAdminCustomerStatus(
        customer.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadCustomers();

    if (
      selectedCustomer?.id ===
      customer.id
    ) {
      setSelectedCustomer(
        result.customer
      );
    }

    setSuccess(result.message);

    setTimeout(
      () => setSuccess(""),
      1800
    );
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = (
    customer
  ) => {
    const confirmed =
      window.confirm(
        `Delete customer "${customer.name}"?`
      );

    if (!confirmed) return;

    const result =
      deleteAdminCustomer(
        customer.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadCustomers();

    if (
      selectedCustomer?.id ===
      customer.id
    ) {
      setSelectedCustomer(null);
      setEditMode(false);
    }

    setSuccess(
      "Customer deleted successfully."
    );

    setTimeout(
      () => setSuccess(""),
      1800
    );
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
          Loading Customers...
        </p>
      </main>
    );
  }

  /* =====================================================
     STATS
  ===================================================== */

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status !== "inactive"
    ).length;

  const inactiveCustomers =
    customers.filter(
      (customer) =>
        customer.status === "inactive"
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
              className="font-serif text-xl tracking-[0.2em] text-[#111111]"
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

        {/* TITLE */}

        <section className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
            Admin Panel
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#111111] sm:text-4xl">
            Customers
          </h1>

          <p className="mt-2 text-sm text-[#6b6258]">
            View, edit and manage LUXORA customer accounts.
          </p>

        </section>

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-3">

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Total Customers
            </p>

            <p className="mt-2 font-serif text-3xl">
              {customers.length}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Active
            </p>

            <p className="mt-2 font-serif text-3xl">
              {activeCustomers}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-[#999999]">
              Inactive
            </p>

            <p className="mt-2 font-serif text-3xl">
              {inactiveCustomers}
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

        {/* FILTER */}

        <section className="mt-8 bg-white p-4 shadow-sm">

          <div className="grid gap-3 md:grid-cols-2">

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search name, email or phone..."
              className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            >

              <option value="all">
                All Customers
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

        {/* CUSTOMER TABLE */}

        <section className="mt-6">

          {filteredCustomers.length ===
          0 ? (

            <div className="bg-white px-6 py-16 text-center shadow-sm">

              <p className="font-serif text-2xl">
                No Customers Found
              </p>

              <p className="mt-2 text-sm text-[#6b6258]">
                Customer accounts will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto bg-white shadow-sm">

              <table className="w-full min-w-[800px]">

                <thead className="border-b border-black/10 bg-[#faf8f4]">

                  <tr>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-wider text-[#999999]">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-wider text-[#999999]">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-wider text-[#999999]">
                      Joined
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

                  {filteredCustomers.map(
                    (customer) => {

                      const inactive =
                        customer.status ===
                        "inactive";

                      return (
                        <tr
                          key={customer.id}
                          className="border-b border-black/5 last:border-0"
                        >

                          <td className="px-5 py-5">

                            <p className="text-sm font-semibold text-[#111111]">
                              {customer.name}
                            </p>

                            <p className="mt-1 text-xs text-[#999999]">
                              {customer.email}
                            </p>

                          </td>

                          <td className="px-5 py-5 text-sm text-[#6b6258]">
                            {customer.phone ||
                              "—"}
                          </td>

                          <td className="px-5 py-5 text-sm text-[#6b6258]">
                            {customer.createdAt
                              ? new Date(
                                  customer.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}
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
                                  setSelectedCustomer(
                                    customer
                                  );
                                  setEditMode(
                                    false
                                  );
                                }}
                                className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white"
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  openEdit(
                                    customer
                                  )
                                }
                                className="border border-[#c6a15b] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#9b7739]"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusToggle(
                                    customer
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
                                  handleDelete(
                                    customer
                                  )
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
          CUSTOMER MODAL
      ================================================= */}

      {selectedCustomer && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Customer
                </p>

                <h2 className="mt-1 font-serif text-xl">
                  {editMode
                    ? "Edit Customer"
                    : selectedCustomer.name}
                </h2>

              </div>

              <button
                onClick={() => {
                  setSelectedCustomer(
                    null
                  );
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
                className="space-y-5 p-6"
              >

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Name
                  </label>

                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Email
                  </label>

                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Phone
                  </label>

                  <input
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />
                </div>

                <div className="flex gap-3 pt-2">

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

              <div className="space-y-5 p-6">

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#999999]">
                    Full Name
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedCustomer.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#999999]">
                    Email
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedCustomer.email}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#999999]">
                    Phone
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedCustomer.phone ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#999999]">
                    Account Status
                  </p>

                  <p className="mt-1 text-sm">
                    {selectedCustomer.status ===
                    "inactive"
                      ? "Inactive"
                      : "Active"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#999999]">
                    Customer ID
                  </p>

                  <p className="mt-1 break-all text-xs text-[#6b6258]">
                    {selectedCustomer.id}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">

                  <button
                    onClick={() =>
                      openEdit(
                        selectedCustomer
                      )
                    }
                    className="flex-1 bg-[#111111] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#c6a15b]"
                  >
                    Edit Customer
                  </button>

                  <button
                    onClick={() =>
                      handleStatusToggle(
                        selectedCustomer
                      )
                    }
                    className="border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  >
                    {selectedCustomer.status ===
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