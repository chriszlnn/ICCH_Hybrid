import { SessionProvider } from "next-auth/react"
import  StaffDashboard  from "./staff-dashboard"
import { FloatingNav } from "@/components/nav-bar";

 
export default function StaffPage() {
  return (
    <SessionProvider>
      <StaffDashboard />
      <FloatingNav />
    </SessionProvider>
  )
}