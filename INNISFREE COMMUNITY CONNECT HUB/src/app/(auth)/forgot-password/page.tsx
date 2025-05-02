"use client";

//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { signUp } from "@/lib/actions";

//import Link from "next/link";

import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

