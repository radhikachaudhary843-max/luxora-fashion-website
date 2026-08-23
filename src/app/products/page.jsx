"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ProductGrid from "@/components/products/ProductGrid";

import products from "@/data/products";
import categories from "@/data/categories";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  // Search coming from Navbar URL
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(5000);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // =========================
    // SEARCH
    // =========================

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const productCategory =
          product.category?.toLowerCase() || "";
        const subcategory =
          product.subcategory?.toLowerCase() || "";

        return (
          name.includes(query) ||
          productCategory.includes(query) ||
          subcategory.includes(query)
        );
      });
    }

    // =========================
    // CATEGORY
    // =========================

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    // =========================
    // PRICE
    // =========================

    result = result.filter(
      (product) => product.price <= maxPrice
    );

    // =========================
    // SORTING
    // =========================

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "discount") {
      result.sort((a, b) => b.discount - a.discount);
    }

    return result;
  }, [search, category, maxPrice, sort]);

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice(5000);
    setSort("featured");

    // Remove search query from URL
    window.history.replaceState(
      {},
      "",
      "/products"
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5efe6]">

        {/* =========================
            HEADER
        ========================= */}

        <section className="border-b border-black/10 bg-[#f5efe6] px-6 py-14 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              LUXORA Collection
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#111111] sm:text-5xl">
              All Products
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#6b6258]">
              Discover our curated collection of timeless
              fashion, modern essentials and luxury
              accessories.
            </p>

          </div>

        </section>

        {/* =========================
            SHOP AREA
        ========================= */}

        <section className="px-6 py-10 lg:px-8">

          <div className="mx-auto max-w-7xl">

            {/* SEARCH + SORT */}

            <div className="flex flex-col gap-4 border-b border-black/10 pb-6 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}

              <div className="relative w-full lg:max-w-md">

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search products..."
                  className="w-full border border-black/15 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-[#c6a15b]"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ⌕
                </span>

              </div>

              {/* SORT */}

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
              >

                <option value="featured">
                  Sort: Featured
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Customer Rating
                </option>

                <option value="discount">
                  Biggest Discount
                </option>

              </select>

            </div>

            {/* =========================
                SHOP GRID
            ========================= */}

            <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">

              {/* =========================
                  DESKTOP SIDEBAR
              ========================= */}

              <aside className="hidden lg:block">

                <div className="sticky top-24">

                  {/* CATEGORIES */}

                  <div className="border-b border-black/10 pb-7">

                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#111111]">
                      Categories
                    </h2>

                    <div className="mt-5 space-y-3">

                      {/* ALL */}

                      <button
                        type="button"
                        onClick={() =>
                          setCategory("All")
                        }
                        className={`block w-full text-left text-sm transition ${
                          category === "All"
                            ? "font-semibold text-[#c6a15b]"
                            : "text-[#6b6258] hover:text-black"
                        }`}
                      >
                        All Products
                      </button>

                      {/* CATEGORY LIST */}

                      {categories.map((item) => (

                        <button
                          type="button"
                          key={item.id}
                          onClick={() =>
                            setCategory(item.name)
                          }
                          className={`block w-full text-left text-sm transition ${
                            category === item.name
                              ? "font-semibold text-[#c6a15b]"
                              : "text-[#6b6258] hover:text-black"
                          }`}
                        >
                          {item.name}
                        </button>

                      ))}

                    </div>

                  </div>

                  {/* =========================
                      PRICE FILTER
                  ========================= */}

                  <div className="pt-7">

                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#111111]">
                      Maximum Price
                    </h2>

                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(
                          Number(e.target.value)
                        )
                      }
                      className="mt-6 w-full accent-[#c6a15b]"
                    />

                    <div className="mt-3 flex justify-between text-xs text-[#6b6258]">

                      <span>
                        ₹500
                      </span>

                      <span>
                        ₹
                        {maxPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                  </div>

                </div>

              </aside>

              {/* =========================
                  PRODUCTS AREA
              ========================= */}

              <div>

                {/* =========================
                    MOBILE CATEGORIES
                ========================= */}

                <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">

                  {/* ALL */}

                  <button
                    type="button"
                    onClick={() =>
                      setCategory("All")
                    }
                    className={`whitespace-nowrap border px-4 py-2 text-xs ${
                      category === "All"
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-black/15 bg-white"
                    }`}
                  >
                    All
                  </button>

                  {/* CATEGORIES */}

                  {categories.map((item) => (

                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        setCategory(item.name)
                      }
                      className={`whitespace-nowrap border px-4 py-2 text-xs ${
                        category === item.name
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-black/15 bg-white"
                      }`}
                    >
                      {item.name}
                    </button>

                  ))}

                </div>

                {/* =========================
                    PRODUCT COUNT
                ========================= */}

                <div className="mb-6 flex items-center justify-between gap-4">

                  <p className="text-sm text-[#6b6258]">

                    <span className="font-semibold text-[#111111]">
                      {filteredProducts.length}
                    </span>{" "}

                    {filteredProducts.length === 1
                      ? "product"
                      : "products"}

                  </p>

                  {/* CLEAR FILTERS */}

                  {(search ||
                    category !== "All" ||
                    maxPrice !== 5000 ||
                    sort !== "featured") && (

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-medium uppercase tracking-wider underline underline-offset-4 transition hover:text-[#c6a15b]"
                    >
                      Clear Filters
                    </button>

                  )}

                </div>

                {/* =========================
                    PRODUCT GRID
                ========================= */}

                {filteredProducts.length > 0 && (
                  <ProductGrid
                    products={filteredProducts}
                  />
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {filteredProducts.length === 0 && (

          <section className="px-6 pb-20">

            <div className="mx-auto max-w-xl text-center">

              <div className="bg-white px-8 py-16">

                <div className="text-4xl">
                  ♡
                </div>

                <p className="mt-5 font-serif text-2xl text-[#111111]">
                  No products found
                </p>

                <p className="mt-3 text-sm text-[#6b6258]">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-block bg-[#111111] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                >
                  Clear Filters
                </button>

              </div>

            </div>

          </section>

        )}

      </main>

      <Footer />
    </>
  );
}