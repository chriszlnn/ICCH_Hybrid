"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Trash2, X, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/toast/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Client {
  id: string;
  userId: string;
  email: string;
  username: string;
  imageUrl: string;
  postCount: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: Date;
  likes: { id: string }[];
  comments: { id: string }[];
  taggedProducts: {
    product: {
      id: string;
      name: string;
      imageUrl: string;
    }
  }[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    email: string;
    image: string;
    name: string;
  };
}

export default function ViewClientPost() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientPosts, setClientPosts] = useState<Post[]>([]);
  const [showPosts, setShowPosts] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  // Fetch all clients with their post counts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) throw new Error("Failed to fetch clients");
        
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Error",
          description: "Failed to load clients",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch posts for a specific client
  const fetchClientPosts = async (clientEmail: string) => {
    try {
      const response = await fetch(`/api/client-post?email=${encodeURIComponent(clientEmail)}`);
      if (!response.ok) throw new Error("Failed to fetch client posts");
      
      const data = await response.json();
      setClientPosts(data);
    } catch (error) {
      console.error("Error fetching client posts:", error);
      toast({
        title: "Error",
        description: "Failed to load client posts",
        variant: "destructive",
      });
    }
  };

  // Handle viewing a client's posts
  const handleViewPosts = (client: Client) => {
    setSelectedClient(client);
    fetchClientPosts(client.email);
    setShowPosts(true);
  };

  // Handle deleting a post
  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/client-post/${postId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete post");
      }
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      // Refresh the posts list
      if (selectedClient) {
        fetchClientPosts(selectedClient.email);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  // Handle image preview
  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  // Handle viewing comments for a post
  const handleViewComments = async (post: Post) => {
    setSelectedPost(post);
    setLoadingComments(true);
    setShowComments(true);
    
    try {
      const response = await fetch(`/api/client-post/${post.id}/comment`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoadingComments(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Client Posts</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Profile</TableHead>
                <TableHead className="hidden md:table-cell">Username</TableHead>
                <TableHead className="md:hidden">Email</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="text-center">Posts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="md:hidden">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {!showPosts ? (
        // Clients table view
        <div>
          <h2 className="text-2xl font-bold mb-4">Client Posts</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Profile</TableHead>
                  <TableHead className="hidden md:table-cell">Username</TableHead>
                  <TableHead className="md:hidden">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-center">Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={client.imageUrl || "/blank-profile.svg"} alt={client.username || client.email} />
                        <AvatarFallback>{client.username ? client.username.charAt(0).toUpperCase() : client.email.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium hidden md:table-cell">{client.username || client.email}</TableCell>
                    <TableCell className="font-medium md:hidden">{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                    <TableCell className="text-center">{client.postCount}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPosts(client)}
                        className="w-full sm:w-auto"
                      >
                        <Eye className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">View Posts</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No clients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        // Client posts table view
        <div>
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowPosts(false)}
              className="mr-2"
            >
              <X className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Clients</span>
            </Button>
            <h2 className="text-2xl font-bold">
              Posts by {selectedClient?.username || selectedClient?.email}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead className="text-center">Tagged Products</TableHead>
                  <TableHead className="text-center">Stats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {post.images && post.images.length > 0 && (
                        <div 
                          className="relative w-16 h-16 cursor-pointer overflow-hidden rounded-md"
                          onClick={() => handleImageClick(post.images[0])}
                        >
                          <Image
                            src={post.images[0]}
                            alt="Post image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal break-words">{post.content}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="whitespace-pre-wrap break-words text-sm">
                        {post.taggedProducts.length > 0 ? (
                          post.taggedProducts.map(({ product }, index) => (
                            <span key={product.id} className="inline-block">
                              {product.name}
                              {index < post.taggedProducts.length - 1 ? ", " : ""}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">No products tagged</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                        <span className="text-center">{new Date(post.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center justify-center gap-2">
                          <span>❤️ {post.likes.length}</span>
                          <button 
                            onClick={() => handleViewComments(post)}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the post.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {clientPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No posts found for this client
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-2xl p-0 bg-transparent border-none shadow-none">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative">
            {previewImage && (
              <div className="relative w-full">
                <Image
                  src={previewImage}
                  alt="Post image preview"
                  width={600}
                  height={600}
                  className="object-contain max-h-[70vh] w-auto mx-auto"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full h-8 w-8"
                  onClick={() => setPreviewImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={(open) => !open && setShowComments(false)}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-xl font-bold mb-4">
            Comments for {selectedPost?.title || "Post"}
          </DialogTitle>
          
          {loadingComments ? (
            <div className="py-8 text-center">Loading comments...</div>
          ) : comments.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.image || "/blank-profile.svg"} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No comments yet
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

