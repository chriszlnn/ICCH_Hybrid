import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast/toaster";

//import Head from "next/head";

//import Head from "next/head";

//import { auth } from "@/lib/auth";
//import { redirect } from "next/navigation";

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/

export const metadata: Metadata = {
  title: "Innisfree Community",
  icons: {
    icon: "/favicon.ico", // Path to your favicon
  },
};




type LayoutProps = {
  children: ReactNode;
};
export default async function RootLayout({ children }: LayoutProps) {
  //const session = await auth()

  // if(!session)
  // {
  //   redirect("/sign-in");
  // }

  return (
    <html>
      <body>
        <main className="items-center justify-center min-h-screen bg-white px-0 md:px-20 font-[var(--font-innisfree)] ">
          <div>
          <SessionProvider>
            {children}
            </SessionProvider>
          </div>
        </main>
        <Toaster />
      </body>
      </html>
   
  )
};

//export { metadata };
//export default Layout;
