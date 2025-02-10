"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/general/card"
import { Input } from "@/components/ui/general/input"
import { Button } from "@/components/ui/general/button"
import { Label } from "@radix-ui/react-label"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
  
      if (!res.ok) throw new Error(data.message || "Something went wrong")
  
      setSuccess(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" >
      <Card className="w-full max-w-md mx-auto space-y-6 w-full rounded-lg bg-white transition-all duration-300
          shadow-[0_0_0_1px_rgba(18,181,96,0.1)]
          hover:shadow-[0_0_20px_rgba(18,181,96,0.2)]
          focus-within:shadow-[0_0_20px_rgba(18,181,96,0.3)]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-center">
              We have sent a password reset link to your email. Please check your inbox and follow the instructions.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#12B560] hover:bg-[#12B560]/90
              transition-all duration-300
              shadow-[0_0_20px_rgba(18,181,96,0.3)]
              hover:shadow-[0_0_30px_rgba(18,181,96,0.5)]
              active:shadow-[0_0_40px_rgba(18,181,96,0.7)]" onClick={() => router.push("/sign-in")}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" >
    <Card className="w-full max-w-md mx-auto space-y-6 w-full rounded-lg bg-white transition-all duration-300
          shadow-[0_0_0_1px_rgba(18,181,96,0.1)]
          hover:shadow-[0_0_20px_rgba(18,181,96,0.2)]
          focus-within:shadow-[0_0_20px_rgba(18,181,96,0.3)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>Enter your email to reset your password</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                }}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100"
                required
              />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#12B560] hover:bg-[#12B560]/90
              transition-all duration-300
              shadow-[0_0_20px_rgba(18,181,96,0.3)]
              hover:shadow-[0_0_30px_rgba(18,181,96,0.5)]
              active:shadow-[0_0_40px_rgba(18,181,96,0.7)]" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
    </div>
  )
}
