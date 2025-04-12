"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import PostEditor from "@/components/edit-beauty-info/edit-beauty";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { BeautyPost } from "@/lib/types/types";
import { useToast } from "@/components/ui/toast/use-toast";

interface EditPagePost extends BeautyPost {
  id: number;
  likes: number;
  file: string;
  images: string[];
}

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [post, setPost] = useState<EditPagePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) {
      // Handle new post creation
      setPost({
        id: 0, // Use a placeholder or omit `id` for new posts
        title: "",
        images: [],
        file: "",
        likes: 0,
        userLiked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setLoading(false);
      return;
    }

    // Handle existing post editing
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data: BeautyPost = await response.json();

        console.log("Fetched Post:", data); // Log the fetched post
        setPost({
          ...data,
          id: Number(data.id),
          likes: data.likes ?? 0,
          file: data.file || "", // Ensure `file` is included
        });
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (updatedPost: BeautyPost) => {
    setUpdating(true);
    try {
      const postData = {
        ...updatedPost,
        id: Number(id), // Use `id` from URL params for updates
        likes: updatedPost.likes ?? 0,
        file: updatedPost.file, // Use `file` instead of `body`
        images: updatedPost.images,
      };

      console.log("Post Data to Update:", postData); // Log the post data

      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("Failed to update post");
      toast({ title: "Success", description: "Post updated successfully!" });
      router.push("/admin/beautyInformation");
    } catch (error) {
      console.error("Error updating post:", error);
      toast({ title: "Error", description: "Failed to update post", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container mx-auto py-6 px-4">Loading...</div>;

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{id ? "Edit Beauty Post" : "Create Beauty Post"}</h1>
      </div>
      <PostEditor
        initialPost={post || { 
          id: 0, 
          title: "", 
          images: [], 
          file: "", 
          likes: 0,
          userLiked: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }} // Provide default values for new posts
        onSave={handleUpdate} // Ensure `onSave` is passed correctly
        isUpdating={updating} // Pass the correct `updating` state
      />
    </main>
  );
}