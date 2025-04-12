/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Edit, MoreHorizontal, Search, Trash, Users, Plus, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
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
import { useToast } from "@/components/ui/toast/use-toast";
import { Skeleton } from "@/components/ui/general/skeleton";

interface Client {
  id: string;
  userId: string;
  email: string;
  username: string | null;
  emailVerified: Date | string | null;
  imageUrl?: string | null;
  postCount?: number;
}

export default function ManageUserStaff() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const editDialogRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);

  // Use useEffect for client-side initialization
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch clients data
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const clientRes = await fetch("/api/clients");

      if (!clientRes.ok) {
        throw new Error(`HTTP error! status: ${clientRes.status}`);
      }

      const clientData = await clientRes.json();
      setClients(clientData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load client data. Database connection issue.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch clients on mount
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      fetchClients();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchClients]);

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
        emailVerified: itemToUpdate.emailVerified != null ? "Verified" : "Unverified",
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
      
      // Show success toast notification
      toast({
        title: "Updated successfully",
        description: "Client information has been updated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      
      // Show error toast notification
      toast({
        title: "Update failed",
        description: "There was a problem updating the client information.",
        variant: "destructive",
      });
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
        // Show success toast notification instead of alert
        toast({
          title: "Email sent",
          description: "Verification email has been sent successfully.",
          variant: "default",
        });
      } else {
        console.error("Failed to resend verification email");
        // Show error toast notification instead of alert
        toast({
          title: "Email not sent",
          description: "Failed to send verification email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      // Show error toast notification instead of alert
      toast({
        title: "Email not sent",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
    }
  };

  // TableSkeleton component for loading state
  const TableSkeleton = () => {
    return (
      <div className="space-y-3">
        {/* Header skeleton */}
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Skeleton className="h-5 w-24" /> {/* Client Id */}
              <Skeleton className="h-5 w-16" /> {/* Email */}
              <Skeleton className="h-5 w-24" /> {/* Username */}
              <Skeleton className="h-5 w-16" /> {/* Status */}
            </div>
            <Skeleton className="h-5 w-20" /> {/* Actions */}
          </div>
        </div>
        
        {/* Row skeletons */}
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="border-b py-3">
            <div className="flex justify-between items-center">
              <div className="flex flex-1 gap-4">
                <Skeleton className="h-4 w-1/4 max-w-[180px]" /> {/* Client Id */}
                <Skeleton className="h-4 w-1/3 max-w-[200px]" /> {/* Email */}
                <Skeleton className="h-4 w-[120px]" /> {/* Username */}
                <Skeleton className="h-5 w-[80px] rounded-full" /> {/* Status badge */}
              </div>
              <Skeleton className="h-8 w-8 rounded-md" /> {/* Action button */}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Error UI component
  const ErrorDisplay = () => {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="rounded-full bg-red-100 p-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">Database Connection Error</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {error || "Could not connect to the database. Please try again."}
          </p>
        </div>
        <Button onClick={fetchClients} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col pb-12">
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
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <ErrorDisplay />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] md:min-w-full border-collapse table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-1 sm:px-3 text-left font-medium w-1/4 min-w-[180px]">Client Id</th>
                        <th className="py-3 px-1 sm:px-3 text-left font-medium w-1/3 min-w-[120px]">Email</th>
                        <th className="py-3 px-1 sm:px-3 text-left font-medium w-1/4 min-w-[100px]">Username</th>
                        <th className="py-3 px-1 sm:px-3 text-left font-medium w-1/6 min-w-[80px]">Status</th>
                        <th className="py-3 px-1 sm:px-3 text-right font-medium w-1/8 min-w-[60px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.userId} className="border-b">
                          <td className="py-3 px-1 sm:px-3 break-all text-xs sm:text-sm">{client.userId}</td>
                          <td className="py-3 px-1 sm:px-3 break-words text-xs sm:text-sm">{client.email}</td>
                          <td className="py-3 px-1 sm:px-3 break-words text-xs sm:text-sm">{client.username}</td>
                          <td className="py-3 px-1 sm:px-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                client.emailVerified != null
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {client.emailVerified != null ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="py-3 px-1 sm:px-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
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
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Dialog */}
      <CustomDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <CustomDialogContent className="max-w-[500px] p-2">
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
                  value={editingItem.emailVerified != null ? "Verified" : "Unverified"}
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
              {editingItem.emailVerified == null && (
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
      <CustomAlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} className="pr-6">
        <CustomAlertDialogContent className="max-w-[450px] p-0">
          <CustomAlertDialogHeader className="space-y-1 p-0">
            <CustomAlertDialogTitle>Are you sure?</CustomAlertDialogTitle>
            <CustomAlertDialogDescription>
              This action cannot be undone. This will permanently delete the client account
              and remove their data from our servers.
            </CustomAlertDialogDescription>
          </CustomAlertDialogHeader>
          <CustomAlertDialogFooter className="mt-4">
            <CustomAlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</CustomAlertDialogCancel>
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