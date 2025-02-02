import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma"; // Ensure prisma is correctly set up
import { schema } from "./schema";
import { encode, decode } from "next-auth/jwt";

export const { auth, handlers, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" }, // Using JWT sessions
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const validatedCredentials = schema.parse(credentials);

                const user = await prisma.user.findUnique({
                    where: { email: validatedCredentials.email },
                });

                if (!user) throw new Error("Invalid credentials");

                if (!user.password) throw new Error("Invalid credentials");

                if (!user.emailVerified) {
                    throw new Error("Email is not verified. Please check your inbox.");
                }

                const isValidPassword = await bcrypt.compare(
                    validatedCredentials.password,
                    user.password
                );

                if (!isValidPassword) throw new Error("Invalid credentials");

                return { id: user.id, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role as string; // Attach role to session
            return session;
        },
    },
    jwt: {
        encode: async (params) => {
            return encode({
                secret: process.env.AUTH_SECRET || "fallback_secret",
                token: params.token,
                salt: ""
            });
        },
        decode: async (params) => {
            return decode({
                secret: process.env.AUTH_SECRET || "fallback_secret",
                token: params.token,
                salt: ""
            });
        },
    },
    secret: process.env.AUTH_SECRET, // Ensure it's set in .env
});
