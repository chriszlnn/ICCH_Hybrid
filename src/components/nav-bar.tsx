"use client";

import { useEffect, useState } from "react";
//import {SignOut} from "@/components/sign-out";
import { auth } from "@/lib/auth";
import Link from "next/link";
//import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await auth();
      if (session?.user) {
        setUser({ email: session.user.email, role: session.user.role });
      }
    };

    fetchSession();
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
      <Link href="/" className="text-2xl font-bold">
        MyApp
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/" className="hover:text-gray-400">Home</Link>
        
        {user?.role === "ADMIN" && (
          <Link href="/admin" className="hover:text-gray-400">Admin</Link>
        )}

    
          
      </div>
    </nav>
  );
};

export default Navbar;
