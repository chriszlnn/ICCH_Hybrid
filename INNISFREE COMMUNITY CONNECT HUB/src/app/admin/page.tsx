import { Suspense } from "react";
import AdminDashboardWrapper from "./admin-dashboard-wrapper";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
      <AdminDashboardWrapper />
    </Suspense>
  );
}