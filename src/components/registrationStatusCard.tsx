/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RegistrationStatusCard({
  registration,
}: {
  registration: any;
}) {
  return (
    <div className="p-4 border rounded">
      <h2>{registration.event.title}</h2>

      <p>
        Registration Status:{" "}
        <b>{registration.status}</b>
      </p>

      <p>
        Payment Status:{" "}
        <b>{registration.payment?.status || "NOT CREATED"}</b>
      </p>

      {registration.payment?.status !== "COMPLETED" && (
        <p className="text-red-500">Not Paid</p>
      )}

      {registration.payment?.status === "COMPLETED" && (
        <p className="text-green-600">Paid</p>
      )}
    </div>
  );
}