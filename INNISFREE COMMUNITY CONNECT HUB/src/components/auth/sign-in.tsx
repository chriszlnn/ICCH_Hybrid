// src/components/auth/sign-in.tsx
"use client"; // Mark this component as a Client Component

import { useState } from "react";
import { Button } from "@/components/ui/general/button";
import { Input } from "@/components/ui/general/input";
import Link from "next/link";
import Logo from "../../assets/Innisfree-Logo-black.svg";
import Image from "next/image";
import { handleSignIn } from '@/lib/actions/sign-in-action'; // Import the Server Action
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"; // Import icons
import { useSession } from "next-auth/react";
import picture from "../../assets/innisfree-login-page.jpg";


const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"error" | "success" | null>(null); // Track alert type
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { data: session } = useSession();

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true); // Set loading to true when form is submitted
    try {
      const result = await handleSignIn(formData);
      
      if (result?.error) {
        setError(result.error); // Set the error message
        setAlertType("error"); // Set alert type to error
      } else {
        setError(null); // Clear any previous error
        setAlertType("success"); // Set alert type to success
        setTimeout(() => {
          if (session?.user?.role === "ADMIN") {
              window.location.href = "/admin"; // Redirect to admin dashboard
          } else if (session?.user?.role === "STAFF") {
              window.location.href = "/staff"; // Redirect to regular dashboard
          } else {
              window.location.href = "/client"; // Redirect to home
          }
          },1500);// Delay redirect to show success message
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("An unexpected error occurred. Please try again.");
      setAlertType("error");
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
  <div className="flex flex-col md:flex-row rounded-lg w-full max-w-4xl">
    {/* Left Side - Image (Hidden on small screens) */}
    <div className="hidden md:flex md:w-1/2 bg-gray-200">
      <Image 
        src={picture}
        alt="Sign in illustration" 
        width={500} 
        height={500} 
        className="object-cover w-full h-full"
      />
    </div>
    {/* Right Side - Form */}
    <div className="w-full max-w-sm p-10 space-y-6 md:max-w-md mx-auto 
    bg-white transition-all duration-300 shadow-[0_0_0_1px_rgba(18,181,96,0.1)] 
    hover:shadow-[0_0_20px_rgba(18,181,96,0.2)] focus-within:shadow-[0_0_20px_rgba(18,181,96,0.3)]
    rounded-lg md:rounded-tr-lg md:rounded-br-lg md:rounded-tl-none md:rounded-bl-none">

        <Image src={Logo} alt="Logo" width={200} height={128} className="mx-auto rounded-lg" />

        {/* Display Alert for error or success */}
        {error && alertType && (
          <Alert
            variant={alertType === "error" ? "destructive" : "default"}
            className="mb-2"
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

        {/* Email/Password Sign In */}
        <form
            className="space-y-4"
            onSubmit={async (e) => {
                e.preventDefault(); // Prevent default form submission
                const formData = new FormData(e.currentTarget); // Get form data
                await onSubmit(formData); // Call your sign-in function
            }}
        >
          <Input
            name="email"
            placeholder="Email"
            type="email"
            required
            autoComplete="email"
            style={{
              outline: 'none',
              boxShadow: 'none',
            }}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100"
            disabled={isLoading}
          />
          
          <Input
            name="password"
            placeholder="Password"
            type="password"
            required
            autoComplete="current-password"
            style={{
              outline: 'none',
              boxShadow: 'none',
            }}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100"
            disabled={isLoading}
          />

          <Button 
            className="w-full bg-[#12B560] hover:bg-[#12B560]/90 transition-all duration-300 shadow-[0_0_20px_rgba(18,181,96,0.3)] 
            hover:shadow-[0_0_30px_rgba(18,181,96,0.5)] active:shadow-[0_0_40px_rgba(18,181,96,0.7)]" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button asChild variant="link" disabled={isLoading}>
            <Link href="/email-forgot-password">Forgot password</Link>
          </Button>
          <br />
          <Button asChild variant="link" disabled={isLoading}>
            <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignInForm;