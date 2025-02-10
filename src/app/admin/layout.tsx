
import "../globals.css"
import type React from "react" // Added import for React
import { SidebarProvider} from "@/components/ui/general/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

export default function adminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

