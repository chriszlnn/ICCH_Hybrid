"use client";

import { useRouter } from "next/navigation";
import PostEditor from "@/components/edit-beauty-info/edit-beauty";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";
import { useState } from "react";
import { BeautyPost } from "@/lib/types/types";

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  // Define the initial post data for a new post
  const initialPost: BeautyPost = {
    id: 0, // Use a placeholder or omit `id` for new posts
    title: "",
    images: [],
    file: "",
    likes: 0,
  };

  // Define the `onSave` function
  const handleSave = async (newPost: BeautyPost) => {
    setUpdating(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error("Failed to create post");

      toast({ title: "Success", description: "Post created successfully!" });
      router.push("/admin/beautyInformation");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({ title: "Error", description: "Failed to create post", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create New Beauty Post</h1>
      </div>
      <PostEditor
        initialPost={initialPost} // Pass the initial post data
        onSave={handleSave} // Pass the `onSave` function
        isUpdating={updating} // Pass the `updating` state
      />
    </main>
  );
}