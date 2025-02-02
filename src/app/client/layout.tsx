import type { Metadata } from "next"
import "../globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { FloatingNav } from "@/components/nav-bar"
import type React from "react" // Added import for React



export const metadata: Metadata = {
  title: "App with Floating Nav",
  description: "An application with a floating navigation bar",
}

export default function clientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
        <SidebarProvider>
          {children}
          <FloatingNav />
        </SidebarProvider>
        
    </div>
  )
}

