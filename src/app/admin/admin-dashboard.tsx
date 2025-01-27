"use client";
import { useSession } from "next-auth/react";

const AdminDashboard = () => {
  const { data: session } = useSession();

  if (session?.user?.role === "ADMIN") {
    // Do something for admin
  }

  return <div>Welcome Admin</div>;
};

export default AdminDashboard;
