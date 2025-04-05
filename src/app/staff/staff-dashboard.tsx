"use client";
import { useSession } from "next-auth/react";
import ViewFeedback from "@/components/view-feedback/view-feedback";
import { memo } from "react";

const StaffDashboard = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();

    // Do something for admin
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Welcome, Staff</h1>

      <ViewFeedback />
    </div>
  );
});

StaffDashboard.displayName = "StaffDashboard";

export default StaffDashboard;
