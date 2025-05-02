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

export function EditableAvatar({ alt, fallback, className, onAvatarUpdate }: EditableAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("/blank-profile.svg"); // Default image
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  // Fetch user's profile image on component mount or when userEmail changes
  useEffect(() => {
    const fetchProfile = async () => {
      // Only proceed if we have a user email and the session is authenticated
      if (!userEmail || status !== "authenticated") {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        console.log("Fetching profile for:", userEmail);
        const response = await fetch(`/api/profile?email=${userEmail}`);
        
        if (response.ok) {
          const userData = await response.json();
          console.log("Profile data received:", userData);
          
          // Check for imageUrl in different possible locations
          const imageUrl = userData.imageUrl || 
                          (userData.client && userData.client.imageUrl) || 
                          (userData.admin && userData.admin.imageUrl) || 
                          (userData.staff && userData.staff.imageUrl);
          
          if (imageUrl) {
            console.log("Setting avatar to:", imageUrl);
            setAvatarSrc(imageUrl);
          } else {
            console.log("No imageUrl found in profile data, using default");
            setAvatarSrc("/blank-profile.svg");
          }
        } else {
          console.error("Failed to fetch profile:", response.status, response.statusText);
          setAvatarSrc("/blank-profile.svg");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setAvatarSrc("/blank-profile.svg");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail, status]);

  // Handle avatar update after a new image is uploaded
  const handleAvatarUpdate = async (newSrc: string) => {
    if (!userEmail) return;
    
    try {
      console.log("Updating avatar with:", newSrc);
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, imageUrl: newSrc }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        console.log("Avatar updated successfully, profile data:", updatedProfile);
        
        // Use the imageUrl from the response
        const imageUrl = updatedProfile.imageUrl || newSrc;
        setAvatarSrc(imageUrl);
        
        if (onAvatarUpdate) onAvatarUpdate(imageUrl); // Notify parent about the update
      } else {
        console.error("Failed to update avatar:", res.status, res.statusText);
        setAvatarSrc("/blank-profile.svg");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      setAvatarSrc("/blank-profile.svg");
    } finally {
      setIsModalOpen(false); // Close the modal after update
    }
  };

  // Generate fallback initials from the alt text
  const getFallbackInitials = () => {
    if (!fallback) return "";
    return fallback.split(" ").map(word => word[0]).join("").toUpperCase();
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className={className}>
        <AvatarImage
          src={isLoading || !avatarSrc ? "/blank-profile.svg" : avatarSrc}
          alt={alt}
          style={{ transition: "none", opacity: isLoading ? 0.5 : 1 }} // Show loading state
        />
        <AvatarFallback className="bg-muted">
          {getFallbackInitials()}
        </AvatarFallback>
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