"use client";

import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("./admin-dashboard"), {
  ssr: false
});

export default function AdminDashboardWrapper() {
  return <AdminDashboard />;
} 