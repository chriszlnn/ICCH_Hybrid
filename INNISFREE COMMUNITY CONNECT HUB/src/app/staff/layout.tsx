import "../globals.css"
import { SidebarProvider} from "@/components/ui/general/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar-staff"
import type React from "react" // Added import for React
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AutoRefreshOnRouteChange from "@/lib/utils/auto-refresh";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  if (session?.user?.role !== "STAFF") redirect("/sign-in");
  
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-0 pl-0 pr-0 transition-all duration-300">
        <AutoRefreshOnRouteChange />
        {children}
      </main>
    </SidebarProvider>
    </div>
  )
}

