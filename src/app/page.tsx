import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  const role = session.user?.role // adjust based on your session shape
  
  // Log the role to see what value we're getting
  console.log("User role:", role);

  // Role-based redirection
  if (role === "ADMIN") {
    redirect("/admin");
  } else if (role === "CLIENT") {
    redirect("/client");
  } else if (role === "STAFF") {
    redirect("/client");
  } else {
    redirect("/unauthorized"); // or show fallback UI
  }

  // Optional fallback if redirection is skipped
  return (
    <div className="bg-gray-100 rounded-lg p-4 text-center mb-6">
      <p className="text-gray-600">Signed in as:</p>
      <p className="font-medium">{session!.user?.email}</p>
    </div>
  );
};

export default Page;
