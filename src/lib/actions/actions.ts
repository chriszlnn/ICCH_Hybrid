import { executeAction } from "../executeAction"
import { prisma } from "../prisma"
import { schema } from "../schema"
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../token";
import { sendVerificationEmail } from "../mail";


import { Role } from "@prisma/client";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      try {
        const email = formData.get("email") as string | null;
        const password = formData.get("password") as string | null;
        const role = (formData.get("role") as Role) || Role.CLIENT;
        const imageUrl = (formData.get("imageUrl") as string) || "";
        const bio = (formData.get("bio") as string) || "";
        const username = (formData.get("username") as string) || ""; // Username added

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }

        const validatedData = schema.parse({ email, password });

        const verificationToken = await generateVerificationToken(email);
        console.log("Generated Verification Token:", verificationToken);

        await sendVerificationEmail(email, verificationToken.token);
        console.log("Verification email sent to:", email);

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const newUser = await prisma.user.create({
          data: {
            email: validatedData.email.toLowerCase(),
            password: hashedPassword,
            role,
          },
        });

        console.log("User created successfully:", newUser.email);

        // Create role-specific record with bio, imageUrl, and username
        switch (role) {
          case Role.CLIENT:
            await prisma.client.create({
              data: { userId: newUser.id, username, bio, imageUrl },
            });
            break;

          case Role.ADMIN:
            await prisma.admin.create({
              data: { userId: newUser.id, username, bio, imageUrl },
            });
            break;

          case Role.STAFF:
            await prisma.staff.create({
              data: { userId: newUser.id, username, bio, imageUrl },
            });
            break;

          default:
            throw new Error("Invalid role specified");
        }

        console.log(`${role} role created successfully for user:`, newUser.email);
      } catch (error) {
        console.error("Error during sign-up:", error);
        throw error;
      }
    },
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






