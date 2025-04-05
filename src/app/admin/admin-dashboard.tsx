"use client";
import { useSession } from "next-auth/react";
import ViewFeedback from "@/components/view-feedback/view-feedback";
import { memo } from "react";

const AdminDashboard = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Welcome, Admin</h1>

      <ViewFeedback />
    </div>
  );
});

AdminDashboard.displayName = "AdminDashboard";

export default AdminDashboard;
