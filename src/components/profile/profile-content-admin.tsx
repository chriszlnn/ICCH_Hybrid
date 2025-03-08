"use client";

import { useEffect, useState } from "react";
import { EditableAvatar } from "@/components/avatar/editable-avatar";
import { EditProfile } from "@/components/edit-profile/edit-profile";
//import Image from "next/image";
//import { Card, CardContent } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/general/button";
import { Skeleton } from "../ui/skeleton";

interface ProfileContentProps {
  userEmail: string;
}

export function ProfileContent({ userEmail }: ProfileContentProps) {
  const [profile, setProfile] = useState({
    email: userEmail,
    username: "",
    bio: "",
    imageUrl: "", // ✅ Add imageUrl to the profile state
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
          setProfile({
            email: userEmail,
            username: data.username || "New User", // ✅ Default username
            bio: data.bio || "No bio yet.", // ✅ Default bio
            imageUrl: data.imageUrl || "/blank-profile.svg", // ✅ Default image
            posts: profile.posts, // Include posts in the profile state
          });
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
          <Skeleton className="h-10 w-24" /> {/* Skeleton for Account button */}
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
          <Skeleton className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full" /> {/* Skeleton for Avatar */}
          <div className="pl-9 space-y-2">
            <Skeleton className="h-8 w-48" /> {/* Skeleton for Username */}
            <Skeleton className="h-6 w-64" /> {/* Skeleton for Email */}
            <Skeleton className="h-4 w-96" /> {/* Skeleton for Bio */}
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
          fallback="?" // This is now unused because of the conditional rendering
          className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 "
          onAvatarUpdate={handleAvatarUpdate}
        />
        <div className="pl-9">
          <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>
          <h2 className="font-semibold mb-1">{profile.email}</h2>
          <p className="text-gray-600 pb-4">{profile.bio}</p>
          <EditProfile
            currentProfile={profile} // Pass the complete profile object
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
