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
  onAvatarUpdate?: (newSrc: string) => void; // ✅ New prop to notify parent
}

export function EditableAvatar({ alt, fallback, className, onAvatarUpdate }: EditableAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  // ✅ Fetch user's profile image on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (userEmail) {
        try {
          const response = await fetch(`/api/profile?email=${userEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setAvatarSrc(userData.imageUrl); // ✅ Load saved image from DB
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchProfile();
  }, [userEmail]);

  const handleAvatarUpdate = (newSrc: string) => {
    setAvatarSrc(newSrc);
    setIsModalOpen(false);
    if (onAvatarUpdate) onAvatarUpdate(newSrc); // ✅ Notify parent about the update
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className={className}>
        <AvatarImage src={avatarSrc || "/blank-profile.svg"} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
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
