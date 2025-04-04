"use client";

import { useEffect, useState } from "react";
import { EditableAvatar } from "@/components/avatar/editable-avatar";
import { EditProfile } from "@/components/edit-profile/edit-profile";
import { signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/general/button";
import { Skeleton } from "../ui/skeleton";
import { ReviewHistoryModal } from "./review-history-modal";

interface ProfileContentProps {
  userEmail: string;
}

export function ProfileContent({ userEmail }: ProfileContentProps) {
  const [profile, setProfile] = useState({
    email: userEmail,
    username: "",
    bio: "",
    imageUrl: "",
    posts: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userEmail) return;

        setIsLoading(true);
        const res = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setProfile((prevProfile) => ({
            ...prevProfile,
            email: userEmail,
            username: data.username || "New User",
            bio: data.bio || "No bio yet.",
            imageUrl: data.imageUrl || "/blank-profile.svg",
          }));
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  // Handle avatar update
  const handleAvatarUpdate = async (newSrc: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, imageUrl: newSrc }),
      });

      if (res.ok) {
        setProfile((prev) => ({ ...prev, imageUrl: newSrc }));
      } else {
        console.error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  // Handle saving profile changes
  const handleSave = async (username: string, bio: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, username, bio }),
      });

      if (res.ok) {
        setProfile((prev) => ({ ...prev, username, bio }));
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="absolute top-4 right-4">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
          <Skeleton className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full" />
          <div className="pl-9 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="absolute top-4 right-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Account</Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="w-full"
            >
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <EditableAvatar
          alt="Profile"
          fallback="?"
          className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36"
          onAvatarUpdate={handleAvatarUpdate}
        />
        <div className="pl-9">
          <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>
          <h2 className="font-semibold mb-1">{profile.email}</h2>
          <p className="text-gray-600 pb-4">{profile.bio}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <EditProfile
              currentProfile={profile}
              onSaveAction={handleSave}
            />
            <ReviewHistoryModal userEmail={userEmail} />
          </div>
        </div>
      </div>
    </div>
  );
}