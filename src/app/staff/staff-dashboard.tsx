"use client";
import { useSession } from "next-auth/react";

const StaffDashboard = () => {
  const { data: session } = useSession();

  if (session?.user?.role === "STAFF") {
    // Do something for admin
  }

  return <div>Welcome Staff</div>;
};

export default StaffDashboard;
