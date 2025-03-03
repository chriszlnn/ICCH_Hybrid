"use client"; // Mark this component as a Client Component
import { Button } from "@/components/ui/general/button";
import { Input } from "@/components/ui/general/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSignUp } from "@/lib/actions/sign-up-actions";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { AlertCircle, CheckCircle2 } from "lucide-react";

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"error" | "success" | null>(null);
  const router = useRouter();

  const handleFormSubmit = async (formData: FormData): Promise<void> => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmpassword") as string;

    // Client-side validation for password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setAlertType("error");
      return;
    }

    const result = await handleSignUp(formData);

    if (result?.error) {
      console.log("Error in form:",result.error);
      setError(result.error); // Set the error message
      setAlertType("error"); // Set alert type to error
    } else {
      setError(null); // Clear any previous error
      setAlertType("success"); // Set alert type to success
      setTimeout(() => {
        router.push("/sign-in"); // Delay redirect to show success message
      }, 2000); // Redirect after 2 seconds
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-full max-w-sm p-10 mx-auto space-y-6 w-full max-w-md rounded-lg bg-white transition-all duration-300
          shadow-[0_0_0_1px_rgba(18,181,96,0.1)]
          hover:shadow-[0_0_20px_rgba(18,181,96,0.2)]
          focus-within:shadow-[0_0_20px_rgba(18,181,96,0.3)]"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        {/* Display error or success message */}
        {alertType && (
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
            <AlertDescription>
            {alertType === "error" ? error : "Sign-up successful! Please Verify your email."}
              </AlertDescription>
          </Alert>
        )}

        {/* Email/Password Sign Up */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleFormSubmit(formData); // Manually submit the form
          }}
        >
          <Input
            name="email"
            placeholder="Email"
            type="email"
            required
            autoComplete="email"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100"
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            required
            autoComplete="new-password"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100"
          />
          <Input
            name="confirmpassword"
            placeholder="Confirm Password"
            type="password"
            required
            autoComplete="new-password"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100"
          />
          <Button
            className="w-full bg-[#12B560] hover:bg-[#12B560]/90
              transition-all duration-300
              shadow-[0_0_20px_rgba(18,181,96,0.3)]
              hover:shadow-[0_0_30px_rgba(18,181,96,0.5)]
              active:shadow-[0_0_40px_rgba(18,181,96,0.7)]"
            type="submit"
          >
            Sign Up
          </Button>
        </form>

        <div className="text-center">
          <Button asChild variant="link">
            <Link href="/sign-in">Already have an account? Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;