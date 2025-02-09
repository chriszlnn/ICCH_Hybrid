
import { Button } from "@/components/ui/general/button";
import { Input } from "@/components/ui/general/input";
import { signIn } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import Link from "next/link";
import Logo from "../../assets/Innisfree-Logo-black.svg";
import Image from "next/image";






const SignInForm = async () => {
  

  return (
    <div className="min-h-screen flex items-center justify-center" >
    <div className="w-full max-w-sm p-10 mx-auto space-y-6 w-full max-w-md rounded-lg bg-white transition-all duration-300
          shadow-[0_0_0_1px_rgba(18,181,96,0.1)]
          hover:shadow-[0_0_20px_rgba(18,181,96,0.2)]
          focus-within:shadow-[0_0_20px_rgba(18,181,96,0.3)]">
      <Image src={Logo} alt="Logo" width={200} height={128} className="mx-auto rounded-lg"/>
      

      {/* Email/Password Sign In */}
      <form
        className="space-y-4 "
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
          style={{
            outline: 'none',
            boxShadow: 'none',
          }}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="current-password"
          style={{
            outline: 'none',
            boxShadow: 'none',
          }}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500 focus:bg-none autofill:!bg-green-100"
        />
        
        <Button className="w-full bg-[#12B560] hover:bg-[#12B560]/90
              transition-all duration-300
              shadow-[0_0_20px_rgba(18,181,96,0.3)]
              hover:shadow-[0_0_30px_rgba(18,181,96,0.5)]
              active:shadow-[0_0_40px_rgba(18,181,96,0.7)]" type="submit">
          Sign In
        </Button>
      </form>

      <div className="text-center">
      <Button asChild variant="link">
        <Link href="/email-forgot-password">Forgot password</Link>
        </Button>
        <br />
        <Button asChild variant="link">
        <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
        </Button>
      </div>
    </div>
    </div>
  );
};

export default SignInForm;
