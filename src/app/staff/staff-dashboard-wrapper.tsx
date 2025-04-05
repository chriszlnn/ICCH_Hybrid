'use client';

import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

const StaffDashboard = dynamic(() => import("./staff-dashboard"), {
  ssr: false,
  loading: () => <div className="p-4">Loading dashboard...</div>
});

export default function StaffDashboardWrapper() {
  return (
    <SessionProvider>
      <StaffDashboard />
    </SessionProvider>
  );
} 