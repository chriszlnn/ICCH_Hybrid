"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash, MessageSquare, Heart } from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface ClientPost {
  id: string;
  content?: string;
  caption?: string;
  images: string[];
  createdAt: string;
  client: {
    username: string;
    email: string;
    imageUrl?: string;
  };
  likes: { id: string }[] | number;
  comments: { id: string }[];
  taggedProducts?: { productId: string }[];
  productIds?: string[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    email: string;
    image: string;
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  image?: string;
  price?: number;
  category?: string;
}

interface ViewClientPostProps {
  postId: string;
  onClose: () => void;
}

export default function ViewClientPost({ postId, onClose }: ViewClientPostProps) {
  const [clientPosts, setClientPosts] = useState<ClientPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [taggedProducts, setTaggedProducts] = useState<Map<string, Product>>(new Map());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [commentDeleteDialogOpen, setCommentDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (postId) {
      fetchClientPosts();
    }
  }, [postId]);

  const fetchClientPosts = async () => {
    if (!postId) {
      toast({
        title: "Error",
        description: "Missing client ID",
        variant: "destructive",
      });
      onClose();
      return;
    }

    setLoading(true);
    try {
      // For a single post
      const response = await fetch(`/api/client-post/${postId}`);
      
      if (response.status === 404) {
        // If not found as a single post, try as a client ID
        const clientPostsResponse = await fetch(`/api/client-post/all?clientId=${postId}`);
        if (!clientPostsResponse.ok) {
          throw new Error('Failed to fetch client posts');
        }
        const data = await clientPostsResponse.json();
        
        // Transform and normalize the data
        const normalizedPosts = Array.isArray(data) ? data.map(post => ({
          ...post,
          // Ensure content field exists even if it's called caption in the API
          content: post.content || post.caption || '',
        })) : [];
        
        setClientPosts(normalizedPosts);
      } else if (response.ok) {
        // If it's a single post
        const data = await response.json();
        
        // Single post may have different structure
        const normalizedPost = {
          ...data,
          // Ensure content field exists
          content: data.content || data.caption || '',
          // Ensure likes and comments exist as arrays
          likes: data.likes ? (Array.isArray(data.likes) ? data.likes : []) : [],
          comments: data.comments ? (Array.isArray(data.comments) ? data.comments : []) : [],
        };
        
        setClientPosts([normalizedPost]);
      } else {
        throw new Error('Failed to fetch client posts');
      }
      } catch (error) {
      console.error('Error fetching client posts:', error);
        toast({
          title: "Error",
        description: "Failed to load client posts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    
    try {
      const response = await fetch(`/api/client-post/${postToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.status === 403) {
        throw new Error('You do not have permission to delete this post. Only admins or post owners can delete posts.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      setClientPosts(clientPosts.filter(post => post.id !== postToDelete));
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setPostToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/client-post/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
      setSelectedPostId(postId);
      setCommentsModalOpen(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCommentClick = (commentId: string) => {
    setCommentToDelete(commentId);
    setCommentDeleteDialogOpen(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete || !selectedPostId) return;
    
    try {
      const response = await fetch(`/api/client-post/${selectedPostId}/comment/${commentToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      setComments(comments.filter(comment => comment.id !== commentToDelete));
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete comment",
        variant: "destructive",
      });
    } finally {
      setCommentToDelete(null);
      setCommentDeleteDialogOpen(false);
    }
  };

  const handleViewImage = (index: number, images: string[]) => {
    setActiveImages(images);
    setCurrentImageIndex(index);
    setImageViewerOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === activeImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? activeImages.length - 1 : prev - 1
    );
  };

  const fetchProductDetails = async (productIds: string[]) => {
    if (!productIds || productIds.length === 0) return;
    
    try {
      const uniqueIds = [...new Set(productIds)];
      const productDetailsMap = new Map(taggedProducts);
      
      await Promise.all(
        uniqueIds.map(async (id) => {
          if (!productDetailsMap.has(id)) {
            const response = await fetch(`/api/products/${id}`);
            if (response.ok) {
              const product = await response.json();
              productDetailsMap.set(id, product);
            }
          }
        })
      );
      
      setTaggedProducts(productDetailsMap);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // When client posts are loaded, fetch tagged products
  useEffect(() => {
    if (clientPosts.length > 0) {
      // Collect all product IDs from all posts
      const allProductIds: string[] = [];
      
      clientPosts.forEach(post => {
        if (post.taggedProducts && post.taggedProducts.length > 0) {
          post.taggedProducts.forEach(tp => {
            if (tp.productId) allProductIds.push(tp.productId);
          });
        } else if (post.productIds && post.productIds.length > 0) {
          allProductIds.push(...post.productIds);
        }
      });
      
      if (allProductIds.length > 0) {
        fetchProductDetails(allProductIds);
      }
    }
  }, [clientPosts]);

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Loading Client Posts</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Client Posts</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Tagged Products</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No posts found for this client
                    </TableCell>
                  </TableRow>
                ) : (
                  clientPosts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{post.content || post.caption}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {post.images && post.images.length > 0 ? (
                            post.images.slice(0, 2).map((img, index) => (
                              <div 
                                key={index} 
                                className="h-10 w-10 relative cursor-pointer"
                                onClick={() => handleViewImage(index, post.images)}
                              >
                                <img
                                  src={img}
                                  alt={`Post image ${index + 1}`}
                                  className="h-full w-full object-cover rounded-md"
                                />
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400">No images</span>
                          )}
                          {post.images.length > 2 && (
                            <div 
                              className="h-10 w-10 flex items-center justify-center bg-muted rounded-md cursor-pointer"
                              onClick={() => handleViewImage(0, post.images)}
                            >
                              <span className="text-sm text-muted-foreground">+{post.images.length - 2}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {/* Display tagged products */}
                          {post.taggedProducts && post.taggedProducts.length > 0 ? (
                            post.taggedProducts.map((taggedProduct) => {
                              const product = taggedProducts.get(taggedProduct.productId);
                              return product ? (
                                <a 
                                  key={taggedProduct.productId}
                                  href={`/staff/votes?productId=${product.id}`}
                                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                  title={`View ${product.name} in product votes dashboard`}
                                >
                                  {product.image && (
                                    <div className="h-6 w-6 relative rounded-sm overflow-hidden">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <span className="max-w-[120px] truncate text-xs">{product.name}</span>
                                </a>
                              ) : (
                                <div 
                                  key={taggedProduct.productId}
                                  className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {taggedProduct.productId.substring(0, 8)}...
                                </div>
                              );
                            })
                          ) : post.productIds && post.productIds.length > 0 ? (
                            post.productIds.map((productId) => {
                              const product = taggedProducts.get(productId);
                              return product ? (
                                <a 
                                  key={productId}
                                  href={`/staff/votes?productId=${product.id}`}
                                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                  title={`View ${product.name} in product votes dashboard`}
                                >
                                  {product.image && (
                                    <div className="h-6 w-6 relative rounded-sm overflow-hidden">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <span className="max-w-[120px] truncate text-xs">{product.name}</span>
                                </a>
                              ) : (
                                <div 
                                  key={productId}
                                  className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {productId.substring(0, 8)}...
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-gray-400">No products</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-500" />
                          {typeof post.likes === 'number' 
                            ? post.likes 
                            : (post.likes?.length || 0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center space-x-1"
                          onClick={() => fetchComments(post.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments?.length || 0}</span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(post.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </DialogContent>

      {/* Enhanced Image Viewer Modal */}
      {imageViewerOpen && activeImages.length > 0 && (
        <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] p-2 flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Posts ({currentImageIndex + 1}/{activeImages.length})</DialogTitle>
            </DialogHeader>
            
            {/* Main image viewer */}
            <div className="relative flex-1 min-h-[60vh] flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40"
                onClick={handlePrevImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </Button>
              
              <img
                src={activeImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[60vh] object-contain"
              />
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40"
                onClick={handleNextImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
            </div>
            
            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto py-2">
              {activeImages.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-16 w-16 flex-shrink-0 cursor-pointer border-2 ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Comments Modal */}
      {commentsModalOpen && (
        <Dialog open={commentsModalOpen} onOpenChange={() => setCommentsModalOpen(false)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {comments.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No comments found
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={comment.user.image} />
                          <AvatarFallback>{comment.user.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{comment.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                          <p className="mt-2">{comment.content}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteCommentClick(comment.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog for Posts */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog for Comments */}
      <AlertDialog open={commentDeleteDialogOpen} onOpenChange={setCommentDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComment} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
