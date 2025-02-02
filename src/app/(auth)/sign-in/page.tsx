
import { auth} from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/sign-in";

type RoleRedirectMap = {
  [key: string]: string;
};

const roleRedirects: RoleRedirectMap = {
  CLIENT: "/client",
  ADMIN: "/admin",
  STAFF: "/staff",
};

const Page = async () => {

  const session = await auth();
  if(session){
    if (session?.user?.role) {
      const redirectPath = roleRedirects[session.user.role] || "/";
      console.log(`User authenticated as ${session.user.role}`);
      redirect(redirectPath);
    }
  }
  
  console.log("session", session);
  return (
    <div>
      <SignInForm />
    </div>
  );
};
export default Page;
