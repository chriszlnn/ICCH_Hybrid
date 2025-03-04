"use client";
import { useSession } from "next-auth/react";
import ViewFeedback from "@/components/view-feedback/view-feedback";

const AdminDashboard = () => {
  const { data: session } = useSession();

  if (session?.user?.role === "ADMIN") {
    // Do something for admin
  }
  return (
    <div>
      <div>Welcome Admin</div>
      <ViewFeedback />
  </div>
  )
}

export default AdminDashboard;
