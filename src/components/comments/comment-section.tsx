"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

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
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

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
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDisplayName = (comment: Comment) => {
    return comment.user.username || comment.user.email.split('@')[0];
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
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">{getDisplayName(comment)}</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
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