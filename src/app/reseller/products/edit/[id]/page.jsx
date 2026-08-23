"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import { getCurrentUser } from "@/services/authService";

const RESELLER_PRODUCTS_KEY = "luxora_reseller_products";

export default function EditResellerProductPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    stock: "",
    image: "",
    badge: "",
    status: "active",
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

    try {
      const allProducts = JSON.parse(
        localStorage.getItem(RESELLER_PRODUCTS_KEY) || "[]"
      );

      const product = allProducts.find(
        (item) =>
          String(item.id) === String(params.id) &&
          item.resellerId === currentUser.id
      );

      if (!product) {
        setError("Product not found or you do not have permission to edit it.");
        setLoading(false);
        return;
      }

      setForm({
        name: product.name || "",
        category: product.category || "",
        description: product.description || "",
        price: product.price ?? "",
        originalPrice: product.originalPrice ?? "",
        discount: product.discount ?? "",
        stock: product.stock ?? "",
        image: product.image || "",
        badge: product.badge || "",
        status: product.status || "active",
      });
    } catch {
      setError("Unable to load product.");
    }

    setLoading(false);
  }, [params.id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Please enter a valid selling price.");
      return;
    }

    if (form.originalPrice && Number(form.originalPrice) <= 0) {
      setError("Please enter a valid original price.");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    setSaving(true);

    try {
      const currentUser = getCurrentUser();

      if (!currentUser || currentUser.role !== "reseller") {
        router.replace("/login");
        return;
      }

      const allProducts = JSON.parse(
        localStorage.getItem(RESELLER_PRODUCTS_KEY) || "[]"
      );

      const productIndex = allProducts.findIndex(
        (item) =>
          String(item.id) === String(params.id) &&
          item.resellerId === currentUser.id
      );

      if (productIndex === -1) {
        setError("Product not found or you do not have permission to edit it.");
        setSaving(false);
        return;
      }

      const updatedProduct = {
        ...allProducts[productIndex],

        name: form.name.trim(),

        category: form.category.trim(),

        description: form.description.trim(),

        price: Number(form.price),

        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : Number(form.price),

        discount: form.discount
          ? Number(form.discount)
          : 0,

        stock: Number(form.stock),

        image: form.image.trim(),

        badge: form.badge.trim(),

        status: form.status,

        updatedAt: new Date().toISOString(),
      };

      const updatedProducts = [...allProducts];

      updatedProducts[productIndex] = updatedProduct;

      localStorage.setItem(
        RESELLER_PRODUCTS_KEY,
        JSON.stringify(updatedProducts)
      );

      setSuccess("Product updated successfully.");

      setTimeout(() => {
        router.push("/reseller/products");
      }, 800);
    } catch {
      setError("Unable to update product. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6258]">
            Loading Product...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (error && !form.name) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f5efe6] px-6">

          <div className="w-full max-w-lg bg-white px-6 py-14 text-center">

            <div className="text-5xl">
              ⚠️
            </div>

            <h1 className="mt-6 font-serif text-3xl text-[#111111]">
              Product Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6b6258]">
              {error}
            </p>

            <Link
              href="/reseller/products"
              className="mt-7 inline-block bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b]"
            >
              Back to Products
            </Link>

          </div>

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

          <div className="mx-auto max-w-4xl">

            <Link
              href="/reseller/products"
              className="text-xs font-semibold uppercase tracking-wider text-[#6b6258] transition hover:text-[#c6a15b]"
            >
              ← Back to My Products
            </Link>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA Reseller
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              Edit Product
            </h1>

            <p className="mt-3 text-sm text-[#6b6258]">
              Update your product information and selling details.
            </p>

          </div>

        </section>

        {/* FORM */}

        <section className="px-6 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-4xl">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* BASIC INFORMATION */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Product Information
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                    Basic Details
                  </h2>

                </div>

                <div className="mt-6 space-y-5">

                  {/* PRODUCT NAME */}

                  <div>

                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
                    >
                      Product Name *
                    </label>

                    <input
                      id="name"
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

                    <label
                      htmlFor="category"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
                    >
                      Category *
                    </label>

                    <select
                      id="category"
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

                      <option value="Shoes">
                        Shoes
                      </option>

                      <option value="Bags">
                        Bags
                      </option>

                      <option value="Jewellery">
                        Jewellery
                      </option>

                      <option value="Beauty">
                        Beauty
                      </option>

                    </select>

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <label
                      htmlFor="description"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your product..."
                      className="w-full resize-none border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </section>

              {/* PRICING */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Pricing
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                    Price & Stock
                  </h2>

                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  {/* SELLING PRICE */}

                  <div>

                    <label
                      htmlFor="price"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
                    >
                      Selling Price *
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="₹ Selling Price"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  {/* ORIGINAL PRICE */}

                  <div>

                    <label
                      htmlFor="originalPrice"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
                    >
                      Original Price
                    </label>

                    <input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      min="0"
                      value={form.originalPrice}
                      onChange={handleChange}
                      placeholder="₹ Original Price"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  {/* DISCOUNT */}

                  <div>

                    <label
                      htmlFor="discount"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
                    >
                      Discount %
                    </label>

                    <input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="e.g. 20"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                  {/* STOCK */}

                  <div>

                    <label
                      htmlFor="stock"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
                    >
                      Stock Quantity *
                    </label>

                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="Available quantity"
                      className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                    />

                  </div>

                </div>

              </section>

              {/* IMAGE */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Product Media
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                    Product Image
                  </h2>

                </div>

                <div className="mt-6">

                  <label
                    htmlFor="image"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#111111]"
                  >
                    Image URL
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c6a15b]"
                  />

                  {form.image && (
                    <div className="mt-5 h-56 w-40 overflow-hidden bg-[#eee4d6]">

                      <img
                        src={form.image}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />

                    </div>
                  )}

                </div>

              </section>

              {/* STATUS */}

              <section className="bg-white p-6 sm:p-8">

                <div className="border-b border-black/10 pb-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    Product Settings
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#111111]">
                    Status
                  </h2>

                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <label className="flex cursor-pointer items-center gap-3 border border-black/10 p-4 transition hover:border-[#c6a15b]">

                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={form.status === "active"}
                      onChange={handleChange}
                      className="accent-[#c6a15b]"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        Active
                      </p>

                      <p className="mt-1 text-xs text-[#6b6258]">
                        Product is available for selling.
                      </p>
                    </div>

                  </label>

                  <label className="flex cursor-pointer items-center gap-3 border border-black/10 p-4 transition hover:border-[#c6a15b]">

                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={form.status === "inactive"}
                      onChange={handleChange}
                      className="accent-[#c6a15b]"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        Inactive
                      </p>

                      <p className="mt-1 text-xs text-[#6b6258]">
                        Product will not be available for selling.
                      </p>
                    </div>

                  </label>

                </div>

              </section>

              {/* MESSAGES */}

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                <Link
                  href="/reseller/products"
                  className="border border-black/15 px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-[#c6a15b]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving Changes..."
                    : "Save Changes"}
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