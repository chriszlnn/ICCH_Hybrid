"use client";
import { useSession } from "next-auth/react";
import ViewFeedback from "@/components/view-feedback/view-feedback";

const StaffDashboard = () => {
  const { data: session } = useSession();

  if (session?.user?.role === "STAFF") {
    // Do something for admin
  }

  return (
      <div>
        <div>Welcome Admin</div>
        <ViewFeedback />
    </div>
  )
}

export default StaffDashboard;
