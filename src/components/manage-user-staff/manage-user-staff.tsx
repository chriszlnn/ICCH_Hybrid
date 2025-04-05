/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Edit, MoreHorizontal, Search, Trash, Users, Plus } from "lucide-react";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import Link from "next/link";
import { Button } from "../ui/general/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/ui/custom-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "../ui/general/input";
import { Label } from "../ui/form/label";
import {
  CustomAlertDialog,
  CustomAlertDialogAction,
  CustomAlertDialogCancel,
  CustomAlertDialogContent,
  CustomAlertDialogDescription,
  CustomAlertDialogFooter,
  CustomAlertDialogHeader,
  CustomAlertDialogTitle,
} from "@/components/ui/custom-alert-dialog";
import { Loader2 } from "lucide-react";

interface Client {
  id: string;
  userId: string;
  email: string;
  username: string | null;
  emailVerified: string | null;
  imageUrl?: string;
}

export default function ManageUserStaff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const editDialogRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);

  // Use useEffect for client-side initialization
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch clients data
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const baseDelay = 1000;

    async function fetchData() {
      try {
        const clientRes = await fetch("/api/clients");

        if (!clientRes.ok) {
          throw new Error(`HTTP error! status: ${clientRes.status}`);
        }

        const clientData = await clientRes.json();

        if (isMounted) {
          setClients(clientData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        
        if (retryCount < maxRetries) {
          const delay = baseDelay * Math.pow(2, retryCount);
          retryCount++;
          console.log(`Retrying fetch in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
          setTimeout(fetchData, delay);
        } else if (isMounted) {
          setLoading(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoize filtered clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (client.userId?.toString() || '').toLowerCase().includes(searchLower) ||
        (client.email || '').toLowerCase().includes(searchLower) ||
        (client.username || '').toLowerCase().includes(searchLower)
      );
    });
  }, [clients, searchQuery]);

  // Client handlers
  const handleEditClient = useCallback((client: Client) => {
    setEditingItem({ ...client });
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteClient = useCallback((client: Client) => {
    setItemToDelete(client);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setTimeout(() => {
      setEditingItem(null);
    }, 300);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setTimeout(() => {
      setItemToDelete(null);
    }, 300);
  }, []);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const itemId = itemToDelete?.userId;
      if (!itemId) return;

      const endpoint = `/api/users/${itemId}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to delete item:", errorData.error || response.statusText);
        if (errorData.details) {
          console.error("Error details:", errorData.details);
        }
      } else {
        // Refresh data after successful deletion
        const clientRes = await fetch("/api/clients");
        const clientData = await clientRes.json();
        setClients(clientData);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const itemToUpdate = editingItem;
      if (!itemToUpdate) return;

      const endpoint = `/api/users/${itemToUpdate.userId}`;

      // Only send the emailVerified field for client updates
      const requestBody = {
        emailVerified: itemToUpdate.emailVerified ? "Verified" : "Unverified",
      };

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      // Refresh data after successful update
      const clientRes = await fetch("/api/clients");
      const clientData = await clientRes.json();
      setClients(clientData);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setLoading(false);
      setEditingItem(null);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!editingItem) return;
    
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
        <div className="flex items-center gap-4">
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
                              <DropdownMenuItem onClick={() => handleEditClient(client)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClient(client)}>
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
      <CustomDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <CustomDialogContent className="max-w-[500px] p-6">
          <CustomDialogHeader className="space-y-2">
            <CustomDialogTitle>Edit Client Information</CustomDialogTitle>
            <CustomDialogDescription>
              Make changes to the client information here.
            </CustomDialogDescription>
          </CustomDialogHeader>
          {editingItem && (
            <div className="space-y-4 mt-4">
              {/* Client ID (non-editable) */}
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={editingItem.userId}
                  disabled
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editingItem.email}
                  disabled
                />
              </div>

              {/* Status Dropdown (editable) */}
              <div className="space-y-2">
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
              </div>

              {/* Resend Verification Email Button */}
              {!editingItem.emailVerified && (
                <div className="space-y-2">
                  <Button
                    onClick={handleResendVerificationEmail}
                    disabled={!editingItem.email}
                    className="w-full"
                  >
                    Resend Verification Email
                  </Button>
                </div>
              )}
            </div>
          )}
          <CustomDialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmEdit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      {/* Delete Dialog */}
      <CustomAlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <CustomAlertDialogContent className="max-w-[500px] p-6">
          <CustomAlertDialogHeader className="space-y-2">
            <CustomAlertDialogTitle>Are you sure?</CustomAlertDialogTitle>
            <CustomAlertDialogDescription>
              This action cannot be undone. This will permanently delete the client account
              and remove their data from our servers.
            </CustomAlertDialogDescription>
          </CustomAlertDialogHeader>
          <CustomAlertDialogFooter className="mt-6">
            <CustomAlertDialogCancel>Cancel</CustomAlertDialogCancel>
            <CustomAlertDialogAction 
              onClick={handleConfirmDelete} 
              className="bg-destructive text-destructive-foreground"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </CustomAlertDialogAction>
          </CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>
    </div>
  );
}