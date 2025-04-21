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
        checkAuth,
        userRole,
    } = useLoginStore();

    useEffect(() => {
        const isAuth = checkAuth();
        if (isAuth) {
            redirectUser();
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            redirectUser();
        }
    }, [isAuthenticated, userRole]);

    const redirectUser = () => {
        if (userRole === "Admin") {
            router.push("/pages/admin");
        } else {
            router.push("/pages/dashboard");
        }
    };

    const handleLogin = async () => {
        try {
            await login();
            // No need to push here — `useEffect` will handle the redirect
        } catch (error) {
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
