/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/general/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/general/input";
import { Label } from "../ui/form/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EditProfileProps {
  currentProfile: {
    email: string;
    username: string;
    bio: string;
    posts: string[];
  };
  onSave: (username: string, bio: string) => Promise<void>;
}

export function EditProfile({ currentProfile, onSave }: EditProfileProps) {
  const [username, setUsername] = useState(currentProfile.username || "");
  const [bio, setBio] = useState(currentProfile.bio || "");
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success" | "">("");
  const [activeTab, setActiveTab] = useState("account");
  const maxChars = 100;

  // Reset form fields and alerts when the dialog is opened or closed
  useEffect(() => {
    if (isOpen) {
      setUsername(currentProfile.username || "");
      setBio(currentProfile.bio || "");
    } else {
      resetAlerts();
    }
  }, [isOpen, currentProfile]);

  // Reset alerts and password fields
  const resetAlerts = () => {
    setAlertMessage("");
    setAlertType("");
    setCurrentPassword("");
    setNewPassword("");
  };

  // Handle saving profile changes
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(username, bio);
      setIsOpen(false); // Close the dialog after saving
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  // Handle changing password
  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      setAlertType("error");
      setAlertMessage("Password must be at least 8 characters.");
      return;
    }
    resetAlerts();

    try {
      await axios.post("/api/change-password", { 
        currentPassword,
        newPassword,
        email: currentProfile.email,
      });

      setAlertType("success");
      setAlertMessage("Password updated successfully!");
      setTimeout(() => setIsOpen(false), 2000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <DialogTitle>Edit Profile</DialogTitle>
        <Tabs
          defaultValue="account"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            resetAlerts();
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Update your account details below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) =>
                      e.target.value.length <= maxChars && setBio(e.target.value)
                    }
                    placeholder="Write about yourself..."
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 text-right">
                    {bio.length}/{maxChars} characters
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {alertMessage && (
                  <Alert variant={alertType === "error" ? "destructive" : "default"} className="mb-2">
                    {alertType === "error" ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
                    <AlertDescription>{alertMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1">
                  <Label htmlFor="current">Current Password</Label>
                  <Input
                    id="current"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New Password</Label>
                  <Input
                    id="new"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleChangePassword}>Save Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}