"use server";

import { signUp } from "./actions";


export const handleSignUp = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmpassword") as string;

  // Client-side validation for password match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const result = await signUp(formData);

    // If signUp returns an error, propagate it
    if (result?.error) {
      return  {error: result.error as string};

    }
    console.log("Error at action:", result.error);

    // If signUp is successful, return an empty object (no error)
    return { success: true }; 
  } catch (error) {
    // Handle unexpected errors
    return { error: error instanceof Error ? error.message : "An error occurred during sign-up." };
  }
};