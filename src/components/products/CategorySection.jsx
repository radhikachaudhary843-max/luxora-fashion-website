import Link from "next/link";
import categories from "@/data/categories";

const categoryStyles = {
  women: "bg-[#e8dccb]",
  men: "bg-[#ded4c5]",
  dresses: "bg-[#f1e5d8]",
  tops: "bg-[#e5dfd5]",
  blazers: "bg-[#d9d1c4]",
  trousers: "bg-[#eee9e1]",
  sarees: "bg-[#e7d8c7]",
  kurtis: "bg-[#f0e4d5]",
  shoes: "bg-[#ddd6ca]",
  bags: "bg-[#e3d7c8]",
  jewellery: "bg-[#f2eadf]",
  accessories: "bg-[#e9dfd2]",
};

export default function CategorySection() {
  const featuredCategories = categories.slice(0, 8);

  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex items-end justify-between sm:mb-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c6a15b] sm:text-xs">
              Explore
            </p>

            <h2 className="mt-2 font-serif text-3xl text-[#111111] sm:mt-3 sm:text-4xl">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/products"
            className="hidden text-xs font-medium uppercase tracking-wider text-[#111111] underline underline-offset-4 transition hover:text-[#c6a15b] sm:block"
          >
            View All
          </Link>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">

          {featuredCategories.map((category) => (

            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >

              {/* IMAGE */}
              <div
                className={`relative aspect-[4/5] overflow-hidden ${
                  categoryStyles[category.id] || "bg-[#f5efe6]"
                }`}
              >

                <img
                  src={`/images/categories/${category.id}.jpg`}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/25" />

                {/* TEXT */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 sm:p-5">

                  <h3 className="font-serif text-lg text-white sm:text-2xl">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.15em] text-white/80 sm:text-[10px]">
                    Explore →
                  </p>

                </div>

              </div>

              {/* MOBILE/BELOW TITLE */}
              <p className="mt-2 text-xs font-medium text-[#111111] sm:text-sm">
                {category.name}
              </p>

            </Link>

          ))}

        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-block border border-[#111111] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#111111] transition hover:bg-[#111111] hover:text-white"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
}