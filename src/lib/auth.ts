import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { schema } from "./schema"
import { v4 as uuid } from "uuid"
import { encode } from "@auth/core/jwt"

const adapter = PrismaAdapter(prisma);

export const { auth, handlers, signIn, signOut } = NextAuth({ 
    adapter,
    providers: [
        Credentials ({ 
            credentials: { 
                email: {}, 
                password: {},
            },
            authorize: async (credentials) => {
                const validatedCredentials = schema.parse(credentials); 

                // Find user in the database
                const user = await prisma.user.findFirst({
                    where: {
                        email: validatedCredentials.email,
                        password: validatedCredentials.password,
                    },
                });

                // If user not found, throw error
                if (!user) {
                    throw new Error("Invalid credentials");
                }

                // Return the user with role
                return { ...user, role: user.role }; // Ensure the `role` is included
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;  // Store role in the token
                token.credentials = true; // Optional flag for credentials-based sign-in
            }
            return token;
        },

        
    },

    jwt: {
        encode: async function (params) {
          if (params.token?.credentials) {
            const sessionToken = uuid();
    
            if (!params.token.sub) {
              throw new Error("No user ID found in token");
            }
    
            const createdSession = await adapter?.createSession?.({
              sessionToken: sessionToken,
              userId: params.token.sub,
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });
    
            if (!createdSession) {
              throw new Error("Failed to create session");
            }
    
            return sessionToken;
          }
          return encode(params);
        },
    },
});
