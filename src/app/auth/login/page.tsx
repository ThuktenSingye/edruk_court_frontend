"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginStore } from "../../hooks/useLoginStore";
import LoginForm from "@/components/auth/Login";

const LoginPage: React.FC = () => {
    const router = useRouter();
    const { email, password, loading, setUser, login, isAuthenticated } = useLoginStore();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/pages/registrar/dashboard");
        }
    }, [isAuthenticated, router]);

    return (
        <LoginForm
            email={email}
            password={password}
            buttonDisabled={!email || !password || loading}
            loading={loading}
            setUser={setUser}
            onLogin={login}
        />
    );
};

export default LoginPage;