
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getCart } from "@/services/cartService";
import { getWishlist } from "@/services/wishlistService";
import { getCurrentUser, logout } from "@/services/authService";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ================================
  // UPDATE CART + WISHLIST
  // ================================

  const updateCounts = () => {
    const cart = getCart();
    const wishlist = getWishlist();

    setCartCount(
      cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      )
    );

    setWishlistCount(wishlist.length);
  };

  // ================================
  // UPDATE AUTH STATE
  // ================================

  const updateAuthState = () => {
    const user = getCurrentUser();

    setCurrentUser(user);
    setLoggedIn(Boolean(user));
  };

  // ================================
  // INITIAL LOAD + EVENTS
  // ================================

  useEffect(() => {
    updateCounts();
    updateAuthState();

    const handleCartUpdate = () => {
      updateCounts();
    };

    const handleWishlistUpdate = () => {
      updateCounts();
    };

    const handleAuthUpdate = () => {
      updateAuthState();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    window.addEventListener(
      "authUpdated",
      handleAuthUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );

      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );

      window.removeEventListener(
        "authUpdated",
        handleAuthUpdate
      );
    };
  }, []);

  // ================================
  // SEARCH
  // ================================

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    setSearchOpen(false);
    setMenuOpen(false);

    router.push(
      `/products?search=${encodeURIComponent(query)}`
    );
  };

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    logout();

    setCurrentUser(null);
    setLoggedIn(false);
    setMenuOpen(false);

    window.dispatchEvent(
      new Event("authUpdated")
    );

    router.push("/login");
  };

  // ================================
  // NAV LINKS
  // ================================

  const navLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Shop",
      href: "/products",
    },
    {
      name: "New Arrivals",
      href: "/products?sort=new",
    },
    {
      name: "Collections",
      href: "/products",
    },
  ];

  return (
    <>
      {/* TOP ANNOUNCEMENT */}

      <div className="bg-[#111111] px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white">
        Free shipping on orders above ₹999
      </div>

      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5efe6]/95 backdrop-blur">

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="flex h-20 items-center justify-between">

            {/* MOBILE MENU */}

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center text-xl lg:hidden"
            >
              {menuOpen ? "×" : "☰"}
            </button>

            {/* LOGO */}

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <span className="font-serif text-2xl font-semibold tracking-[0.18em] text-[#111111] sm:text-3xl">
                LUXORA
              </span>
            </Link>

            {/* DESKTOP NAV */}

            <nav className="ml-12 hidden items-center gap-7 lg:flex">

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                    pathname === link.href
                      ? "text-[#c6a15b]"
                      : "text-[#111111] hover:text-[#c6a15b]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

            </nav>

            {/* ACTIONS */}

            <div className="ml-auto flex items-center gap-1 sm:gap-2">

              {/* SEARCH */}

              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-10 w-10 items-center justify-center text-lg transition hover:text-[#c6a15b]"
              >
                ⌕
              </button>

              {/* WISHLIST */}

              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative hidden h-10 w-10 items-center justify-center text-xl transition hover:text-[#c6a15b] sm:flex"
              >
                ♡

                {wishlistCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c6a15b] px-1 text-[9px] font-bold text-white">
                    {wishlistCount > 9
                      ? "9+"
                      : wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}

              <Link
                href="/cart"
                aria-label="Shopping cart"
                className="relative flex h-10 w-10 items-center justify-center text-xl transition hover:text-[#c6a15b]"
              >
                🛒

                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c6a15b] px-1 text-[9px] font-bold text-white">
                    {cartCount > 9
                      ? "9+"
                      : cartCount}
                  </span>
                )}
              </Link>

              {/* ACCOUNT / PROFILE */}

              <Link
                href={
                  loggedIn
                    ? "/account/profile"
                    : "/login"
                }
                aria-label={
                  loggedIn
                    ? "My Profile"
                    : "Login"
                }
                title={
                  loggedIn
                    ? currentUser?.name
                      ? `My Profile - ${currentUser.name}`
                      : "My Profile"
                    : "Login"
                }
                className="hidden h-10 w-10 items-center justify-center text-xl transition hover:text-[#c6a15b] sm:flex"
              >
                👤
              </Link>

            </div>

          </div>

        </div>

        {/* SEARCH BAR */}

        {searchOpen && (
          <div className="border-t border-black/10 bg-[#f5efe6] px-5 py-4">

            <form
              onSubmit={handleSearch}
              className="mx-auto flex max-w-3xl"
            >

              <input
                autoFocus
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, categories..."
                className="min-w-0 flex-1 border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
              />

              <button
                type="submit"
                className="bg-[#111111] px-6 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c6a15b]"
              >
                Search
              </button>

            </form>

          </div>
        )}

        {/* MOBILE MENU */}

        {menuOpen && (
          <div className="border-t border-black/10 bg-[#f5efe6] lg:hidden">

            <nav className="px-5 py-5">

              <div className="space-y-1">

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-black/10 py-4 text-xs font-semibold uppercase tracking-[0.15em]"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* WISHLIST */}

                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-black/10 py-4 text-xs font-semibold uppercase tracking-[0.15em]"
                >
                  <span>Wishlist</span>

                  {wishlistCount > 0 && (
                    <span className="text-[#c6a15b]">
                      {wishlistCount}
                    </span>
                  )}

                </Link>

                {/* CART */}

                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-black/10 py-4 text-xs font-semibold uppercase tracking-[0.15em]"
                >
                  <span>Shopping Cart</span>

                  {cartCount > 0 && (
                    <span className="text-[#c6a15b]">
                      {cartCount}
                    </span>
                  )}

                </Link>

                {/* ORDERS */}

                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-black/10 py-4 text-xs font-semibold uppercase tracking-[0.15em]"
                >
                  My Orders
                </Link>

                {/* PROFILE / LOGIN */}

                <Link
                  href={
                    loggedIn
                      ? "/account/profile"
                      : "/login"
                  }
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-black/10 py-4 text-xs font-semibold uppercase tracking-[0.15em]"
                >
                  {loggedIn
                    ? "My Profile"
                    : "Login"}
                </Link>

                {/* LOGOUT */}

                {loggedIn && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-red-600"
                  >
                    Logout
                  </button>
                )}

              </div>

            </nav>

          </div>
        )}

      </header>
    </>
  );
}
