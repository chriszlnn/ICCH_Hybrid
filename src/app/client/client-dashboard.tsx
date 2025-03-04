"use client";
import { useSession } from "next-auth/react";
import GiveFeedback from "@/components/give-feedback/give-feedback";

const ClientDashboard = () => {
  const { data: session } = useSession();

  if (session?.user?.role === "CLIENT") {
    // Do something for admin
  }

   return (
      <div>
        <div>Welcome client</div>
        <GiveFeedback />
    </div>
    )
  }

export default ClientDashboard;
