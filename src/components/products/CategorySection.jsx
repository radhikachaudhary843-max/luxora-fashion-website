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
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
              Explore
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#111111] sm:text-4xl">
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-5">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div
                className={`relative aspect-[4/5] overflow-hidden ${categoryStyles[category.id] || "bg-[#f5efe6]"}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-2xl text-[#111111]/70 transition duration-500 group-hover:scale-110 sm:text-3xl">
                    {category.name}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#111111] transition group-hover:text-[#c6a15b]">
                    Explore →
                  </span>
                </div>
              </div>

              <h3 className="mt-3 text-sm font-medium text-[#111111]">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}