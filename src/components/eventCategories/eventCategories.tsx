"use client";

import { useRouter } from "next/navigation";

const categories = [
  { label: "Public Free", path: "/events/public-free" },
  { label: "Public Paid", path: "/events/public-paid" },
  { label: "Private Free", path: "/events/private-free" },
  { label: "Private Paid", path: "/events/private-paid" },
];

export default function EventCategories() {
  const router = useRouter();

  return (
    <section className="bg-[#020817] py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2">
          Explore Event Categories
        </h2>

        <p className="text-gray-400 mb-8">
          Quickly browse events by type
        </p>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => router.push(cat.path)}
              className="
                px-5 py-4 rounded-xl border border-white/10
                transition text-sm md:text-base font-medium
              "
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}