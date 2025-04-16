"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginStore } from "../../hooks/useLoginStore";
import LoginForm from "@/components/auth/Login";

const LoginPage: React.FC = () => {
    const router = useRouter();
    const {
        email,
        password,
        loading,
        setUser,
        login,
        isAuthenticated,
        checkAuth
    } = useLoginStore();

    // Check existing auth on initial load
    useEffect(() => {
        const isAuth = checkAuth();
        if (isAuth) {
            router.push("/pages/dashboard");
        }
    }, [checkAuth, router]);

    // Handle login and redirect
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/pages/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleLogin = async () => {
        try {
            await login();
        } catch (error) {
            // You can add error handling UI here if needed
            console.error("Login error:", error);
        }
    };

    return (
        <LoginForm
            email={email}
            password={password}
            buttonDisabled={!email || !password || loading}
            loading={loading}
            setUser={setUser}
            onLogin={handleLogin}
        />
    );
};

export default LoginPage;