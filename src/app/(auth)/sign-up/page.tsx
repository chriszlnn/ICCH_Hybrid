
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { signUp } from "@/lib/actions";
import { auth } from "@/lib/auth";
//import Link from "next/link";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/sign-up-form";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");
  
  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default Page;

