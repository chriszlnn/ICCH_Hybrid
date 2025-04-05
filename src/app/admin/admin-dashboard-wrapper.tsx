"use client";

import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("./admin-dashboard"), {
  ssr: false,
  loading: () => <div className="p-4">Loading dashboard...</div>
});

export default function AdminDashboardWrapper() {
  return <AdminDashboard />;
} 