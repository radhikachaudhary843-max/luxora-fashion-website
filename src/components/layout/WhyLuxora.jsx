const features = [
  {
    number: "01",
    title: "Premium Quality",
    description:
      "Thoughtfully selected fabrics and refined craftsmanship.",
  },
  {
    number: "02",
    title: "Timeless Design",
    description:
      "Pieces designed to remain elegant beyond seasons.",
  },
  {
    number: "03",
    title: "Easy Shopping",
    description:
      "A seamless shopping experience from discovery to delivery.",
  },
  {
    number: "04",
    title: "Customer First",
    description:
      "Dedicated support and hassle-free returns.",
  },
];

export default function WhyLuxora() {
  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
            The LUXORA Difference
          </p>

          <h2 className="mt-3 font-serif text-3xl text-[#111111] sm:text-4xl">
            Designed Around You
          </h2>
        </div>

        <div className="grid gap-px bg-[#c6a15b]/20 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="bg-white p-8 text-center"
            >
              <span className="font-serif text-2xl text-[#c6a15b]">
                {feature.number}
              </span>

              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#6b6258]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}