"use client";

import { Home, Info, PenSquare, Trophy, User } from "lucide-react";
import Image from "next/image";
import Logo from "../../assets/Innisfree-Logo.svg";
import { useRouter, usePathname } from "next/navigation"; 

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Information", url: "#", icon: Info },
  { title: "Post", url: "#", icon: PenSquare },
  { title: "Leaderboard", url: "#", icon: Trophy },
  { title: "Profile", url: "/client/profile", icon: User },
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
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-md rounded-md h-screen p-4 fixed top-0 left-0">
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
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around items-center p-2 md:hidden z-50">
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
