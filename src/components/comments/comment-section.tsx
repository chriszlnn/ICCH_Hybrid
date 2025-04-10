"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, MoreVertical } from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    email: string;
    image?: string;
    username?: string;
  };
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  onCommentDeleted?: () => void; // Callback to update parent component
  onCommentAdded?: () => void; // Callback to update parent component when a comment is added
  postOwnerEmail?: string; // Email of the post owner
}

export function CommentSection({ 
  postId, 
  initialComments, 
  onCommentDeleted, 
  onCommentAdded,
  postOwnerEmail 
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  // Check if the current user is the post owner
  const isPostOwner = session?.user?.email === postOwnerEmail;

  // Fetch comments when initialComments changes
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user?.email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/client-post/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const comment = await response.json();
      
      // Add the new comment to the state
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    
      // Notify parent component about the new comment
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.email) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/client-post/${postId}/comment/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }

      // Remove the deleted comment from the state
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      
      // Notify parent component about the deleted comment
      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete comment",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getDisplayName = (comment: Comment) => {
    return comment.user.username || comment.user.email.split('@')[0];
  };

  // Check if the current user can delete a specific comment
  const canDeleteComment = (comment: Comment) => {
    if (!session?.user?.email) return false;
    
    // Post owner can delete any comment
    if (isPostOwner) return true;
    
    // Admin can delete any comment
    if (session.user.role === "ADMIN") return true;
    
    // Users can delete their own comments
    return session.user.email === comment.user.email;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">Comments</h3>
      
      {session?.user?.email && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-green-100 transition-colors">
            <Avatar className="h-8 w-8 border-2 border-green-100">
              <AvatarImage 
                src={comment.user.image || "/blank-profile.svg"} 
                alt={getDisplayName(comment)}
              />
              <AvatarFallback className="bg-green-100 text-green-800">
                {getDisplayName(comment)[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{getDisplayName(comment)}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {/* Show delete button only for users who can delete the comment */}
                {canDeleteComment(comment) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Comment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
} 