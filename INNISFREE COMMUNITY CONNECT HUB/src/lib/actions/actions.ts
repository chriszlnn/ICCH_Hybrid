"use server";

import { executeAction } from "../executeAction";
import { prisma } from "../prisma";
import { schema } from "../schema";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../token";
import { sendVerificationEmail } from "../mail";
import { Role } from "@prisma/client";

class CustomError extends Error {
  code: string;
  constructor(message: string, code: string = "SIGNUP_ERROR") {
    super(message);
    this.code = code;
  }
}

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      try {
        console.log("Received FormData:", Array.from(formData.entries()));

        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        const roleInput = formData.get("role")?.toString();
        const imageUrl = formData.get("imageUrl")?.toString() || "";
        const bio = formData.get("bio")?.toString() || "";
        const username = formData.get("username")?.toString() || "";

        // Validate email and password existence
        if (!email || !password) {
          throw new CustomError("Email and password are required");
        }

        // Validate password length
        if (password.length < 8) {
          throw new CustomError("Password must be at least 8 characters long");
        }

        // Ensure role is valid
        const role = Object.values(Role).includes(roleInput as Role) ? (roleInput as Role) : Role.CLIENT;
        

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          throw new CustomError("User already exists");
        }

        // Validate using schema
        const validatedData = schema.parse({ email, password });

        // Generate verification token
        const verificationToken = await generateVerificationToken(email);
        console.log("Generated Verification Token:", verificationToken);

        // Send verification email
        await sendVerificationEmail(email, verificationToken.token);
        console.log("Verification email sent to:", email);

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const newUser = await prisma.user.create({
          data: {
            email: validatedData.email.toLowerCase(),
            password: hashedPassword,
            role,
          },
        });

        console.log("User created successfully:", newUser.email);

        // Create role-specific profile
        const roleData = { userId: newUser.id, email: newUser.email, username, bio, imageUrl };
        switch (role) {
          case Role.CLIENT:
            await prisma.client.create({ data: roleData });
            break;
          case Role.ADMIN:
            await prisma.admin.create({ data: roleData });
            break;
          case Role.STAFF:
            await prisma.staff.create({ data: roleData });
            break;
          default:
            throw new CustomError("Invalid role specified");
        }

        console.log(`${role} role created successfully for user:`, newUser.email);

        return { success: true };
      } catch (error) {
        console.error("Error during sign-up:", error);
        throw new CustomError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    },
    successMessage: "User registered successfully!",
  });
};

export { signUp };



// src/app/actions.ts

export async function forgotPassword(p0: string, formData: FormData) {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      return { error: data.error || 'Something went wrong!' };
    }

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: 'Failed to send reset link.' };
  }
}





/* export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // Find the token in the database
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) throw new Error('Invalid or expired token');

  // Optionally, check token expiration (e.g., 1 hour)
  const expirationTime = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
  const tokenAge = new Date().getTime() - resetToken.createdAt.getTime();

  if (tokenAge > expirationTime) throw new Error('Token has expired');

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Delete the token after use
  await prisma.passwordResetToken.delete({ where: { token } });

  console.log('Password has been reset successfully');
} */






