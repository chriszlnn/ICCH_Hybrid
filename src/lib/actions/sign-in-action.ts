"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export const handleSignIn = async (formData: FormData) => {
    try {
        const result = await signIn("credentials", {
            redirect: false,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        });

        if (result?.error) {
            // Remove the "Read more" part from the error message
            const cleanErrorMessage = result.error.replace(/Read more at .+$/, "").trim();
            return { error: cleanErrorMessage }; // Return the cleaned error message
        }

        return { success: true }; // Indicate success
    } catch (error) {
        if (error instanceof AuthError) {
            // Remove the "Read more" part from the error message
            const cleanErrorMessage = error.message.replace(/Read more at .+$/, "").trim();
            return { error: cleanErrorMessage }; // Return the cleaned error message
        }
        return { error: "An unexpected error occurred" }; // Handle other errors
    }
};