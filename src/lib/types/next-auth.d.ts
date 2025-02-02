import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: string;
  }
}