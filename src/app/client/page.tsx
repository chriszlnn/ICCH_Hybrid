//import { SessionProvider } from "next-auth/react"
import  ClientDashboard  from "./client-dashboard"
import SkinSelector from "@/components/skin-selector/skin-selector"
//import { FloatingNav } from "@/components/nav-bar"
 
export default function ClientPage() {
  
  return (
      <>
      <ClientDashboard />
      <SkinSelector />
      </>
  )
}