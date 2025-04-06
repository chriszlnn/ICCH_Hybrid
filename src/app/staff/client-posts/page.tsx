import { Metadata } from "next";
import ViewClientPost from "@/components/view-client-post/view-client-post";

export const metadata: Metadata = {
  title: "Client Posts | Staff Dashboard",
  description: "View and manage client posts",
};

export default function ClientPostsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Client Posts Management</h1>
      <ViewClientPost />
    </div>
  );
} 