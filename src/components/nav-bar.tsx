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
} from '@/components/ui/general/sidebar'

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
        className="fixed bottom-0 left-0 right-0 z-50 h-20 md:bottom-auto md:left-4 md:top-1/2 md:h-auto md:w-20 md:-translate-y-1/2 md:rounded-3xl md:transition-all md:duration-300 md:hover:w-56"
        variant="floating"
      >
        <SidebarContent className="flex flex-row justify-around p-2 md:flex-col md:justify-center md:p-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  size="lg"  // Larger button size
                  asChild
                  aria-label={item.label}
                  isActive={activePath === item.href}
                  className="group relative md:w-full"
                >
                  <a href={item.href} className="flex items-center space-x-3">
                    <item.icon className="h-8 w-8" /> {/* Bigger icons */}
                    <span className="absolute left-16 hidden text-lg md:group-hover:inline">
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
