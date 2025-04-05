import { Suspense } from 'react';
import StaffDashboardWrapper from './staff-dashboard-wrapper';

export default function StaffPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
      <StaffDashboardWrapper />
    </Suspense>
  );
}