"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Loader2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";
import ViewClientPost from "@/components/view-client-post/view-client-post";

interface ClientPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  client: {
    username: string;
    email: string;
    imageUrl?: string;
  };
}

export default function ClientPostsList() {
  const [posts, setPosts] = useState<ClientPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/client-post/all');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load client posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewClientPosts = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleCloseModal = () => {
    setSelectedClientId(null);
  };

  // Group posts by client
  const clientsMap = new Map();
  posts.forEach(post => {
    if (post.client && post.client.email) {
      if (!clientsMap.has(post.client.email)) {
        clientsMap.set(post.client.email, {
          clientId: post.client.email, // Use email as the identifier
          username: post.client.username || post.client.email.split('@')[0],
          email: post.client.email,
          imageUrl: post.client.imageUrl,
          latestPost: post,
          postCount: 1
        });
      } else {
        const client = clientsMap.get(post.client.email);
        client.postCount += 1;
        // Update latest post if this one is newer
        if (new Date(post.createdAt) > new Date(client.latestPost.createdAt)) {
          client.latestPost = post;
        }
      }
    }
  });

  // Convert map to array for rendering
  const clients = Array.from(clientsMap.values());

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Last Post</TableHead>
              <TableHead>Post Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No clients with posts found
                </TableCell>
              </TableRow>
            ) : (
              clients.map(client => (
                <TableRow key={client.email}>
                  <TableCell className="font-medium">{client.username}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{new Date(client.latestPost.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{client.postCount}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewClientPosts(client.clientId)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {selectedClientId && (
        <ViewClientPost 
          postId={selectedClientId} 
          onClose={handleCloseModal} 
        />
      )}
    </Card>
  );
} 