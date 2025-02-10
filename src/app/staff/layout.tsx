
import "../globals.css"
import { SidebarProvider} from "@/components/ui/general/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import type React from "react" // Added import for React


export default function RootLayout({
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

