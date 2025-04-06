"use client";
import { useSession } from "next-auth/react";
import GiveFeedback from "@/components/give-feedback/give-feedback";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  images: string[];
  content: string;
  createdAt: Date;
  likes: { id: string }[];
  comments: { id: string }[];
  client: {
    imageUrl: string;
    username: string;
    email: string;
  };
}

const ClientDashboard = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/client-post/all');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Feedback Button */}
      <div className="fixed top-4 right-4 z-50">
        <GiveFeedback />
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Welcome, {session?.user?.name || "Client"}!
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-md" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/client/profile/posts/${post.id}`}
                className="relative aspect-square group cursor-pointer"
              >
                <Image
                  src={post.images[0]}
                  alt={post.content}
                  fill
                  className="object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center flex gap-4">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{post.likes.length}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;

