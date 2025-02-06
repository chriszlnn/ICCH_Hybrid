
import { Button } from "@/components/ui/general/button";
import { Input } from "@/components/ui/general/input";
import { signUp } from "@/lib/actions/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

const SignUpForm = async () => {
  
  
  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

      {/* Email/Password Sign Up */}
      <form
        className="space-y-4"
        action={async (formData: FormData) => {
          "use server";
          const res = await signUp(formData);
          if (res.success){
            redirect("/sign-in");
          }
        }}
      >
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="new-password"
        />
        <Button className="w-full" type="submit">
          Sign Up
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-in">Already have an account? Sign in</Link>
        </Button>
      </div>
    </div>
  );
};

export default SignUpForm;

