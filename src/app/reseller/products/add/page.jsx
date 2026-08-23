"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import { getCurrentUser } from "@/services/authService";

const RESELLER_PRODUCTS_KEY = "luxora_reseller_products";

const initialForm = {
  name: "",
  category: "",
  brand: "",
  sku: "",
  price: "",
  originalPrice: "",
  stock: "",
  image: "",
  description: "",
  sizes: "",
  colors: "",
  material: "",
  badge: "",
  status: "active",
};

export default function AddResellerProductPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================
  // AUTH CHECK
  // =========================

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "reseller") {
      router.replace("/");
    }
  }, [router]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "reseller") {
      router.replace("/");
      return;
    }

    const name = form.name.trim();
    const category = form.category.trim();

    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice || 0);
    const stock = Number(form.stock);

    // =========================
    // VALIDATION
    // =========================

    if (!name) {
      setError("Product name is required.");
      return;
    }

    if (!category) {
      setError("Please select a product category.");
      return;
    }

    if (!form.price || Number.isNaN(price) || price <= 0) {
      setError("Please enter a valid selling price.");
      return;
    }

    if (
      form.originalPrice &&
      (Number.isNaN(originalPrice) || originalPrice <= 0)
    ) {
      setError("Please enter a valid original price.");
      return;
    }

    if (
      form.originalPrice &&
      originalPrice < price
    ) {
      setError(
        "Original price should be greater than or equal to selling price."
      );
      return;
    }

    if (
      form.stock === "" ||
      Number.isNaN(stock) ||
      stock < 0
    ) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (
      form.sku.trim() &&
      form.sku.trim().length < 2
    ) {
      setError("SKU must contain at least 2 characters.");
      return;
    }

    setSaving(true);

    try {
      // =========================
      // GET EXISTING PRODUCTS
      // =========================

      const savedProducts = JSON.parse(
        localStorage.getItem(RESELLER_PRODUCTS_KEY) || "[]"
      );

      const products = Array.isArray(savedProducts)
        ? savedProducts
        : [];

      // =========================
      // CHECK DUPLICATE SKU
      // =========================

      const enteredSku = form.sku.trim().toLowerCase();

      if (enteredSku) {
        const duplicateSku = products.some(
          (product) =>
            product.resellerId === currentUser.id &&
            String(product.sku || "")
              .trim()
              .toLowerCase() === enteredSku
        );

        if (duplicateSku) {
          setError(
            "You already have a product with this SKU."
          );
          setSaving(false);
          return;
        }
      }

      // =========================
      // CALCULATE DISCOUNT
      // =========================

      let discount = 0;

      if (
        originalPrice > 0 &&
        originalPrice > price
      ) {
        discount = Math.round(
          ((originalPrice - price) /
            originalPrice) *
            100
        );
      }

      // =========================
      // CREATE PRODUCT
      // =========================

      const now = new Date().toISOString();

      const newProduct = {
        // Unique product ID
        id: `reseller_product_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

        // =========================
        // SELLER INFORMATION
        // =========================

        resellerId: currentUser.id,

        resellerName:
          currentUser.name || "",

        resellerEmail:
          currentUser.email || "",

        // =========================
        // PRODUCT INFORMATION
        // =========================

        name,

        category,

        brand: form.brand.trim(),

        sku: form.sku.trim(),

        material: form.material.trim(),

        // =========================
        // PRICING
        // =========================

        price,

        originalPrice:
          originalPrice > 0
            ? originalPrice
            : price,

        discount,

        // =========================
        // INVENTORY
        // =========================

        stock,

        // =========================
        // MEDIA
        // =========================

        image: form.image.trim(),

        // =========================
        // DESCRIPTION
        // =========================

        description:
          form.description.trim(),

        // =========================
        // VARIANTS
        // =========================

        sizes: form.sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        colors: form.colors
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        // =========================
        // BADGE
        // =========================

        badge: form.badge.trim(),

        // =========================
        // STATUS
        // =========================

        status: form.status,

        // =========================
        // TIMESTAMPS
        // =========================

        createdAt: now,

        updatedAt: now,
      };

      // =========================
      // SAVE PRODUCT
      // =========================

      const updatedProducts = [
        ...products,
        newProduct,
      ];

      localStorage.setItem(
        RESELLER_PRODUCTS_KEY,
        JSON.stringify(updatedProducts)
      );

      // =========================
      // SUCCESS
      // =========================

      setSuccess(
        "Product added successfully."
      );

      setForm(initialForm);

      // Redirect after success

      setTimeout(() => {
        router.push("/reseller/products");
      }, 800);
    } catch (error) {
      console.error(
        "Failed to save reseller product:",
        error
      );

      setError(
        "Unable to save product. Please try again."
      );

      setSaving(false);
    }
  };

  // =========================
  // PAGE
  // =========================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* =========================
            HEADER
        ========================== */}

        <section className="border-b border-black/10 px-6 py-10 lg:px-8">

          <div className="mx-auto max-w-5xl">

            <button
              type="button"
              onClick={() =>
                router.push("/reseller/products")
              }
              className="text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:text-[#c6a15b]"
            >
              ← Back to Products
            </button>

            <div className="mt-7">

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
                LUXORA Seller Centre
              </p>

              <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
                Add Product
              </h1>

              <p className="mt-3 text-sm text-[#6b6258]">
                Add a product that you want to sell
                on LUXORA.
              </p>

            </div>

          </div>

        </section>

        {/* =========================
            FORM
        ========================== */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-5xl">

            {/* ERROR */}

            {error && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* =========================
                  BASIC INFORMATION
              ========================== */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Product Information
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                    Basic Details
                  </h2>

                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  {/* NAME */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Product Name *
                    </label>

                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Category *
                    </label>

                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    >

                      <option value="">
                        Select Category
                      </option>

                      <option value="Women">
                        Women
                      </option>

                      <option value="Men">
                        Men
                      </option>

                      <option value="Kids">
                        Kids
                      </option>

                      <option value="Accessories">
                        Accessories
                      </option>

                      <option value="Beauty">
                        Beauty
                      </option>

                      <option value="Shoes">
                        Shoes
                      </option>

                      <option value="Bags">
                        Bags
                      </option>

                      <option value="Jewellery">
                        Jewellery
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* BRAND */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Brand
                    </label>

                    <input
                      name="brand"
                      type="text"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="Brand name"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  {/* SKU */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      SKU
                    </label>

                    <input
                      name="sku"
                      type="text"
                      value={form.sku}
                      onChange={handleChange}
                      placeholder="e.g. LUX-001"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  {/* MATERIAL */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Material
                    </label>

                    <input
                      name="material"
                      type="text"
                      value={form.material}
                      onChange={handleChange}
                      placeholder="e.g. Cotton, Silk"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </section>

              {/* =========================
                  PRICE & STOCK
              ========================== */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Pricing
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Price & Inventory
                  </h2>

                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-3">

                  {/* SELLING PRICE */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Selling Price *
                    </label>

                    <div className="flex">

                      <span className="flex items-center border border-r-0 border-black/15 bg-[#faf7f2] px-4 text-sm">
                        ₹
                      </span>

                      <input
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                      />

                    </div>

                  </div>

                  {/* ORIGINAL PRICE */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Original Price
                    </label>

                    <div className="flex">

                      <span className="flex items-center border border-r-0 border-black/15 bg-[#faf7f2] px-4 text-sm">
                        ₹
                      </span>

                      <input
                        name="originalPrice"
                        type="number"
                        min="0"
                        value={form.originalPrice}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                      />

                    </div>

                  </div>

                  {/* STOCK */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Stock *
                    </label>

                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="Available quantity"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </section>

              {/* =========================
                  VARIANTS
              ========================== */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Variants
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Sizes & Colours
                  </h2>

                  <p className="mt-2 text-xs text-[#6b6258]">
                    Separate multiple values with commas.
                  </p>

                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  {/* SIZES */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Sizes
                    </label>

                    <input
                      name="sizes"
                      type="text"
                      value={form.sizes}
                      onChange={handleChange}
                      placeholder="S, M, L, XL"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                  </div>

                  {/* COLORS */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Colours
                    </label>

                    <input
                      name="colors"
                      type="text"
                      value={form.colors}
                      onChange={handleChange}
                      placeholder="Black, White, Beige"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </section>

              {/* =========================
                  IMAGE & DESCRIPTION
              ========================== */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Product Content
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Image & Description
                  </h2>

                </div>

                <div className="mt-6 space-y-5">

                  {/* IMAGE */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Product Image URL
                    </label>

                    <input
                      name="image"
                      type="url"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/product-image.jpg"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                    {form.image && (
                      <div className="mt-4 h-56 w-40 overflow-hidden bg-[#eee4d6]">

                        <img
                          src={form.image}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />

                      </div>
                    )}

                    <p className="mt-2 text-[11px] text-[#999999]">
                      For now, use an image URL.
                      Image upload can be added later.
                    </p>

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Product Description
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Describe your product..."
                      className="w-full resize-none border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </section>

              {/* =========================
                  BADGE
              ========================== */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Product Highlight
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Badge
                  </h2>

                </div>

                <div className="mt-6 max-w-md">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Product Badge
                  </label>

                  <select
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  >

                    <option value="">
                      No Badge
                    </option>

                    <option value="New">
                      New
                    </option>

                    <option value="Bestseller">
                      Bestseller
                    </option>

                    <option value="Trending">
                      Trending
                    </option>

                    <option value="Sale">
                      Sale
                    </option>

                  </select>

                </div>

              </section>

              {/* =========================
                  STATUS
              ========================== */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Product Status
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Publishing
                  </h2>

                </div>

                <div className="mt-6 max-w-md">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
                  >

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                  </select>

                  <p className="mt-2 text-[11px] text-[#999999]">
                    Inactive products won't be available
                    for normal selling.
                  </p>

                </div>

              </section>

              {/* =========================
                  BUTTONS
              ========================== */}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    router.push("/reseller/products")
                  }
                  className="border border-black/15 px-7 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-[#c6a15b]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving Product..."
                    : "Submit Product"}
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