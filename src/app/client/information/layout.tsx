"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InformationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {/* Mini Menu Bar at the Top */}
      <nav className="flex justify-center space-x-6 p-4 bg-transparent">
        {[
          { name: "Our Products", href: "/client/information/product" },
          { name: "Beauty Info", href: "/client/information/beauty-info" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-black text-lg font-medium px-4 py-2 rounded-md transition-colors hover:bg-gray-200 ${
              pathname === item.href ? "text-green-600 font-semibold" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
