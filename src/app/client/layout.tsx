//import type { Metadata } from "next"
import "../globals.css"
import type React from "react" 
import { SidebarProvider } from "@/components/ui/general/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";// Added import for React


export default async function clientLayout({
  
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  if (session?.user?.role !== "CLIENT") redirect("/sign-in");
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-0 pl-0 pr-0 transition-all duration-300">
      
        {children}
      </main>
    </SidebarProvider>
    </div>
    
  )
}

