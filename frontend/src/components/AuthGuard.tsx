"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { tokenStorage } from "@/lib/tokenStorage";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!tokenStorage.get()) {
      router.replace("/login");
    }
  }, [router]);

  if (!tokenStorage.get()) {
    return null;
  }

  return <>{children}</>;
}
