import { SessionProvider } from "next-auth/react"
import  ClientDashboard  from "./client-dashboard"
 
export default function ClientPage() {
  return (
    <SessionProvider>
      <ClientDashboard />
    </SessionProvider>
  )
}