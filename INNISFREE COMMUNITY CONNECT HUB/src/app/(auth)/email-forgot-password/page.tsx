//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { signUp } from "@/lib/actions";
import { auth } from "@/lib/auth";
//import Link from "next/link";
import { redirect } from "next/navigation";
import EmailForgotPasswordForm from "@/components/auth/email-forgot-password-form";
import { Suspense } from "react";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");
  
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EmailForgotPasswordForm />
      </Suspense>
    </div>
  );
};

export default Page;

