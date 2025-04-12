import { Metadata } from "next";
import ClientPostsList from "@/components/client-posts-list/client-posts-list";

export const metadata: Metadata = {
  title: "Client Posts | Admin Dashboard",
  description: "View and manage client posts",
};

export default function ClientPostsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Client Posts Management</h1>
      <ClientPostsList />
    </div>
  );
} 