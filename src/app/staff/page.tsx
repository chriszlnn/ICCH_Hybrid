import { SessionProvider } from "next-auth/react"
import  StaffDashboard  from "./staff-dashboard"
 
export default function StaffPage() {
  return (
    <SessionProvider>
      <StaffDashboard />
    </SessionProvider>
  )
}