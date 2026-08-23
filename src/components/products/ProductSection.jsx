import Link from "next/link";
import ProductGrid from "./ProductGrid";

export default function ProductSection({
  title,
  subtitle,
  products,
  link = "/products",
}) {
  return (
    <section className="bg-[#f5efe6] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              {subtitle}
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#111111] sm:text-4xl">
              {title}
            </h2>
          </div>

          <Link
            href={link}
            className="hidden text-xs font-medium uppercase tracking-wider text-[#111111] underline underline-offset-4 transition hover:text-[#c6a15b] sm:block"
          >
            View All
          </Link>
        </div>

        <ProductGrid products={products} />

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={link}
            className="text-xs font-medium uppercase tracking-wider underline underline-offset-4"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
}