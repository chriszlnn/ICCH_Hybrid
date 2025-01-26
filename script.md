todo:

# starting template

npx shadcn@latest init (default, neutral)
.nvmrc
npx create-next-app@latest .

npx shadcn@latest add button
npx shadcn@latest add input

```ts src/components/sign-out.tsx
"use client";
const SignOut = () => {
  const handleSignOut = async () => {};

  return (
    <Button variant="destructive" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};
```

```ts ui/github.tsx
const Github = () => {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
};
```

```ts src/lib/executeAction.ts
type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

const executeAction = async <T>({
  actionFn,
  successMessage = "The actions was successful",
}: Options<T>): Promise<{ success: boolean; message: string }> => {
  try {
    await actionFn();

    return {
      success: true,
      message: successMessage,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "An error has occurred during executing the action",
    };
  }
};
```

```ts sign-in page.tsx
const Page = async () => {
  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

      <GithubSignIn />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Sign In */}
      <form className="space-y-4" action={() => {}}>
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="current-password"
        />
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
```

```ts src/components/github-sign-in.tsx
const GithubSignIn = () => {
  return (
    <form action={() => {}}>
      <Button className="w-full" variant="outline">
        <Github />
        Continue with GitHub
      </Button>
    </form>
  );
};

export { GithubSignIn };
```

```ts sign-up page.tsx
const Page = () => {
  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

      <GithubSignIn />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Sign Up */}
      <form className="space-y-4" action={() => {}}>
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="new-password"
        />
        <Button className="w-full" type="submit">
          Sign Up
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-in">Already have an account? Sign in</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
```

```ts layout
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
```

```ts /
import { SignOut } from "@/components/sign-out";

const Page = async () => {
  return (
    <>
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-6">
        <p className="text-gray-600">Signed in as:</p>
        <p className="font-medium">TODO</p>
      </div>

      <SignOut />
    </>
  );
};

export default Page;
```

```ts components/ui/github
const Github = () => {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
};

export { Github };
```

---

# tutorial starts

npm install next-auth@beta
npx auth secret

```ts (auth)/page.tsx
const session = await auth();
if (!session) redirect("/sign-in");

<p className="font-medium">{session.user?.email}</p>;
```

npm run dev to see everything works

```ts src/lib/auth.ts
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});
```

app/api/auth/[...nextauth]/route.ts

```ts
import { handlers } from "@/app/(auth)/_utils/auth";
export const { GET, POST } = handlers;
```

oauth
https://github.com/settings/developers
new oauth app
app name: auth-tutorial
homepage: http://localhost:3000
callback url: http://localhost:3000/api/auth/callback/github

copy client id and client secrets

and paste in env
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

AUTH_TRUST_HOST =true

```ts
  providers: [GitHub],
```

```ts src/components/github-sign-in.tsx
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
```

```ts sign-in page.tsx
  const session = await auth();
  if (session) redirect("/");

        action={async (formData) => {
          "use server";
          await executeAction({
            actionFn: async () => {
              await signIn("credentials", formData);
            },
          });
        }}

```

do sign up we github

go to app on github and see user has added
see user's session

```ts src/components/sign-out.tsx
const handleSignOut = async () => {
  await signOut();
};
```

you can add other providers like this according to docs if you want but they are mostly similar and very easy to do with authjs

put it in page.tsx and show user logs out and again log in

now for credentials

```ts
Credentials({
  credentials: {
    email: {},
    password: {},
  },
  authorize: async (credentials) => {
    const email = "admin@admin.com";
    const password = "1234";

    if (credentials.email === email && credentials.password === password) {
      return { email, password };
    } else {
      throw new Error("Invalid credentials.");

    }
  },
}),
```

```ts
      {/* Email/Password Sign In */}
    action={async (formData) => {
      "use server";
      await executeAction({
        actionFn: async () => {
          await signIn("credentials", formData);
        },
      });
    }}
```

try to sign in
so now we have oauth and credentials base
but we want a real data base to save our users data

---

database

prisma extension vscode

npm install prisma --save-dev

src/db/schema.prisma

```prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(uuid())
  email    String @unique
  password String
}
```

src/lib/db/data empty folder

DATABASE_URL="file:./data/dev.db"

```json package.json
  "prisma": {
    "schema": "src/lib/db/schema.prisma"
  },

script
    "db:migrate": "npx prisma migrate dev"
```

npm run db:migrate, this will generate ts types, migrations and dev.db and @prisma/client package
show the dev.db created
add db/data to git ignore
`*/lib/db/data`

npm run db:studio

add a admin@admin.com, 1234
emphasize that never directly save password and always hash of it

now we want to implement it in credentials

```ts src/lib/db/db.ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
```

```ts

    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await db.user.findFirst({
          where: { email: credentials.email, password: credentials.password },
        });

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
```

```ts
<form
  action={async (formData) => {
    "use server";
    await executeAction({
      actionFn: async () => {
        await signIn("credentials", formData);
      },
    });
  }}
>
  <Input name="email" placeholder="Email" type="email" />
  <Input name="password" placeholder="Password" type="password" />
  <Button variant="default" type="submit">
    Sign in with Credentials
  </Button>
</form>
```

---

npm i @auth/prisma-adapter

```ts
adapter: PrismaAdapter(db),
```

```prisma
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String?         @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  // Optional for WebAuthn support
  Authenticator Authenticator[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}

// Optional for WebAuthn support
model Authenticator {
  credentialID         String  @unique
  userId               String
  providerAccountId    String
  credentialPublicKey  String
  counter              Int
  credentialDeviceType String
  credentialBackedUp   Boolean
  transports           String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, credentialID])
}

```

"db:reset": "prisma migrate reset && prisma migrate dev",

npm run db:reset

go to github and revoke all users and again sign in with github
show full session

npm run db:studio
see new things added

lets enhance things

npm i zod

```ts src/lib/schema.ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

```ts auth.ts
const validatedCredentials = await schema.parseAsync(credentials);

const user = await db.user.findFirst({
  where: {
    email: validatedCredentials.email,
    password: validatedCredentials.password,
  },
});
```

add password to user prisma
npm run db:reset
errors are gone
we want register user by credentials

```ts src/lib/actions.ts
const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      await db.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,
        },
      });
    },
  });
};
```

```ts sign-up/page.tsx

  const session = await auth();
  if (session) redirect("/");

      <form
        className="space-y-4"
        action={async (formData) => {
          "use server";
          const res = await signUp(formData);
          if (res.success) {
            redirect("/sign-in");
          }
        }}
      >
```

when it comes to sign in with credentials with auth js with database session things become a little complete because we need to expand the auth config

```ts
callbacks: {
  async jwt({ token, account }) {
    if (account?.provider === "credentials") {
      token.credentials = true;
    }
    return token;
  },
},
```

show what callbacks returns

```ts
const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
```

```ts
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
    return defaultEncode(params);
  },
},
```
