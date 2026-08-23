import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import CategorySection from "@/components/products/CategorySection";
import ProductSection from "@/components/products/ProductSection";
import OfferBanner from "@/components/layout/OfferBanner";
import WhyLuxora from "@/components/layout/WhyLuxora";
import Newsletter from "@/components/layout/Newsletter";

import {
  getNewProducts,
  getBestsellers,
} from "@/services/productService";

export default function HomePage() {
  const newProducts = getNewProducts();
  const bestsellerProducts = getBestsellers();

  return (
    <>
      <Navbar />

      <main>

        {/* HERO */}
        <section className="relative overflow-hidden bg-[#f5efe6]">
          <div className="mx-auto grid min-h-[calc(100vh-108px)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">

            <div className="max-w-xl">

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c6a15b]">
                The New Collection
              </p>

              <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-[#111111] sm:text-6xl lg:text-7xl">
                Timeless Style.
                <br />
                <span className="text-[#c6a15b]">
                  Modern Luxury.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-[#6b6258] sm:text-base">
                Discover carefully curated fashion designed to bring
                elegance, confidence and timeless beauty into your
                everyday wardrobe.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

  {/* SHOP COLLECTION */}
 <Link
  href="/products"
  className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#111111] px-8 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] !text-white transition-all duration-300 hover:border-[#c6a15b] hover:bg-[#c6a15b] !hover:text-white"
>
  Shop Collection
</Link>

  {/* EXPLORE WOMEN */}
  <Link
    href="/products"
    className="group inline-flex items-center justify-center gap-3 border border-[#111111] bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#111111] transition-all duration-300 hover:bg-[#111111] hover:text-white"
  >
    <span>Explore Women</span>
    <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  </Link>

</div>

            </div>

            <div className="relative mx-auto flex h-[480px] w-full max-w-lg items-center justify-center sm:h-[580px]">

              <div className="absolute h-[350px] w-[270px] rotate-[-5deg] bg-[#d8bd83] sm:h-[440px] sm:w-[330px]" />

              <div className="relative flex h-[350px] w-[270px] items-center justify-center bg-[#111111] shadow-2xl sm:h-[440px] sm:w-[330px]">

                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#c6a15b]">
                    LUXORA
                  </p>

                  <p className="mt-4 font-serif text-5xl text-white">
                    AW
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
                    Autumn / Winter
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="border-b border-t border-[#c6a15b]/15 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#c6a15b]/15 lg:grid-cols-4">

            {[
              ["Premium Quality", "Crafted with care"],
              ["Free Shipping", "Orders above ₹1999"],
              ["Easy Returns", "Hassle-free experience"],
              ["Secure Payment", "100% secure checkout"],
            ].map(([title, description]) => (
              <div key={title} className="px-5 py-7 text-center">
                <p className="font-serif text-lg">{title}</p>
                <p className="mt-1 text-xs text-[#6b6258]">
                  {description}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* CATEGORIES */}
        <CategorySection />

        {/* NEW ARRIVALS */}
        {newProducts.length > 0 && (
          <ProductSection
            title="New Arrivals"
            subtitle="Fresh From LUXORA"
            products={newProducts}
            link="/products?new=true"
          />
        )}

        {/* OFFER */}
        <OfferBanner />

        {/* BESTSELLERS */}
        {bestsellerProducts.length > 0 && (
          <ProductSection
            title="Bestsellers"
            subtitle="Loved By Our Customers"
            products={bestsellerProducts}
            link="/products?sort=bestsellers"
          />
        )}

        {/* WHY LUXORA */}
        <WhyLuxora />

        {/* NEWSLETTER */}
        <Newsletter />

      </main>

      <Footer />
    </>
  );
}