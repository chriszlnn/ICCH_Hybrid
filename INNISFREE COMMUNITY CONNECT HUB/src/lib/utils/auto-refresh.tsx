"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AutoRefreshOnRouteChange() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.refresh(); // Refresh when the pathname changes
  }, [pathname]);

  return null;
}
