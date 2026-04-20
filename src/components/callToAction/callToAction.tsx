import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-4xl font-bold mb-6">
          Start Your Event Journey Today
        </h2>

        <p className="mb-10">
          Create your own events or join amazing experiences around you.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">

          <Link
            href="/create-event"
            className=" text-black px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2"
          >
            Create Event <ArrowRight size={18} />
          </Link>

          <Link
            href="/events"
            className="border border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition"
          >
            Join Events
          </Link>

        </div>

      </div>
    </section>
  );
}