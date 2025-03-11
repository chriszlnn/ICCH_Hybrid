"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { BeautyPost } from "@/lib/types/types"
import { useToast } from "../ui/toast/use-toast"
import { useSession } from "next-auth/react"

export default function EditDashboard() {
  const [posts, setPosts] = useState<BeautyPost[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { data: session } = useSession(); 

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/posts")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete post")

      toast({
        title: "Success",
        description: "Post deleted successfully",
      })

      // Refresh the posts list
      fetchPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  const role = session?.user?.role;
  const newPostLink =
    role === "ADMIN"
      ? "/admin/beautyInformation/posts/new"
      : role === "STAFF"
      ? "/staff/beautyInformation/posts/new"
      : "#"; // Default if no role is found

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Posts</h2>
        <Link href={newPostLink}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found. Create your first beauty post!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const editLink =
              role === "ADMIN"
                ? `/admin/beautyInformation/posts/${post.id}/edit`
                : role === "STAFF"
                ? `/staff/beautyInformation/posts/${post.id}/edit`
                : "#";

            return (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.images.length} image{post.images.length !== 1 ? "s" : ""}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                  <Link href={editLink}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(Number(post.id))}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

