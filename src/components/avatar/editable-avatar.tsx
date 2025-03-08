"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/general/button";
import { Edit } from "lucide-react";
import { UploadModal } from "./upload-modal";
import { useSession } from "next-auth/react";

interface EditableAvatarProps {
  alt: string;
  fallback: string;
  className?: string;
  onAvatarUpdate?: (newSrc: string) => void; // Callback to notify parent of updates
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EditableAvatar({ alt, fallback, className, onAvatarUpdate }: EditableAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("/blank-profile.svg"); // Default image
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  // Fetch user's profile image on component mount or when userEmail changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userEmail) return; // Exit if no email is available

      try {
        const response = await fetch(`/api/profile?email=${userEmail}`);
        if (response.ok) {
          const userData = await response.json();
          setAvatarSrc(userData.imageUrl || "/blank-profile.svg"); // Set to default if no imageUrl is found
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, [userEmail]);

  // Handle avatar update after a new image is uploaded
  const handleAvatarUpdate = async (newSrc: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, imageUrl: newSrc }),
      });

      if (res.ok) {
        setAvatarSrc(newSrc);
        if (onAvatarUpdate) onAvatarUpdate(newSrc); // Notify parent about the update
      } else {
        console.error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setIsModalOpen(false); // Close the modal after update
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className={className}>
        {/* Always show AvatarImage with the current avatarSrc */}
        <AvatarImage
          src={avatarSrc}
          alt={alt}
          style={{ transition: "none", opacity: 1 }} // Disable transition and ensure full visibility
        />
        {/* Fallback is hidden because we always have a default image */}
        <AvatarFallback className="bg-transparent">{""}</AvatarFallback>
      </Avatar>
      {isHovered && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleAvatarUpdate}
      />
    </div>
  );
}