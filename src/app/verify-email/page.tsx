"use client";

import VerifyEmailForm from '@/components/auth/verify-email-form'
import { Suspense } from 'react'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading verification...</div>}>
      <VerifyEmailForm />
    </Suspense>
  )
}