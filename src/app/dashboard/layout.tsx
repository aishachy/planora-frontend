import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">

        <h2 className="text-2xl font-bold">Dashboard</h2>

        <nav className="space-y-3 text-gray-700">

          <Link href="/dashboard" className="block hover:text-black">
            Overview
          </Link>

          <Link href="/dashboard/event" className="block hover:text-black">
            My Events
          </Link>

          <Link href="/dashboard/event/create" className="block hover:text-black">
            Create Event
          </Link>

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}