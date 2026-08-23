import Link from "next/link";

export default function OfferBanner() {
  return (
    <section className="bg-[#111111] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="relative overflow-hidden border border-[#c6a15b]/40 px-6 py-16 text-center sm:px-10">

          <div className="absolute left-6 top-6 h-12 w-12 border-l border-t border-[#c6a15b]/60" />
          <div className="absolute bottom-6 right-6 h-12 w-12 border-b border-r border-[#c6a15b]/60" />

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c6a15b]">
            Exclusive LUXORA Offer
          </p>

          <h2 className="mt-5 font-serif text-4xl text-white sm:text-5xl">
            Up to 40% Off
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60">
            Elevate your wardrobe with selected styles from our
            latest collection.
          </p>

          <Link
            href="/products?sale=true"
            className="mt-8 inline-block bg-[#c6a15b] px-9 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#d8bd83]"
          >
            Shop the Sale
          </Link>

        </div>

      </div>
    </section>
  );
}