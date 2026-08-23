"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ProductGrid from "@/components/products/ProductGrid";

import products from "@/data/products";
import categories from "@/data/categories";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  // =========================
  // SEARCH
  // =========================

  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(5000);

  // =========================
  // FILTER + SORT
  // =========================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
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

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    // PRICE
    result = result.filter(
      (product) => product.price <= maxPrice
    );

    // SORT
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

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="border-b border-black/10 bg-[#f5efe6] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c6a15b] sm:text-xs sm:tracking-[0.3em]">
              LUXORA Collection
            </p>

            <h1 className="mt-2 font-serif text-3xl leading-tight text-[#111111] sm:mt-3 sm:text-5xl">
              All Products
            </h1>

            <p className="mt-3 max-w-xl text-xs leading-6 text-[#6b6258] sm:mt-4 sm:text-sm">
              Discover our curated collection of timeless
              fashion, modern essentials and luxury
              accessories.
            </p>

          </div>

        </section>

        {/* =================================================
            SHOP AREA
        ================================================= */}

        <section className="px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

          <div className="mx-auto max-w-7xl">

            {/* =================================================
                SEARCH + SORT
            ================================================= */}

            <div className="flex flex-col gap-3 border-b border-black/10 pb-5 sm:gap-4 sm:pb-6 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}

              <div className="relative w-full lg:max-w-md">

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search products..."
                  className="h-11 w-full border border-black/15 bg-white px-4 pr-10 text-xs outline-none transition focus:border-[#c6a15b] sm:h-12 sm:text-sm"
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
                className="h-11 w-full border border-black/15 bg-white px-4 text-xs outline-none focus:border-[#c6a15b] sm:h-12 sm:text-sm lg:w-auto lg:min-w-[190px]"
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

            {/* =================================================
                SHOP CONTENT
            ================================================= */}

            <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">

              {/* =================================================
                  DESKTOP SIDEBAR
              ================================================= */}

              <aside className="hidden lg:block">

                <div className="sticky top-24">

                  {/* CATEGORIES */}

                  <div className="border-b border-black/10 pb-7">

                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#111111]">
                      Categories
                    </h2>

                    <div className="mt-5 space-y-3">

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

                  {/* PRICE */}

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

              {/* =================================================
                  PRODUCTS AREA
              ================================================= */}

              <div className="min-w-0">

                {/* =================================================
                    MOBILE CATEGORY FILTER
                ================================================= */}

                <div className="mb-5 -mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:hidden">

                  <div className="flex w-max gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setCategory("All")
                      }
                      className={`whitespace-nowrap border px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider transition ${
                        category === "All"
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-black/15 bg-white text-[#111111]"
                      }`}
                    >
                      All
                    </button>

                    {categories.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          setCategory(item.name)
                        }
                        className={`whitespace-nowrap border px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider transition ${
                          category === item.name
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-black/15 bg-white text-[#111111]"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}

                  </div>

                </div>

                {/* =================================================
                    COUNT + CLEAR
                ================================================= */}

                <div className="mb-5 flex items-center justify-between gap-3">

                  <p className="text-xs text-[#6b6258] sm:text-sm">

                    <span className="font-semibold text-[#111111]">
                      {filteredProducts.length}
                    </span>{" "}

                    {filteredProducts.length === 1
                      ? "product"
                      : "products"}

                  </p>

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

                {/* =================================================
                    PRODUCT GRID
                ================================================= */}

                {filteredProducts.length > 0 && (
                  <ProductGrid
                    products={filteredProducts}
                  />
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredProducts.length === 0 && (
          <section className="px-4 pb-16 sm:px-6 sm:pb-20">

            <div className="mx-auto max-w-xl text-center">

              <div className="bg-white px-5 py-12 sm:px-8 sm:py-16">

                <div className="text-4xl">
                  ♡
                </div>

                <p className="mt-5 font-serif text-xl text-[#111111] sm:text-2xl">
                  No products found
                </p>

                <p className="mt-3 text-xs text-[#6b6258] sm:text-sm">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 bg-[#111111] px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b] sm:px-7 sm:text-xs"
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