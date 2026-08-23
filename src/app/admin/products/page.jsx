"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  getCurrentUser,
} from "@/services/authService";

import {
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleAdminProductStatus,
  toggleAdminProductFeatured,
} from "@/services/adminProductService";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  price: "",
  discount: "",
  stock: "",
  image: "",
  featured: false,
  active: true,
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     LOAD ADMIN
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
    loadProducts();
  }, [router]);

  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  const loadProducts = () => {
    const data =
      getAdminProducts();

    setProducts(data);
  };

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = useMemo(() => {
    const values = products
      .map((product) =>
        String(
          product.category || ""
        ).trim()
      )
      .filter(Boolean);

    return [...new Set(values)];
  }, [products]);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return products.filter(
        (product) => {
          const matchesSearch =
            !query ||
            String(
              product.name || ""
            )
              .toLowerCase()
              .includes(query) ||
            String(
              product.category || ""
            )
              .toLowerCase()
              .includes(query);

          const matchesCategory =
            categoryFilter === "all" ||
            String(
              product.category || ""
            ).toLowerCase() ===
              categoryFilter.toLowerCase();

          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" &&
              product.active !== false) ||
            (statusFilter === "inactive" &&
              product.active === false);

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          );
        }
      );
    }, [
      products,
      search,
      categoryFilter,
      statusFilter,
    ]);

  /* =====================================================
     FORM CHANGE
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

  /* =====================================================
     OPEN ADD MODAL
  ===================================================== */

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /* =====================================================
     OPEN EDIT MODAL
  ===================================================== */

  const openEditModal = (
    product
  ) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description:
        product.description || "",
      category:
        product.category || "",
      price:
        product.price ?? "",
      discount:
        product.discount ?? "",
      stock:
        product.stock ?? "",
      image:
        product.image || "",
      featured:
        product.featured === true,
      active:
        product.active !== false,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  /* =====================================================
     SAVE PRODUCT
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    let result;

    if (editingProduct) {
      result =
        updateAdminProduct(
          editingProduct.id,
          form
        );
    } else {
      result =
        addAdminProduct(form);
    }

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadProducts();

    setSuccess(
      editingProduct
        ? "Product updated successfully."
        : "Product added successfully."
    );

    setTimeout(() => {
      closeModal();
      setSuccess("");
    }, 700);
  };

  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  const handleDelete = (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"? This action cannot be undone.`
      );

    if (!confirmed) return;

    const result =
      deleteAdminProduct(
        product.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadProducts();

    setSuccess(
      "Product deleted successfully."
    );

    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };

  /* =====================================================
     TOGGLE STATUS
  ===================================================== */

  const handleToggleStatus = (
    product
  ) => {
    const result =
      toggleAdminProductStatus(
        product.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadProducts();
  };

  /* =====================================================
     TOGGLE FEATURED
  ===================================================== */

  const handleToggleFeatured = (
    product
  ) => {
    const result =
      toggleAdminProductFeatured(
        product.id
      );

    if (!result.success) {
      setError(result.message);
      return;
    }

    loadProducts();
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

  /* =====================================================
     LOADING
  ===================================================== */

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5efe6]">
        <p className="text-sm text-[#6b6258]">
          Loading Products...
        </p>
      </main>
    );
  }

  /* =====================================================
     STATS
  ===================================================== */

  const activeProducts =
    products.filter(
      (product) =>
        product.active !== false
    ).length;

  const featuredProducts =
    products.filter(
      (product) =>
        product.featured === true
    ).length;

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) <=
        5
    ).length;

  return (
    <main className="min-h-screen bg-[#f5efe6]">

      {/* =================================================
          HEADER
      ================================================= */}

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
              className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-white"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* TITLE */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
                Admin Panel
              </p>

              <h1 className="mt-2 font-serif text-3xl text-[#111111] sm:text-4xl">
                Products
              </h1>

              <p className="mt-2 text-sm text-[#6b6258]">
                Add, edit and manage your LUXORA products.
              </p>

            </div>

            <button
              onClick={openAddModal}
              className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#c6a15b]"
            >
              + Add Product
            </button>

          </div>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Total Products
            </p>
            <p className="mt-2 font-serif text-3xl text-[#111111]">
              {products.length}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Active
            </p>
            <p className="mt-2 font-serif text-3xl text-[#111111]">
              {activeProducts}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Featured
            </p>
            <p className="mt-2 font-serif text-3xl text-[#111111]">
              {featuredProducts}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Low Stock
            </p>
            <p className="mt-2 font-serif text-3xl text-[#111111]">
              {lowStockProducts}
            </p>
          </div>

        </section>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && !showModal && (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="mt-8 bg-white p-4 shadow-sm sm:p-5">

          <div className="grid gap-3 md:grid-cols-3">

            {/* SEARCH */}

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            />

            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
              className="border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            >

              <option value="all">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}

            </select>

            {/* STATUS */}

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

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <section className="mt-6">

          {filteredProducts.length === 0 ? (

            <div className="bg-white px-6 py-16 text-center shadow-sm">

              <p className="font-serif text-2xl text-[#111111]">
                No Products Found
              </p>

              <p className="mt-2 text-sm text-[#6b6258]">
                Add your first product to start managing your store.
              </p>

              <button
                onClick={openAddModal}
                className="mt-6 bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#c6a15b]"
              >
                Add Product
              </button>

            </div>

          ) : (

            <div className="space-y-4">

              {filteredProducts.map(
                (product) => {

                  const finalPrice =
                    Number(
                      product.price || 0
                    ) *
                    (1 -
                      Number(
                        product.discount ||
                          0
                      ) /
                        100);

                  return (
                    <article
                      key={product.id}
                      className="bg-white p-4 shadow-sm sm:p-5"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                        {/* IMAGE */}

                        <div className="h-28 w-full shrink-0 overflow-hidden bg-[#f5efe6] sm:w-28">

                          {product.image ? (
                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
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

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="font-serif text-xl text-[#111111]">
                              {product.name}
                            </h2>

                            {product.featured && (
                              <span className="bg-[#c6a15b] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">
                                Featured
                              </span>
                            )}

                            <span
                              className={`px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                                product.active !== false
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {product.active !== false
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </div>

                          <p className="mt-1 text-xs uppercase tracking-wider text-[#c6a15b]">
                            {product.category ||
                              "Uncategorized"}
                          </p>

                          <p className="mt-2 line-clamp-2 text-sm text-[#6b6258]">
                            {product.description ||
                              "No description available."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">

                            <span className="font-semibold text-[#111111]">
                              ₹
                              {finalPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            {Number(
                              product.discount ||
                                0
                            ) > 0 && (
                              <span className="text-xs text-[#999999] line-through">
                                ₹
                                {Number(
                                  product.price ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            )}

                            <span
                              className={
                                Number(
                                  product.stock ||
                                    0
                                ) <= 5
                                  ? "font-semibold text-red-600"
                                  : "text-[#6b6258]"
                              }
                            >
                              Stock:{" "}
                              {product.stock ||
                                0}
                            </span>

                            <span className="text-[#6b6258]">
                              Discount:{" "}
                              {product.discount ||
                                0}
                              %
                            </span>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-wrap gap-2 lg:w-48 lg:justify-end">

                          <button
                            onClick={() =>
                              openEditModal(
                                product
                              )
                            }
                            className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#111111] hover:border-[#111111]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleToggleStatus(
                                product
                              )
                            }
                            className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#111111] hover:border-[#c6a15b]"
                          >
                            {product.active !== false
                              ? "Disable"
                              : "Enable"}
                          </button>

                          <button
                            onClick={() =>
                              handleToggleFeatured(
                                product
                              )
                            }
                            className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#111111] hover:border-[#c6a15b]"
                          >
                            {product.featured
                              ? "Unfeature"
                              : "Feature"}
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                            className="border border-red-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 sm:px-6">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  Admin
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#111111]">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-2xl text-[#6b6258] hover:text-[#111111]"
              >
                ×
              </button>

            </div>

            {/* FORM */}

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

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Product Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Silk Saree"
                  className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows={4}
                  className="w-full resize-none border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Category *
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Sarees"
                  className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  required
                />

              </div>

              {/* PRICE / DISCOUNT / STOCK */}

              <div className="grid gap-4 sm:grid-cols-3">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    Price *
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="₹ 0"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    required
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    Discount %
                  </label>

                  <input
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    Stock *
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    required
                  />

                </div>

              </div>

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Product Image URL
                </label>

                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                />

                <p className="mt-2 text-[11px] text-[#999999]">
                  Abhi image URL use kar rahe hain. Image upload system baad me add kar sakte hain.
                </p>

              </div>

              {/* OPTIONS */}

              <div className="grid gap-3 sm:grid-cols-2">

                <label className="flex cursor-pointer items-center gap-3 border border-black/10 p-4">

                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black"
                  />

                  <span>

                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                      Active Product
                    </span>

                    <span className="mt-1 block text-xs text-[#999999]">
                      Customer store par visible
                    </span>

                  </span>

                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-black/10 p-4">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black"
                  />

                  <span>

                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                      Featured Product
                    </span>

                    <span className="mt-1 block text-xs text-[#999999]">
                      Featured section me show
                    </span>

                  </span>

                </label>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  className="border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:border-[#111111]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#c6a15b]"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}