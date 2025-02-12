
import "../globals.css"
import { SidebarProvider} from "@/components/ui/general/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar-staff"
import type React from "react" // Added import for React
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");
  
  return (
    <div>
      <SidebarProvider>
      <AppSidebar />
      <main className="p-4 md:ml-64 mb-16">
        {children}
      </main>
    </SidebarProvider>
    </div>
  
  )
}

