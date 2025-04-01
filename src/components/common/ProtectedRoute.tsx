
"use client";
import { useAuthStore } from "@/app/hooks/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, checkAuth } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !checkAuth()) {
            router.push("/auth/login");
        }
    }, [isMounted, checkAuth, router]);

    if (!isMounted || !isAuthenticated) return null;

    return <>{children}</>;
};

export default ProtectedRoute;
