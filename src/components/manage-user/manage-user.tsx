/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Edit, MoreHorizontal, Plus, Search, Trash, Users, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import Link from "next/link";
import { Button } from "../ui/general/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogTrigger,
} from "@/components/ui/custom-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "../ui/general/input";
import { Label } from "../ui/form/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { addStaffByAdmin } from "@/lib/actions/addStaff";

export default function ManageUser() {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const editDialogRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"error" | "success" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailAlertOpen, setEmailAlertOpen] = useState(false);
  const [emailAlertMessage, setEmailAlertMessage] = useState("");
  const [emailAlertType, setEmailAlertType] = useState<"success" | "error">("success");

  useEffect(() => {
    // Set mounted to true when component mounts
    setMounted(true);
    
    async function fetchData() {
      try {
        const clientRes = await fetch("/api/clients");
        const staffRes = await fetch("/api/staff");
        const clientData = await clientRes.json();
        const staffData = await staffRes.json();
        setClients(clientData);
        setStaff(staffData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    
    // Cleanup function to reset dialog states when component unmounts
    return () => {
      setMounted(false);
      setIsEditDialogOpen(false);
      setDeleteDialogOpen(false);
      setEditingItem(null);
      setItemToDelete(null);
    };
  }, []);

  // Handle navigation events
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsEditDialogOpen(false);
      setDeleteDialogOpen(false);
      setEditingItem(null);
      setItemToDelete(null);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const validatePassword = (password: string, confirmPassword: string) => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setAlertType("error");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setAlertType("error");
      return false;
    }
    setError(null);
    setAlertType(null);
    return true;
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password before submission
    if (!validatePassword(newStaff.password, newStaff.confirmPassword)) {
      return;
    }

    setError(null);
    setAlertType(null);
    setLoading(true);

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("name", newStaff.name);
      formData.append("email", newStaff.email);
      formData.append("department", newStaff.department);
      formData.append("password", newStaff.password);

      // Call the addStaffByAdmin function
      const result = await addStaffByAdmin(formData);

      if (result.success) {
        // Refresh the staff list
        const staffRes = await fetch("/api/staff");
        const staffData = await staffRes.json();
        setStaff(staffData);

        // Show success message
        setError("Staff member added successfully");
        setAlertType("success");

        // Close the dialog and reset the form after a short delay
        setTimeout(() => {
          setIsAddStaffOpen(false);
          setNewStaff({ name: "", email: "", department: "", password: "", confirmPassword: "" });
          setError(null);
          setAlertType(null);
        }, 2000);
      } else {
        setError(result.error || "Failed to add staff");
        setAlertType("error");
      }
    } catch (err: any) {
      setError(err.message || "Error adding staff");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

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

  // Memoize filtered staff
  const filteredStaff = useMemo(() => {
    return staff.filter((staffMember) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (staffMember.id?.toString() || '').toLowerCase().includes(searchLower) ||
        (staffMember.email || '').toLowerCase().includes(searchLower) ||
        (staffMember.name || '').toLowerCase().includes(searchLower)
      );
    });
  }, [staff, searchQuery]);

  // Memoize handlers
  const handleEdit = useCallback((item: any) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((item: any) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    // Use a timeout to reset the editing item after the dialog animation completes
    setTimeout(() => {
      setEditingItem(null);
    }, 300);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    // Use a timeout to reset the item to delete after the dialog animation completes
    setTimeout(() => {
      setItemToDelete(null);
    }, 300);
  }, []);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
  
    try {
      setIsDeleting(true);
      
      if (activeTab === "staff") {
        // For staff, use the staff-specific endpoint
        const id = String(itemToDelete.id);
        console.log("Deleting staff with ID:", id);
        
        const response = await fetch(`/api/staff/${id}`, {
          method: "DELETE",
        });
        
        console.log("Delete staff response status:", response.status);
        
        if (response.ok) {
          // Refresh the staff data
          const staffRes = await fetch("/api/staff");
          const staffData = await staffRes.json();
          setStaff(staffData);
          
          // Close the delete dialog
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        } else {
          // Get the error message from the response
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to delete staff:", errorData.error || response.statusText);
          if (errorData.details) {
            console.error("Error details:", errorData.details);
          }
          alert(`Failed to delete staff: ${errorData.error || "Unknown error"}`);
        }
      } else {
        // For clients, use the existing user deletion endpoint
        const id = String(itemToDelete.userId);
        console.log("Deleting client with ID:", id);
        
        // Call the user DELETE API endpoint
        const response = await fetch(`/api/users/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        
        console.log("Delete client response status:", response.status);
        
        if (response.ok) {
          // Refresh the client data
          const clientRes = await fetch("/api/clients");
          const clientData = await clientRes.json();
          setClients(clientData);
          
          // Close the delete dialog
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        } else {
          // Get the error message from the response
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to delete client:", errorData.error || response.statusText);
          if (errorData.details) {
            console.error("Error details:", errorData.details);
          }
          alert(`Failed to delete client: ${errorData.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
  
    try {
      setIsEditing(true);
      let requestBody;
  
      if (activeTab === "clients") {
        requestBody = {
          emailVerified: editingItem.emailVerified ? "Verified" : "Unverified",
        };
      } else if (activeTab === "staff") {
        requestBody = {
          name: editingItem.name,
          department: editingItem.department,
        };
      } else {
        console.error("Invalid active tab");
        return;
      }
  
      // Send the request to the API
      const response = await fetch(
        activeTab === "staff" 
          ? `/api/staff/${editingItem.id}` 
          : `/api/users/${editingItem.userId}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (response.ok) {
        // Refresh the data
        if (activeTab === "clients") {
          const clientRes = await fetch("/api/clients");
          const clientData = await clientRes.json();
          setClients(clientData);
        } else if (activeTab === "staff") {
          const staffRes = await fetch("/api/staff");
          const staffData = await staffRes.json();
          setStaff(staffData);
        }
  
        // Close the edit dialog
        setIsEditDialogOpen(false);
        setEditingItem(null);
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      setIsSendingEmail(true);
      const userIdField = activeTab === "staff" ? editingItem.id : editingItem.userId;
      const response = await fetch(`/api/users/${userIdField}`, {
        method: "POST",
      });

      if (response.ok) {
        setEmailAlertType("success");
        setEmailAlertMessage("Verification email has been sent successfully!");
        setEmailAlertOpen(true);
      } else {
        setEmailAlertType("error");
        setEmailAlertMessage("Failed to send verification email. Please try again.");
        setEmailAlertOpen(true);
      }
    } catch (error) {
      setEmailAlertType("error");
      setEmailAlertMessage("Error sending verification email. Please try again.");
      setEmailAlertOpen(true);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCloseAddStaffDialog = () => {
    setIsAddStaffOpen(false);
    setNewStaff({
      name: "",
      email: "",
      department: "",
      password: "",
      confirmPassword: ""
    });
    setError(null);
    setAlertType(null);
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
         
            
              <Button size="sm" onClick={() => setIsAddStaffOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
           <CustomDialog open={isAddStaffOpen} onOpenChange={handleCloseAddStaffDialog}>
            <CustomDialogContent className="max-w-[500px] p-6">
              <CustomDialogHeader className="space-y-2">
                <CustomDialogTitle>Add New Staff</CustomDialogTitle>
                <CustomDialogDescription>
                  Create a new staff account. The staff member will receive an email to set up their password.
                </CustomDialogDescription>
              </CustomDialogHeader>

              {error && alertType && (
                <Alert
                  variant={alertType === "error" ? "destructive" : "default"}
                  className="mt-4 mb-4"
                >
                  {alertType === "error" ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleAddStaff} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Staff Name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="staff@example.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Department"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={newStaff.password}
                    onChange={(e) => {
                      setNewStaff({ ...newStaff, password: e.target.value });
                      validatePassword(e.target.value, newStaff.confirmPassword);
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={newStaff.confirmPassword}
                    onChange={(e) => {
                      setNewStaff({ ...newStaff, confirmPassword: e.target.value });
                      validatePassword(newStaff.password, e.target.value);
                    }}
                    required
                  />
                </div>
                <CustomDialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddStaffOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Staff"
                    )}
                  </Button>
                </CustomDialogFooter>
              </form>
            </CustomDialogContent>
          </CustomDialog>
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
          <Tabs defaultValue="clients" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex md:hidden">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            <TabsList className="hidden md:flex">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="clients" className="border-none p-0">
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
            </TabsContent>
            <TabsContent value="staff" className="border-none p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Staff</CardTitle>
                  <CardDescription>Manage staff members and their roles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left font-medium w-21">Staff ID</th>
                          <th className="py-3 text-left font-medium">Name</th>
                          <th className="py-3 text-left font-medium">Email</th>
                          <th className="hidden py-3 text-left font-medium sm:table-cell">Department</th>
                          <th className="py-3 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaff.map((staff) => (
                          <tr key={staff.id} className="border-b">
                            <td className="py-3">{staff.id}</td>
                            <td className="py-3">{staff.name}</td>
                            <td className="py-3">{staff.email}</td>
                            <td className="py-3">{staff.department}</td>
                            <td className="py-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(staff)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(staff)}>
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
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Edit Dialog */}
      <CustomDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <CustomDialogContent className="max-w-[500px] p-6">
          <CustomDialogHeader className="space-y-2">
            <CustomDialogTitle>Edit {activeTab === "clients" ? "Client" : "Staff"}</CustomDialogTitle>
            <CustomDialogDescription>
              Make changes to the {activeTab === "clients" ? "client" : "staff"} information here.
            </CustomDialogDescription>
          </CustomDialogHeader>
          {editingItem && (
            <div className="space-y-4 mt-4">
              {activeTab === "clients" ? (
                <>
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
                        disabled={!editingItem.email || isSendingEmail}
                        className="w-full"
                      >
                        {isSendingEmail ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Resend Verification Email"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Staff ID (non-editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="staffId">Staff ID</Label>
                    <Input
                      id="staffId"
                      value={editingItem.id}
                      disabled
                    />
                  </div>
          
                  {/* Name (editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                  </div>
          
                  {/* Department (editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={editingItem.department}
                      onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                    />
                  </div>
          
                  {/* Email (non-editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editingItem.email}
                      disabled
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <CustomDialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isEditing}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isEditing}>
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      {/* Delete Confirmation Dialog */}
      <CustomAlertDialog open={deleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <CustomAlertDialogContent className="max-w-[500px] p-6">
          <CustomAlertDialogHeader className="space-y-2">
            <CustomAlertDialogTitle>Are you sure?</CustomAlertDialogTitle>
            <CustomAlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {activeTab === "clients" ? " client" : " staff member"} and remove their data from our servers.
            </CustomAlertDialogDescription>
          </CustomAlertDialogHeader>
          <CustomAlertDialogFooter className="mt-6">
            <CustomAlertDialogCancel disabled={isDeleting} onClick={handleCloseDeleteDialog}>Cancel</CustomAlertDialogCancel>
            <CustomAlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground" disabled={isDeleting}>
              {isDeleting ? (
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

      {/* Email Verification Alert Dialog */}
      <CustomAlertDialog open={emailAlertOpen} onOpenChange={setEmailAlertOpen}>
        <CustomAlertDialogContent className="max-w-[500px] p-6">
          <CustomAlertDialogHeader className="space-y-2">
            <div className="flex items-center">
              {emailAlertType === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              )}
              <CustomAlertDialogTitle>
                {emailAlertType === "success" ? "Success" : "Error"}
              </CustomAlertDialogTitle>
            </div>
            <CustomAlertDialogDescription>
              {emailAlertMessage}
            </CustomAlertDialogDescription>
          </CustomAlertDialogHeader>
          <CustomAlertDialogFooter className="mt-6">
            <CustomAlertDialogAction onClick={() => setEmailAlertOpen(false)}>
              OK
            </CustomAlertDialogAction>
          </CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>
    </div>
  );
}