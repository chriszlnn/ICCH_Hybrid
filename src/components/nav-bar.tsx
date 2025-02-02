"use client"
import { Home, Search, Bell, Settings, Menu } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function FloatingNav() {
  return (
    <Sidebar
      className="fixed bottom-0 left-0 right-0 z-50 h-16  bg-background/80 backdrop-blur-sm md:bottom-auto md:left-4 md:top-1/2 md:h-auto md:w-16 md:-translate-y-1/2 md:rounded-full "
      variant="floating"
    >
      <SidebarHeader className="hidden md:flex">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="default" asChild aria-label="Menu">
              <Menu className="h-5 w-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-row justify-around p-0 md:flex-col md:justify-center md:p-2">
        <SidebarMenu className="md:orientation-vertical">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton size="default" asChild aria-label={item.label}>
                <a href={item.href}>
                  <item.icon className="h-5 w-5" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="hidden md:flex">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  )
}

