"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ProductGrid from "@/components/products/ProductGrid";

import products from "@/data/products";
import categories from "@/data/categories";

function ProductsContent() {
  const searchParams = useSearchParams();

  // Search coming from Navbar URL
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(5000);

  // ==========================================
  // FILTER + SORT PRODUCTS
  // ==========================================

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
      result.sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    }

    if (sort === "discount") {
      result.sort(
        (a, b) => (b.discount || 0) - (a.discount || 0)
      );
    }

    return result;
  }, [search, category, maxPrice, sort]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice(5000);
    setSort("featured");

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

        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <section className="border-b border-black/10 bg-[#f5efe6] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c6a15b] sm:text-xs">
              LUXORA Collection
            </p>

            <h1 className="mt-3 font-serif text-3xl text-[#111111] sm:text-4xl lg:text-5xl">
              All Products
            </h1>

            <p className="mt-4 max-w-xl text-xs leading-6 text-[#6b6258] sm:text-sm">
              Discover our curated collection of timeless
              fashion, modern essentials and luxury
              accessories.
            </p>

          </div>

        </section>

        {/* =====================================
            SHOP AREA
        ===================================== */}

        <section className="px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

          <div className="mx-auto max-w-7xl">

            {/* =================================
                SEARCH + SORT
            ================================= */}

            <div className="flex flex-col gap-3 border-b border-black/10 pb-5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">

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
                className="w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b] sm:w-auto"
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

            {/* =================================
                SHOP GRID
            ================================= */}

            <div className="mt-6 grid gap-7 sm:mt-8 sm:gap-8 lg:grid-cols-[230px_1fr]">

              {/* =================================
                  DESKTOP SIDEBAR
              ================================= */}

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

                  {/* PRICE FILTER */}

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

                      <span>₹500</span>

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

              {/* =================================
                  PRODUCTS AREA
              ================================= */}

              <div className="min-w-0">

                {/* =================================
                    MOBILE CATEGORIES
                ================================= */}

                <div className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">

                  {/* ALL */}

                  <button
                    type="button"
                    onClick={() =>
                      setCategory("All")
                    }
                    className={`shrink-0 whitespace-nowrap border px-4 py-2 text-xs ${
                      category === "All"
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-black/15 bg-white text-[#111111]"
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
                      className={`shrink-0 whitespace-nowrap border px-4 py-2 text-xs ${
                        category === item.name
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-black/15 bg-white text-[#111111]"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}

                </div>

                {/* =================================
                    PRODUCT COUNT
                ================================= */}

                <div className="mb-5 flex items-center justify-between gap-3">

                  <p className="text-xs text-[#6b6258] sm:text-sm">

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
                      className="shrink-0 text-[10px] font-medium uppercase tracking-wider underline underline-offset-4 transition hover:text-[#c6a15b] sm:text-xs"
                    >
                      Clear Filters
                    </button>
                  )}

                </div>

                {/* =================================
                    PRODUCT GRID
                ================================= */}

                {filteredProducts.length > 0 && (
                  <ProductGrid
                    products={filteredProducts}
                  />
                )}

                {/* =================================
                    EMPTY STATE
                ================================= */}

                {filteredProducts.length === 0 && (
                  <div className="bg-white px-6 py-14 text-center sm:px-8 sm:py-16">

                    <div className="text-4xl">
                      ♡
                    </div>

                    <p className="mt-5 font-serif text-2xl text-[#111111]">
                      No products found
                    </p>

                    <p className="mt-3 text-sm text-[#6b6258]">
                      Try changing your search or
                      filters.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 bg-[#111111] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
                    >
                      Clear Filters
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

// ==========================================
// PRODUCTS PAGE
// Suspense fixes Next.js 16 useSearchParams
// production build error
// ==========================================

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />

          <main className="flex min-h-[60vh] items-center justify-center bg-[#f5efe6] px-6">
            <p className="text-sm text-[#6b6258]">
              Loading products...
            </p>
          </main>

          <Footer />
        </>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}