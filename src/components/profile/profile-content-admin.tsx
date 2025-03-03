"use client";

import { useEffect, useState } from "react";
import { EditableAvatar } from "@/components/avatar/editable-avatar";
import { EditProfile } from "@/components/edit-profile/edit-profile";
//import Image from "next/image";
//import { Card, CardContent } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/general/button";

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userEmail) return;

        const res = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setProfile((prev) => ({ ...prev, ...data }));
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userEmail]);

  const handleAvatarUpdate = (newSrc: string) => {
    setProfile((prev) => ({ ...prev, imageUrl: newSrc })); // ✅ Update profile image when changed
  };

  const handleSave = async (username: string, bio: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, username, bio }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile((prev) => ({ ...prev, ...updatedProfile }));
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    
    <div className="container mx-auto px-4 py-8">
      <div className="absolute top-4 right-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Account</Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
          <Button variant="destructive" onClick={() => signOut({ callbackUrl: '/sign-in' })} className="w-full">
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <EditableAvatar
          alt="Profile"
          fallback="?"
          className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-emerald-100"
          onAvatarUpdate={handleAvatarUpdate} // ✅ Handle avatar updates
        />

        <div className="pl-9">
          <h1 className="text-2xl font-bold mb-2">{profile.username || "New User"}</h1>
          <h2 className="font-semibold mb-1">{profile.email || "Loading email..."}</h2>
          <p className="text-gray-600 pb-4">{profile.bio || "No bio yet."}</p>
          <EditProfile currentProfile={profile} onSave={handleSave} />
        </div>
      </div>
      

      
    </div>
  );
}
