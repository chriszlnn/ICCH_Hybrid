/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Edit, MoreHorizontal, Plus, Search, Trash, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/general/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "../ui/general/input";
import { Label } from "../ui/form/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { addStaffByAdmin } from "@/lib/actions/addStaff";

export default function ManageUser() {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [showCard, setShowCard] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<{ userId: number; username: string; email: string; emailVerified: string | null }[]>([]);
  const [staff, setStaff] = useState<{ userId: number; username: string; email: string; name: string; department: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
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
  }, []);

  const handleAddStaff = async () => {
    if (newStaff.password !== newStaff.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
  
    // Create a FormData object
    const formData = new FormData();
    formData.append("name", newStaff.name);
    formData.append("email", newStaff.email);
    formData.append("department", newStaff.department);
    formData.append("password", newStaff.password);
  
    try {
      // Call the addStaffByAdmin function
      const result = await addStaffByAdmin(formData);
  
      if (result.success) {
        // Refresh the staff list
        const staffRes = await fetch("/api/staff");
        const staffData = await staffRes.json();
        setStaff(staffData);
  
        // Close the dialog and reset the form
        setIsOpen(false);
        setNewStaff({ name: "", email: "", department: "", password: "", confirmPassword: "" });
        setPasswordError(null);
      } else {
        console.error("Failed to add staff:", result.error);
      }
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };
  const filteredClients = clients.filter(
    (client) =>
      client.userId.toString().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = staff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
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
      // Ensure the ID is a string
      const id = String(itemToDelete.userId);
  
      // Log the ID for debugging
      console.log("Deleting item with ID:", id);
  
      // Call the DELETE API endpoint
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Refresh the data
        const clientRes = await fetch("/api/clients");
        const staffRes = await fetch("/api/staff");
        const clientData = await clientRes.json();
        const staffData = await staffRes.json();
        setClients(clientData);
        setStaff(staffData);
  
        // Close the delete dialog
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSaveEdit = () => {
    console.log("Saving edited item:", editingItem);
    setIsEditDialogOpen(false);
    setEditingItem(null);
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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <div className="flex gap-2">
                  <Button size="sm" className="ml-auto md:hidden">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                  </Button>
                  <Button size="sm" className="hidden md:flex">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <DialogTitle>Add Staff</DialogTitle>
                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Fill in the account details below.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter name"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="Enter department"
                      value={newStaff.department}
                      onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Enter email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={newStaff.password}
                      onChange={(e) => {
                        setNewStaff({ ...newStaff, password: e.target.value });
                        if (e.target.value !== newStaff.confirmPassword) {
                          setPasswordError("Passwords do not match");
                        } else {
                          setPasswordError(null);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={newStaff.confirmPassword}
                      onChange={(e) => {
                        setNewStaff({ ...newStaff, confirmPassword: e.target.value });
                        if (e.target.value !== newStaff.password) {
                          setPasswordError("Passwords do not match");
                        } else {
                          setPasswordError(null);
                        }
                      }}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddStaff}>Save Staff</Button>
                  </CardFooter>
                </Card>
              </DialogContent>
            </Dialog>
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
                          <tr key={staff.userId} className="border-b">
                            <td className="py-3">{staff.userId}</td>
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {activeTab === "clients" ? "Client" : "Staff"}</DialogTitle>
            <DialogDescription>
              Make changes to the {activeTab === "clients" ? "client" : "staff"} information here.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editingItem.email}
                  onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                />
              </div>
              {activeTab === "clients" ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editingItem.phone}
                      onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={editingItem.role}
                      onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={editingItem.department}
                      onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                    />
                  </div>
                </>
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
            This action cannot be undone. This will permanently delete the
            {activeTab === "clients" ? " client" : " staff member"} and remove their data from our servers.
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