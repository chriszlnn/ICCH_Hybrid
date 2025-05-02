import ClientPostsList from "@/components/client-posts-list/client-posts-list";

export default function Posts() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Client Posts</h1>
      <ClientPostsList />
    </div>
  );
}
