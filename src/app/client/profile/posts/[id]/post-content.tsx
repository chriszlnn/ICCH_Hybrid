"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, X, ArrowLeft, MoreVertical, Trash2, Tag } from "lucide-react";
import { Suspense, useState, useEffect, useCallback } from "react";
import { CommentSection } from "@/components/comments/comment-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import ImageCarousel from "@/components/beauty-info/image-carousel";

interface PostLike {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  user?: {
    email: string;
  };
}

interface TaggedProduct {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    image: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: Date;
  likes: PostLike[];
  clientAvatar: string;
  displayName: string;
  client: {
    email: string;
  };
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      email: string;
      image?: string;
    };
  }[];
  taggedProducts?: TaggedProduct[];
}

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [commentsCount, setCommentsCount] = useState(post.comments.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const isPostOwner = session?.user?.email === post.client.email;

  // Function to fetch updated comments - memoized to prevent unnecessary re-renders
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/client-post/${post.id}/comment`);
      if (response.ok) {
        const updatedComments = await response.json();
        setComments(updatedComments);
        setCommentsCount(updatedComments.length);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [post.id]);

  // Handle comment changes
  const handleCommentChange = useCallback(async () => {
    await fetchComments();
  }, [fetchComments]);

  // Check if the current user has already liked the post - memoized
  const fetchUserLikes = useCallback(async () => {
    const userEmail = session?.user?.email;
    if (!userEmail) return;
    
    try {
      const response = await fetch(`/api/user/likes?postId=${post.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.hasLiked);
      }
    } catch (error) {
      console.error("Error fetching user likes:", error);
    }
  }, [session, post.id]);

  // Initialize isLiked state when the component first loads
  useEffect(() => {
    // Check if the current user has already liked the post based on the post data
    if (session?.user?.email && post.likes) {
      // Check if any of the likes are from the current user
      const userHasLiked = post.likes.some(like => 
        like.user?.email === session.user?.email
      );
      setIsLiked(userHasLiked);
    }
    
    // Then fetch the latest like status from the server
    fetchUserLikes();
  }, [session, post.likes, fetchUserLikes]);

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    const userEmail = session.user?.email;
    if (!userEmail) {
      toast({
        title: "Error",
        description: "User email not found",
        variant: "destructive",
      });
      return;
    }

    if (isLiking) return;
    
    // Optimistic update - update UI immediately
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);
    
    setIsLiking(true);
    try {
      const response = await fetch(`/api/client-post/${post.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userEmail,
          liked: newLikedState
        }),
      });
      
      if (!response.ok) {
        // Revert optimistic update if the request failed
        setIsLiked(!newLikedState);
        setLikesCount(newLikedState ? likesCount - 1 : likesCount + 1);
        
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to like post",
          variant: "destructive",
        });
      } else {
        const data = await response.json();
        
        // Update the isLiked state based on the server response
        setIsLiked(data.liked);
        setLikesCount(data.likes);
      }
    } catch (error) {
      // Revert optimistic update if the request failed
      setIsLiked(!newLikedState);
      setLikesCount(newLikedState ? likesCount - 1 : likesCount + 1);
      
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error("Error in like request:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    toast({
      title: "Confirm Delete",
      description: "Are you sure you want to delete this post?",
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            try {
              const response = await fetch(`/api/client-post/${post.id}`, {
                method: "DELETE",
              });
    
              if (response.ok) {
                toast({
                  title: "Success",
                  description: "Post deleted successfully",
                });
                router.push("/client/profile"); // Redirect to profile page
              } else {
                const errorData = await response.json();
                toast({
                  title: "Error",
                  description: errorData.message || "Failed to delete post",
                  variant: "destructive",
                });
              }
            } catch (err) {
              toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
              });
              console.error(err);
            }
          }}
        >
          Delete
        </Button>
      ),
    });
  };

  return (
    <div className="flex flex-col p-4 justify-start items-center min-h-screen py-8 pb-24 bg-white overflow-y-auto">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-gray-600"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Post Header */}
          <div className="flex items-center p-4 border-b">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage 
                src={post.clientAvatar || "/blank-profile.svg"} 
                alt={post.displayName} 
              />
              <AvatarFallback className="bg-green-100 text-green-800">
                {post.displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{post.displayName}</h2>
            </div>
            {isPostOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer text-red-600 hover:text-red-700"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Post Image */}
          <div className="relative aspect-square">
            <ImageCarousel images={post.images} aspectRatio="square" />
          </div>

          {/* Tagged Products */}
          {post.taggedProducts && post.taggedProducts.length > 0 && (
            <div className="p-4 border-b">
              <div className="flex items-center mb-2">
                <Tag className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tagged Products</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.taggedProducts.map((taggedProduct) => (
                  <Link 
                    key={taggedProduct.id}
                    href={`/client/rank/product/${taggedProduct.productId}`}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 rounded-full pl-2 pr-1 py-1 transition-colors"
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={taggedProduct.product.image || "/placeholder.svg"}
                        alt={taggedProduct.product.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-sm truncate max-w-[150px]">{taggedProduct.product.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Post Actions */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
                    onClick={handleLike}
                    disabled={isLiking}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <span className="ml-1 font-medium">{likesCount}</span>
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsCommentModalOpen(true)}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <span className="ml-1 font-medium">{commentsCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Caption */}
          <div className="p-4 border-b">
            <p className="text-sm">
              <span className="font-semibold mr-2">{post.displayName}</span>
              {post.content}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl h-[80vh] bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-xl overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="h-6 w-6 mr-2 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-800">Comments</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCommentModalOpen(false)}
                    className="hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <Suspense fallback={<CommentSectionSkeleton />}>
                  <CommentSection 
                    postId={post.id} 
                    initialComments={comments} 
                    onCommentDeleted={() => handleCommentChange()}
                    onCommentAdded={() => handleCommentChange()}
                    postOwnerEmail={post.client.email}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentSectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
} 