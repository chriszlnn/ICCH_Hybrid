// src/app/client/profile/page.tsx
import   {ProfileContent} from "@/components/profile/profile-content-admin";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();
  const userEmail = session?.user?.email ?? "";

  return <ProfileContent userEmail={userEmail} />;
}
