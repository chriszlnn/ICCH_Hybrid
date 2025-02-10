"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/general/card";
import { Input } from "@/components/ui/general/input";
import { Button } from "@/components/ui/general/button";
import { Label } from "@radix-ui/react-label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatePassword = (password: string | any[]) => password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
  
    try {
      const token = new URLSearchParams(window.location.search).get("token"); // Extract token from URL
      if (!token) {
        setError("Invalid or missing token.");
        setIsLoading(false);
        return;
      }
  
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ newPassword, token }),
        headers: { "Content-Type": "application/json" },
      });
  
      const text = await response.text(); // Read raw response text
      console.log("Raw response:", text); // Debugging
  
      try {
        const data = JSON.parse(text); // Parse JSON manually
        console.log("Parsed JSON:", data);
  
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong.");
        }
  
        setSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new Error("Invalid JSON response from server.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Password Reset Successful</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-center">Your password has been successfully reset. You can now log in.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push("/sign-in")}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" >
    <Card className="w-full max-w-md mx-auto space-y-6 w-full max-w-md rounded-lg bg-white transition-all duration-300
          shadow-[0_0_0_1px_rgba(18,181,96,0.1)]
          hover:shadow-[0_0_20px_rgba(18,181,96,0.2)]
          focus-within:shadow-[0_0_20px_rgba(18,181,96,0.3)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>Enter your new password.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} style={{
            outline: 'none',
            boxShadow: 'none',
          }}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} style={{
            outline: 'none',
            boxShadow: 'none',
          }}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100" />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#12B560] hover:bg-[#12B560]/90
              transition-all duration-300
              shadow-[0_0_20px_rgba(18,181,96,0.3)]
              hover:shadow-[0_0_30px_rgba(18,181,96,0.5)]
              active:shadow-[0_0_40px_rgba(18,181,96,0.7)]" type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
    </div>
  );
}
