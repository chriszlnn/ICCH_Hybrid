"use client";
import { useSession } from "next-auth/react";

const ClientDashboard = () => {
  const { data: session } = useSession();

  if (session?.user?.role === "CLIENT") {
    // Do something for admin
  }

  return <div>Welcome Client</div>;
};

export default ClientDashboard;
