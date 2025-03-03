"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadButton } from "@/lib/utils/uploadthing";
import { useSession } from "next-auth/react";

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
            alert(`ERROR! ${error.message}`);
          }}
        />

        
      </DialogContent>
    </Dialog>
  );
}
