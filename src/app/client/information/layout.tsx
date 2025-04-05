"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

// Loading component for the content
function LoadingContent() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

const menuItems = [
  { name: "Our Products", href: "/client/information/product" },
  { name: "Beauty Info", href: "/client/information/beauty-info" },
];

export default function InformationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {/* Mini Menu Bar at the Top */}
      <nav className="flex justify-center space-x-6 p-4 bg-transparent">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            prefetch={true}
            className={`text-black text-lg font-medium px-4 py-2 rounded-md transition-colors hover:bg-gray-200 ${
              pathname === item.href ? "text-green-600 font-semibold" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Page Content */}
      <Suspense fallback={<LoadingContent />}>
        <main className="p-6">{children}</main>
      </Suspense>
    </div>
  );
}
