"use client";
import { useSession } from "next-auth/react";
import GiveFeedback from "@/components/give-feedback/give-feedback";

const ClientDashboard = () => {
  const { data: session } = useSession();

    // Do something for client
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 p-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome, {session?.user?.name || "Client"}!
      </h2>
      <p className="text-gray-600 mb-4">We appreciate your feedback.</p>

      <div className="w-full max-w-lg mb-10">
        <GiveFeedback />
      </div>
    </div>
  );
};

export default ClientDashboard;

