'use client'

import * as React from 'react'
import { Home, Info, PenSquare, Trophy, User } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Info, label: 'Information', href: '/information' },
  { icon: PenSquare, label: 'Post', href: '/post' },
  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export function FloatingNav() {
  const [activePath, setActivePath] = React.useState('/')

  React.useEffect(() => {
    setActivePath(window.location.pathname)
  }, [])

  return (
    <SidebarProvider>
      <Sidebar
        className="fixed bottom-0 left-0 right-0 z-50 h-16 backdrop-blur-sm md:bottom-auto md:left-4 md:top-1/2 md:h-auto md:w-16 md:-translate-y-1/2 md:rounded-full md:transition-all md:duration-300 md:hover:w-48"
        variant="floating"
      >
        <SidebarContent className="flex flex-row justify-around p-0 md:flex-col md:justify-center md:p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  size="default"
                  asChild
                  aria-label={item.label}
                  isActive={activePath === item.href}
                  className="group relative md:w-full"
                >
                  <a href={item.href} className="flex items-center">
                    <item.icon className="h-5 w-5" />
                    <span className="absolute left-12 hidden whitespace-nowrap md:group-hover:inline">
                      {item.label}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}