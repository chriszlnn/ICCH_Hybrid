
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import Link from "next/link";


const SignInForm = async () => {
    
  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

      {/* Email/Password Sign In */}
      <form
        className="space-y-4"
        action={async (formData: FormData) => {
          "use server";
          await executeAction({
            actionFn: async () => {
              await signIn("credentials", formData)
            },
          })
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
          autoComplete="current-password"
        />
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>

      <div className="text-center">
      <Button asChild variant="link">
        <Link href="/forgot-password">Forgot password</Link>
        </Button>
        <br />
        <Button asChild variant="link">
        <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;
