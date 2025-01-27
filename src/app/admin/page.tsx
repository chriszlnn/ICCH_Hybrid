import { SessionProvider } from "next-auth/react"
import  AdminDashboard  from "./admin-dashboard"

 
export default function AdminPage() {
  return (
    <SessionProvider>
      <AdminDashboard />
    </SessionProvider>
  )
}