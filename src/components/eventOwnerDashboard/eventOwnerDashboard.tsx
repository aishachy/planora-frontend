"use client";

import { useEffect, useState } from "react";
import {
  getEventRegistrations,
  approveRegistration,
  rejectRegistration,
  banParticipant,
} from "../../app/services/registrationService";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const EventOwnerDashboard = ({ eventId }: { eventId: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await getEventRegistrations(eventId);
    setRegistrations(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (eventId) fetchData();
  }, [eventId]);

  const handleApprove = async (id: string) => {
    await approveRegistration(id);
    fetchData();
  };

  const handleReject = async (id: string) => {
    await rejectRegistration(id);
    fetchData();
  };

  const handleBan = async (userId: string) => {
    await banParticipant(userId, eventId);
    fetchData();
  };

  if (loading) return <p>Loading...</p>;

  const pending = registrations.filter(r => r.status === "PENDING");
  const approved = registrations.filter(r => r.status === "APPROVED");
  const banned = registrations.filter(r => r.status === "BLOCKED");

  return (
    <div className="w-full space-y-6">

      <h1 className="text-2xl font-bold">Event Management</h1>

      <Tabs defaultValue="pending" className="w-full">

        {/* Tabs Header */}
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Participants</TabsTrigger>
          <TabsTrigger value="banned">Banned</TabsTrigger>
        </TabsList>

        {/* ================= PENDING ================= */}
        <TabsContent value="pending" className="space-y-3 mt-4">
          {pending.length === 0 && <p>No pending requests</p>}

          {pending.map((r) => (
            <Card key={r.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{r.user.name}</p>
                <p className="text-sm text-gray-500">{r.user.email}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleApprove(r.id)} className="bg-green-600">
                  Approve
                </Button>
                <Button onClick={() => handleReject(r.id)} variant="destructive">
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* ================= APPROVED ================= */}
        <TabsContent value="approved" className="space-y-3 mt-4">
          {approved.map((r) => (
            <Card key={r.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{r.user.name}</p>
                <p className="text-sm text-gray-500">{r.user.email}</p>
                <Badge className="mt-1">Active</Badge>
              </div>

              <Button
                onClick={() => handleBan(r.userId)}
                variant="outline"
              >
                Ban
              </Button>
            </Card>
          ))}
        </TabsContent>

        {/* ================= BANNED ================= */}
        <TabsContent value="banned" className="space-y-3 mt-4">
          {banned.length === 0 && <p>No banned users</p>}

          {banned.map((r) => (
            <Card key={r.id} className="p-4">
              <p className="font-semibold">{r.user.name}</p>
              <Badge variant="destructive">Banned</Badge>
            </Card>
          ))}
        </TabsContent>

      </Tabs>
    </div>
  );
};