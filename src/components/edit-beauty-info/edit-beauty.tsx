"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/general/input";
import { Label } from "../ui/form/label";
import { Card } from "@/components/ui/card";
import { useToast } from "../ui/toast/use-toast";
import WysiwygEditor from "./edit-beauty-info";
import PassMD from "./pass-md";
import { useUploadThing } from "@/lib/utils/uploadthing";
import ImageUploader from "./image-uploader";
import { BeautyPost } from "@/lib/types/types";
import { useSession } from "next-auth/react";

interface PostEditorProps {
  initialPost: BeautyPost;
  onSave: (post: BeautyPost) => Promise<void>;
  isUpdating: boolean;
}

export default function PostEditor({ initialPost, onSave, isUpdating }: PostEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession(); 
  const [title, setTitle] = useState(initialPost?.title || "");
  const [fileContent, setFileContent] = useState(""); // Use `fileContent` instead of `body`
  const [images, setImages] = useState<string[]>(initialPost?.images || []);

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (initialPost?.file) {
        try {
          const response = await fetch(initialPost.file);
          if (!response.ok) throw new Error("Failed to load markdown file");

          const text = await response.text(); // Fetch the content of the file
          setFileContent(text); // Set the file content
        } catch (error) {
          console.error("Error fetching markdown file:", error);
        }
      }
    };

    fetchMarkdown();
  }, [initialPost?.file]);

  const { startUpload } = useUploadThing("markdownUploader");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !fileContent.trim()) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }

    try {
      const markdownBlob = new Blob([fileContent], { type: "text/markdown" });
      const markdownFile = new File([markdownBlob], "content.md", { type: "text/markdown" });

      const uploadResponse = await startUpload([markdownFile]);

      if (!uploadResponse || !uploadResponse[0]?.url) {
        throw new Error("Markdown upload failed");
      }

      const fileUrl = uploadResponse[0].url;

      // Construct `postData` with optional `id`
      const postData: BeautyPost = {
        ...(initialPost?.id && { id: initialPost.id }), // Include `id` only if it exists
        title,
        file: fileUrl,
        images,
        likes: initialPost?.likes ?? 0,
      };

      console.log("onSave:", onSave); // Log the `onSave` prop
      await onSave(postData);

      toast({ title: "Success", description: "Post updated successfully" });
      if (session?.user?.role === "ADMIN") {
        router.push("/admin/beautyInformation");
      } else if (session?.user?.role === "STAFF") {
        router.push("/staff/beautyInformation");
      } else {
        // Fallback for users without a role
        router.push("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "An error occurred", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title" required />
        </div>

        <div className="space-y-2">
          <Label>Images</Label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Card className="p-0 overflow-hidden">
            <WysiwygEditor value={fileContent} onChange={setFileContent} /> {/* Use `fileContent` */}
          </Card>
        </div>

        <div className="space-y-2">
          <Label>Markdown Preview</Label>
          <Card className="p-4">
            <PassMD markdown={fileContent} /> {/* Use `fileContent` */}
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => {
              // Redirect based on user role when canceling
              if (session?.user?.role === "ADMIN") {
                router.push("/admin/beautyInformation/posts");
              } else if (session?.user?.role === "STAFF") {
                router.push("/staff/beautyInformation/posts");
              } else {
                router.push("/");
              }
            }}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : initialPost?.id ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}