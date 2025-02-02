//import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
//import { auth } from "@/lib/auth";
//import { redirect } from "next/navigation";

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};*/

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
        
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
          <div>
          <SessionProvider>
            {children}
            </SessionProvider>
          </div>
        </main>
        
      </body>
      </html>
   
  )
};

//export { metadata };
//export default Layout;
