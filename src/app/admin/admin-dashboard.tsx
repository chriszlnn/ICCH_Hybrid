"use client";
import { useSession } from "next-auth/react";
import ViewFeedback from "@/components/view-feedback/view-feedback";


const AdminDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();
  
    // Do something for admin
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Welcome, Admin</h1>

      <ViewFeedback />
    </div>
  );
};

export default AdminDashboard;
