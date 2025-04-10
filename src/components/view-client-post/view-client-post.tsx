"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    imageUrl?: string;
  };
}

interface ViewClientPostProps {
  postId: string;
  onClose: () => void;
}

export default function ViewClientPost({ postId, onClose }: ViewClientPostProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?postId=${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postId, toast]);

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Client Posts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={post.user.imageUrl || undefined} />
                  <AvatarFallback>{post.user.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{post.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <p className="mt-2">{post.content}</p>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No posts found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

