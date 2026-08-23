"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/services/authService";

import {
  getAdminCategories,
  addAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  toggleAdminCategoryStatus,
} from "@/services/adminCategoryService";

const EMPTY_FORM = {
  name: "",
  description: "",
  image: "",
  active: true,
};

export default function AdminCategoriesPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
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
    loadCategories();
  }, [router]);

  const loadCategories = () => {
    setCategories(
      getAdminCategories()
    );
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredCategories =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return categories.filter(
        (category) => {
          const matchesSearch =
            !query ||
            String(
              category.name || ""
            )
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" &&
              category.active !== false) ||
            (statusFilter === "inactive" &&
              category.active === false);

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      categories,
      search,
      statusFilter,
    ]);

  /* =====================================================
     FORM
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (
    category
  ) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description:
        category.description || "",
      image: category.image || "",
      active:
        category.active !== false,
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    let result;

    if (editingCategory) {
      result =
        updateAdminCategory(
          editingCategory.id,
          form
        );
    } else {
      result =
        addAdminCategory(form);
    }

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadCategories();

    setSuccess(result.message);

    setTimeout(() => {
      closeModal();
      setSuccess("");
    }, 700);
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = (
    category
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${category.name}" category?`
      );

    if (!confirmed) return;

    const result =
      deleteAdminCategory(
        category.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadCategories();

    setSuccess(
      "Category deleted successfully."
    );

    setTimeout(
      () => setSuccess(""),
      2000
    );
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const handleToggleStatus = (
    category
  ) => {
    const result =
      toggleAdminCategoryStatus(
        category.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadCategories();
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
          Loading Categories...
        </p>
      </main>
    );
  }

  const activeCount =
    categories.filter(
      (category) =>
        category.active !== false
    ).length;

  const inactiveCount =
    categories.length -
    activeCount;

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

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-[10px] uppercase tracking-wider text-[#999999]">
                Admin
              </p>

              <p className="text-sm font-medium text-[#111111]">
                {user.name}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* TITLE */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
                Admin Panel
              </p>

              <h1 className="mt-2 font-serif text-3xl text-[#111111] sm:text-4xl">
                Categories
              </h1>

              <p className="mt-2 text-sm text-[#6b6258]">
                Organize and manage your LUXORA store categories.
              </p>

            </div>

            <button
              onClick={openAddModal}
              className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#c6a15b]"
            >
              + Add Category
            </button>

          </div>

        </section>

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-3">

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Total Categories
            </p>

            <p className="mt-2 font-serif text-3xl text-[#111111]">
              {categories.length}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Active
            </p>

            <p className="mt-2 font-serif text-3xl text-[#111111]">
              {activeCount}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Inactive
            </p>

            <p className="mt-2 font-serif text-3xl text-[#111111]">
              {inactiveCount}
            </p>
          </div>

        </section>

        {/* SUCCESS */}

        {success && (
          <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && !showModal && (
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
              placeholder="Search categories..."
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
                All Status
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

        {/* CATEGORY LIST */}

        <section className="mt-6">

          {filteredCategories.length ===
          0 ? (

            <div className="bg-white px-6 py-16 text-center shadow-sm">

              <p className="font-serif text-2xl text-[#111111]">
                No Categories Found
              </p>

              <p className="mt-2 text-sm text-[#6b6258]">
                Create your first store category.
              </p>

              <button
                onClick={openAddModal}
                className="mt-6 bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#c6a15b]"
              >
                Add Category
              </button>

            </div>

          ) : (

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {filteredCategories.map(
                (category) => (
                  <article
                    key={category.id}
                    className="overflow-hidden bg-white shadow-sm"
                  >

                    {/* IMAGE */}

                    <div className="h-44 bg-[#f5efe6]">

                      {category.image ? (
                        <img
                          src={
                            category.image
                          }
                          alt={
                            category.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-wider text-[#999999]">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <h2 className="font-serif text-xl text-[#111111]">
                          {category.name}
                        </h2>

                        <span
                          className={`shrink-0 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                            category.active !==
                            false
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {category.active !==
                          false
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                      <p className="mt-2 min-h-10 text-sm text-[#6b6258]">
                        {category.description ||
                          "No description available."}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">

                        <button
                          onClick={() =>
                            openEditModal(
                              category
                            )
                          }
                          className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:border-[#111111]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleToggleStatus(
                              category
                            )
                          }
                          className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:border-[#c6a15b]"
                        >
                          {category.active !==
                          false
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              category
                            )
                          }
                          className="border border-red-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>

          )}

        </section>

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white shadow-xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Admin
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#111111]">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

              </div>

              <button
                onClick={closeModal}
                className="text-2xl text-[#6b6258] hover:text-[#111111]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* NAME */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                  Category Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarees"
                  required
                  className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  rows={4}
                  placeholder="Category description..."
                  className="w-full resize-none border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                />

              </div>

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                  Category Image URL
                </label>

                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                />

              </div>

              {/* ACTIVE */}

              <label className="flex cursor-pointer items-center gap-3 border border-black/10 p-4">

                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 accent-black"
                />

                <span>

                  <span className="block text-xs font-semibold uppercase tracking-wider">
                    Active Category
                  </span>

                  <span className="mt-1 block text-xs text-[#999999]">
                    Active categories can be used in the store.
                  </span>

                </span>

              </label>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  className="border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:border-[#111111]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#c6a15b]"
                >
                  {editingCategory
                    ? "Update Category"
                    : "Add Category"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}