"use client";

import InvitationList from "../../components/invitation/invitationList";

export default function InvitationsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        My Invitations
      </h1>

      <InvitationList />
    </div>
  );
}