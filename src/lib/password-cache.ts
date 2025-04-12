import { cache } from 'react';
import { prisma } from "@/lib/prisma";
import { withDbConnection } from "@/lib/db-utils";
import bcrypt from "bcryptjs";

// Define return types for our functions
type PasswordValidationResult = {
  isValid: boolean;
  userId?: string;
  error: string | null;
};

type PasswordChangeSuccessResult = {
  success: true;
  user: {
    id: string;
    email: string;
  };
};

type PasswordChangeErrorResult = {
  success: false;
  error: string;
};

type PasswordChangeResult = PasswordChangeSuccessResult | PasswordChangeErrorResult;

// Cache for validating user password
export const validateUserPassword = cache(async (email: string, password: string): Promise<PasswordValidationResult> => {
  try {
    return await withDbConnection(async () => {
      // Fetch user from the database
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true
        }
      });

      if (!user || !user.password) {
        return { isValid: false, error: user ? "No password set for this account" : "User not found" };
      }

      // Compare the password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      
      return { 
        isValid: isPasswordMatch, 
        userId: user.id,
        error: isPasswordMatch ? null : "Current password is incorrect" 
      };
    });
  } catch (error) {
    console.error('Error validating user password:', error);
    return { isValid: false, error: "Error validating password" };
  }
});

// Cache function to change the user's password
export const changeUserPassword = cache(async (email: string, newPassword: string): Promise<PasswordChangeResult> => {
  try {
    return await withDbConnection(async () => {
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password in the database
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: hashedNewPassword },
        select: {
          id: true,
          email: true
        }
      });

      return { success: true, user: updatedUser };
    });
  } catch (error) {
    console.error('Error changing user password:', error);
    return { success: false, error: "Failed to update password" };
  }
}); 