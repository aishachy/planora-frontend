import { redirect } from "next/navigation";

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    redirect("/?error=invalid-session");
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-green-600 text-2xl font-bold">
        Payment Successful 🎉
      </h1>
      <p className="mt-2">Updating your registration...</p>

      {/* simple redirect simulation */}
      <meta httpEquiv="refresh" content="2;url=/dashboard/register?success=true" />
    </div>
  );
}