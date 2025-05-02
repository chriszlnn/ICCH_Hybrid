import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      role?: string;
      username?: string; // ✅ Add username
      bio?: string;
      imageUrl?: string;
      likedPosts: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    username?: string; // ✅ Add username
    bio?: string;
    imageUrl?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: string;
    username?: string; // ✅ Add username
    bio?: string;
    imageUrl?: string;
  }
}