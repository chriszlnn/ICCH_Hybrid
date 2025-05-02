"use client";
import { useSession } from "next-auth/react";
import ViewFeedback from "@/components/view-feedback/view-feedback";
import { ProductAnalytics } from "@/components/admin/analytics/product-analytics";
import { UserAnalytics } from "@/components/admin/analytics/user-analytics";
import { ReviewAnalytics } from "@/components/admin/analytics/review-analytics";
import { memo } from "react";

const StaffDashboard = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();

  return (
    <div className="p-4 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
        <p className="text-gray-500 mt-1">View and manage application data and analytics</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Product Analytics</h2>
          <ProductAnalytics />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">User Analytics</h2>
          <UserAnalytics />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Review Analytics</h2>
          <ReviewAnalytics />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">User Feedback</h2>
          <ViewFeedback />
        </section>
      </div>
    </div>
  );
});

StaffDashboard.displayName = "StaffDashboard";

export default StaffDashboard;
