/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Edit, MoreHorizontal, Search, Trash, Users } from "lucide-react";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import Link from "next/link";
import { Button } from "../ui/general/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "../ui/general/input";
import { Label } from "../ui/form/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ManageUserStaff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [clients, setClients] = useState<{ userId: number; username: string; email: string; emailVerified: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const clientRes = await fetch("/api/clients");
        const clientData = await clientRes.json();
        setClients(clientData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.userId.toString().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const id = String(itemToDelete.userId);
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const clientRes = await fetch("/api/clients");
        const clientData = await clientRes.json();
        setClients(clientData);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const requestBody = {
        emailVerified: editingItem.emailVerified ? "Verified" : "Unverified",
      };

      const response = await fetch(`/api/users/${editingItem.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const clientRes = await fetch("/api/clients");
        const clientData = await clientRes.json();
        setClients(clientData);
        setIsEditDialogOpen(false);
        setEditingItem(null);
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      const response = await fetch(`/api/users/${editingItem.userId}`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Verification email has been resent successfully!");
      } else {
        console.error("Failed to resend verification email");
        alert("Failed to resend verification email. Please try again.");
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("Failed to resend verification email. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <Users className="h-6 w-6" />
            <span className="flex md:inline-block">Users</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <form className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] pl-8 md:w-[300px] lg:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </header>
      <div className="flex flex-1">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <form className="relative md:hidden">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
              <CardDescription>Manage client information and accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Client Id</th>
                      <th className="py-3 text-left font-medium">Email</th>
                      <th className="py-3 text-left font-medium">Username</th>
                      <th className="hidden py-3 text-left font-medium sm:table-cell">Status</th>
                      <th className="py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.userId} className="border-b">
                        <td className="py-3">{client.userId}</td>
                        <td className="py-3">{client.email}</td>
                        <td className="py-3">{client.username}</td>
                        <td className="hidden py-3 sm:table-cell">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              client.emailVerified != null
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {client.emailVerified != null ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(client)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(client)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Make changes to the client information here.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              {/* Client ID (non-editable) */}
              <div className="grid gap-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={editingItem.userId}
                  disabled
                />
              </div>

              {/* Email (read-only) */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editingItem.email}
                  disabled
                />
              </div>

              {/* Status Dropdown (editable) */}
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editingItem.emailVerified ? "Verified" : "Unverified"}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      emailVerified: e.target.value === "Verified" ? new Date().toISOString() : null,
                    })
                  }
                  className="p-2 border rounded"
                >
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
              </div>

              {/* Resend Verification Email Button */}
              {!editingItem.emailVerified && (
                <div className="grid gap-2">
                  <Button
                    onClick={handleResendVerificationEmail}
                    disabled={!editingItem.email}
                  >
                    Resend Verification Email
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}