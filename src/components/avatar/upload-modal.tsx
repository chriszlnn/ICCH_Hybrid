"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadButton } from "@/lib/utils/uploadthing";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast/use-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (src: string) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageUrl, setImageUrl] = useState<string>("");
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const { toast } = useToast();

  // ✅ Fetch user data when the modal opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (userEmail && isOpen) {
        try {
          const response = await fetch(`/api/profile?email=${userEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setImageUrl(userData.imageUrl); // ✅ Set the image URL from the database
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchProfile();
  }, [userEmail, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload New Profile Picture</DialogTitle>
        </DialogHeader>

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={async (res) => {
            if (res && res.length > 0) {
              const uploadedUrl = res[0].url;
              setImageUrl(uploadedUrl);
              onUpload(uploadedUrl); // ✅ Pass URL back to EditableAvatar
          
              try {
                const response = await fetch("/api/profile", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: userEmail,
                    imageUrl: uploadedUrl,
                  }),
                });
          
                if (!response.ok) {
                  throw new Error("Failed to update profile image");
                }
          
                console.log("Profile image updated successfully");
              } catch (error) {
                console.error("Error updating profile:", error);
              }
            }
          }}
          
          onUploadError={(error: Error) => {
            // Show toast notification for upload errors
            toast({
              title: "Upload Error",
              description: error.message,
              variant: "destructive",
              duration: 5000, // 5 seconds
            });
          }}
          
          onUploadProgress={(progress) => {
            // Optional: You can add a progress toast if needed
            if (progress === 100) {
              toast({
                title: "Upload Complete",
                description: "Your image has been uploaded successfully.",
                duration: 3000, // 3 seconds
              });
            }
          }}
          
          onBeforeUploadBegin={(files) => {
            // Check file size (limit to 5MB)
            const file = files[0];
            if (file && file.size > 5 * 1024 * 1024) {
              toast({
                title: "File Too Large",
                description: "Please upload an image smaller than 5MB.",
                variant: "destructive",
                duration: 5000, // 5 seconds
              });
              return [];
            }
            
            // Check file type
            const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (file && !allowedTypes.includes(file.type)) {
              toast({
                title: "Unsupported File Type",
                description: "Please upload a JPEG, PNG, GIF, or WebP image.",
                variant: "destructive",
                duration: 5000, // 5 seconds
              });
              return [];
            }
            
            return files;
          }}
        />

        
      </DialogContent>
    </Dialog>
  );
}
