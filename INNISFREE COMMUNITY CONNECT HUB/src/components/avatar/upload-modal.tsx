"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadButton } from "@/lib/utils/uploadthing";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast/use-toast";
import Cropper from 'react-cropper';
import type { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (src: string) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [cropData, setCropData] = useState<string>("");
  const [showCropper, setShowCropper] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cropperRef = useRef<ReactCropperElement>(null);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");

  // ✅ Fetch user data when the modal opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (userEmail && isOpen) {
        try {
          const response = await fetch(`/api/profile?email=${userEmail}`);
          if (response.ok) {
            // We don't need to set imageUrl here anymore as we handle it in handleCropComplete
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchProfile();
  }, [userEmail, isOpen]);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropData(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
    return files; // Return the files to satisfy the type requirement
  };

  const handleCropComplete = async () => {
    if (cropperRef.current?.cropper) {
      setIsSaving(true);
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL('image/jpeg');
      
      // Convert base64 to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      
      // Create a new file from the blob
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
      
      // Upload the cropped image using UploadThing
      try {
        const uploadResponse = await startUpload([file]);
        
        if (uploadResponse && uploadResponse.length > 0) {
          const uploadedUrl = uploadResponse[0].url;
          onUpload(uploadedUrl);
          setShowCropper(false);
          
          // Update profile in database
          const profileResponse = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              imageUrl: uploadedUrl,
            }),
          });
          
          if (!profileResponse.ok) {
            throw new Error("Failed to update profile image");
          }
        }
      } catch (error) {
        console.error("Error uploading cropped image:", error);
        toast({
          title: "Error",
          description: "Failed to upload cropped image",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload New Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showCropper ? (
            <>
              <div className="text-sm text-muted-foreground">
                Choose a profile picture to upload. Supported formats: JPEG, PNG, GIF, WebP
              </div>

              <UploadButton
                endpoint="imageUploader"
                appearance={{
                  button: "bg-primary text-primary-foreground hover:bg-primary/90",
                  allowedContent: "text-sm text-muted-foreground",
                }}
                content={{
                  button: "Choose File",
                  allowedContent: "Images up to 4MB"
                }}
                onBeforeUploadBegin={handleFileSelect}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Upload Error",
                    description: error.message,
                    variant: "destructive",
                    duration: 5000,
                  });
                }}
                className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-button:ut-uploading:bg-primary/50"
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="h-[300px] w-full">
                <Cropper
                  ref={cropperRef}
                  src={cropData}
                  style={{ height: '100%', width: '100%' }}
                  aspectRatio={1}
                  viewMode={1}
                  guides={true}
                  autoCropArea={1}
                  background={false}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCropper(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCropComplete}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
