"use client";
import { useEffect, useState } from "react";
import { EditableAvatar } from "@/components/avatar/editable-avatar";
import { EditProfile } from "@/components/edit-profile/edit-profile";
import { signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/general/button";
import { Skeleton } from "../ui/skeleton";
import { ReviewHistoryModal } from "./review-history-modal";
import Image from "next/image";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Prisma } from '@prisma/client';
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

// Define your types using Prisma's generated types
type ClientPostWithRelations = Prisma.ClientPostGetPayload<{
  include: {
    taggedProducts: {
      select: {
        productId: true
      }
    },
    likes: {
      select: {
        id: true
      }
    },
    comments: {
      select: {
        id: true
      }
    }
  }
}>;

interface ProfileContentProps {
  userEmail: string;
}

interface Post {
  id: string;
  images: string[];
  caption: string;
  createdAt: Date;
  productIds: string[];
  likes: number;
  comments?: { id: string }[];
}

export function ProfileContent({ userEmail }: ProfileContentProps) {
  const [profile, setProfile] = useState({
    email: userEmail,
    username: "",
    bio: "",
    imageUrl: "",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

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
            username: data.client?.username || "",
            bio: data.client?.bio || "",
            imageUrl: data.client?.imageUrl || "/blank-profile.svg",
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

    const fetchPosts = async () => {
      try {
        setIsPostsLoading(true);
        setPostsError(null);
        const res = await fetch(`/api/client-post?email=${encodeURIComponent(userEmail)}`);
        
        if (res.ok) {
          const data: ClientPostWithRelations[] = await res.json();
          
          if (data && Array.isArray(data)) {
            setPosts(data.map(post => ({
              id: post.id,
              images: post.images,
              caption: post.content,
              createdAt: post.createdAt,
              productIds: post.taggedProducts.map(tp => tp.productId),
              likes: post.likes?.length || 0,
              comments: post.comments || []
            })));
          } else {
            setPosts([]);
            setPostsError("No posts found");
          }
        } else {
          setPosts([]);
          setPostsError("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        setPostsError("Error loading posts");
      } finally {
        setIsPostsLoading(false);
      }
    };

    fetchProfile();
    fetchPosts();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
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
          <div className="pb-4">
            {profile.bio && <p className="text-gray-600">{profile.bio}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <EditProfile
              currentProfile={profile}
              onSaveAction={handleSave}
            />
            <ReviewHistoryModal userEmail={userEmail} />
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-200 my-8" />

      <Tabs defaultValue="posts" className="w-full">
        <TabsContent value="posts">
          {isPostsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="relative aspect-square">
                  <Skeleton className="w-full h-full rounded-md" />
                </div>
              ))}
            </div>
          ) : postsError ? (
            <div className="text-center py-8 text-gray-500">
              <p>{postsError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/client/profile/posts/${post.id}`}
                  className="relative aspect-square group cursor-pointer"
                >
                  <Image
                    src={post.images[0]}
                    alt={post.caption}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center flex gap-4">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!isPostsLoading && !postsError && posts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No posts yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}