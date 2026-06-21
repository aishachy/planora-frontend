"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <h2 className="text-3xl text-white font-bold mb-2">
          Explore Event Categories
        </h2>

        <p className="text-gray-400 mb-8">
          Quickly browse events by type
        </p>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.path} href={cat.path} passHref>
              <button
                className="
                  w-full px-5 py-5 rounded-xl
                  bg-white/5 hover:bg-white/10
                  border border-white/10
                  text-white font-medium text-sm md:text-base
                  transition-all duration-200
                  cursor-pointer
                "
              >
                {cat.label}
              </button>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}