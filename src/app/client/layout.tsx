//import type { Metadata } from "next"
import "../globals.css"
import type React from "react" 
import { SidebarProvider } from "@/components/ui/general/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"// Added import for React

export default function clientLayout({
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

