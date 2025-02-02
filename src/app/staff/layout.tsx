import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { FloatingNav } from "@/components/nav-bar"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "App with Floating Nav",
  description: "An application with a floating navigation bar",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      <body className={inter.className}>
        <SidebarProvider>
        {children}
          <FloatingNav />
        </SidebarProvider>
      </body>
  
  )
}

