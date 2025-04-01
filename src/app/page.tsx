"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./hooks/useAuthStore";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push("/pages/dashboard");
    }
  }, [isAuthenticated, router]);

  return null;
}
