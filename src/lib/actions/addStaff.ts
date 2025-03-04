"use server";

import { executeAction } from "../executeAction";
import { prisma } from "../prisma";
import { schema } from "../schema";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

class CustomError extends Error {
  code: string;
  constructor(message: string, code: string = "ADD_STAFF_ERROR") {
    super(message);
    this.code = code;
  }
}

const addStaffByAdmin = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      try {
        console.log("Received FormData:", Array.from(formData.entries()));

        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        const name = formData.get("name")?.toString();
        const department = formData.get("department")?.toString();

        // Validate required fields
        if (!email || !password || !name || !department) {
          throw new CustomError("All fields are required");
        }

        // Validate password length
        if (password.length < 8) {
          throw new CustomError("Password must be at least 8 characters long");
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          throw new CustomError("User already exists");
        }

        // Validate using schema (if applicable)
        const validatedData = schema.parse({ email, password });

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user with STAFF role and emailVerified timestamp
        const newUser = await prisma.user.create({
          data: {
            email: validatedData.email.toLowerCase(),
            password: hashedPassword,
            role: Role.STAFF, // Set role to STAFF
            emailVerified: new Date(), // Add current timestamp to mark as verified
          },
        });

        console.log("User created successfully:", newUser.email);

        // Create staff profile
        const staffData = {
          userId: newUser.id,
          email: newUser.email,
          name,
          department,
        };

        await prisma.staff.create({ data: staffData });

        console.log("Staff profile created successfully for user:", newUser.email);

        return { success: true };
      } catch (error) {
        console.error("Error during staff creation:", error);
        throw new CustomError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    },
    successMessage: "Staff added successfully!",
  });
};

export { addStaffByAdmin };