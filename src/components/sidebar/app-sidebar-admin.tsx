"use client";

import { User, LogOut ,LayoutGrid, Gem, UsersRound, Sparkles} from "lucide-react";
import Image from "next/image";
import Logo from "../../assets/Innisfree-Logo.svg";
import { useRouter, usePathname } from "next/navigation"; 
import { signOut } from "next-auth/react";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutGrid },
  { title: "Beauty Information", url: "/admin/beautyInformation", icon: Gem },
  { title: "Products", url: "/admin/product", icon:  Sparkles },
  { title: "User", url: "/admin/user", icon: UsersRound },
  { title: "Profile", url: "/admin/profile", icon: User },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (url: string) => {
    if (pathname !== url) {
      router.push(url);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}

      <aside className="hidden md:flex md:flex-col w-64 bg-teal-50 shadow-md rounded-md h-screen p-4 fixed top-0 left-0 justify-between">
        <div>
          <Image
            src={Logo}
            alt="Logo"
            width={150}
            height={128}
            className="mx-auto rounded-lg"
          />
          <nav className="flex flex-col gap-2 mt-8">
            {items.map((item) => (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.url)}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                  pathname === item.url
                    ? "bg-[#12B560] text-white"
                    : "hover:bg-[#12B560] hover:text-white"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-4 p-3 mt-4 bg-white text-black rounded-lg hover:bg-[#12B560] hover:text-white transition-all duration-300"
        >
          <LogOut className="w-6 h-6" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}

      <nav className="fixed bottom-0 left-0 right-0 bg-teal-50 shadow-md flex justify-around items-center p-2 md:hidden z-50">

        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => handleNavigation(item.url)}
            className={`flex justify-center items-center w-full p-2 rounded-lg transition duration-300 ${
              pathname === item.url
                ? "bg-[#12B560] text-white"
                : "hover:bg-[#12B560] hover:text-white"
            }`}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </nav>
    </>
  );
}
