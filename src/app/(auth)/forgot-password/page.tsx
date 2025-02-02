
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { signUp } from "@/lib/actions";
import { auth } from "@/lib/auth";
//import Link from "next/link";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");
  
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  );
};

export default Page;

