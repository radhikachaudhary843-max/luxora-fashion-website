import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="font-serif text-3xl tracking-[0.2em] text-[#d8bd83]">
            LUXORA
          </h2>

          <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
            Timeless fashion, thoughtfully curated for the modern
            wardrobe. Discover elegance in every detail.
          </p>

          <div className="mt-6 flex gap-4">
            <span className="text-sm text-[#c6a15b]">
              Instagram
            </span>

            <span className="text-sm text-[#c6a15b]">
              Pinterest
            </span>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8bd83]">
            Shop
          </h3>

          <div className="space-y-3 text-sm text-white/60">
            <Link
              href="/categories/women"
              className="block transition hover:text-[#c6a15b]"
            >
              Women
            </Link>

            <Link
              href="/categories/men"
              className="block transition hover:text-[#c6a15b]"
            >
              Men
            </Link>

            <Link
              href="/categories/accessories"
              className="block transition hover:text-[#c6a15b]"
            >
              Accessories
            </Link>

            <Link
              href="/products?new=true"
              className="block transition hover:text-[#c6a15b]"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8bd83]">
            Customer Care
          </h3>

          <div className="space-y-3 text-sm text-white/60">
            <p className="cursor-pointer transition hover:text-[#c6a15b]">
              Contact Us
            </p>

            <p className="cursor-pointer transition hover:text-[#c6a15b]">
              Shipping & Delivery
            </p>

            <p className="cursor-pointer transition hover:text-[#c6a15b]">
              Returns & Exchanges
            </p>

            <p className="cursor-pointer transition hover:text-[#c6a15b]">
              FAQs
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8bd83]">
            Stay in Touch
          </h3>

          <p className="mb-5 text-sm leading-6 text-white/60">
            Subscribe to receive new arrivals, exclusive offers and
            fashion inspiration.
          </p>

          <div className="flex border-b border-white/20 pb-2">
            <input
              type="email"
              placeholder="Your email address"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />

            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b] transition hover:text-[#d8bd83]"
            >
              Join
            </button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-xs text-white/40 sm:flex-row sm:text-left">

          <p>
            © {new Date().getFullYear()} LUXORA. All rights reserved.
          </p>

          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>

        </div>
      </div>

    </footer>
  );
}