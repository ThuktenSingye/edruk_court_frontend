'use client';
import React from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import SignupForm from '@/components/auth/Signup';

interface UserStore {
    email: string;
    password: string;
    loading: boolean;
    buttonDisabled: boolean;
    setUser: (key: "email" | "password", value: string) => void;
    setLoading: (loading: boolean) => void;
    validateForm: () => void;
}

const useUserStore = create<UserStore>((set, get) => ({
    email: "",
    password: "",
    loading: false,
    buttonDisabled: true,

    setUser: (key, value) => {
        set(state => ({ ...state, [key]: value }), false);  // Avoid unnecessary re-renders
        setTimeout(() => get().validateForm(), 0);  // Ensure validation runs after state update
    },

    setLoading: (loading) => set({ loading }),

    validateForm: () => {
        const { email, password } = get();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
        const isEmailValid = emailRegex.test(email.trim());
        const isPasswordValid = password.trim().length >= 6;

        set({ buttonDisabled: !(isEmailValid && isPasswordValid) });
    },
}));

export default function SignupPage() {
    const router = useRouter();
    const { email, password, buttonDisabled, loading, setUser, setLoading } = useUserStore();

    const onSignup = async () => {
        if (buttonDisabled) return;

        try {
            setLoading(true);

            const requestBody = {
                email: email.trim(), // Adjusted to match potential server expectations
                password: password.trim(),
            };

            console.log("🔵 Request Body Sent to API:", JSON.stringify(requestBody, null, 2));

            const response = await axios.post(
                "https://edruk-court-api.onrender.com/api/v1/auth",
                requestBody,
                {
                    timeout: 100000,  // Reduced timeout to avoid hanging requests
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            toast.success("Signup successful! Check your email for verification.");
            await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay
            router.push('/auth/verifyemail');

        } catch (error: any) {
            console.error("🔴 Full API Error:", error);

            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    toast.error("Signup request timed out. Please try again.");
                } else if (error.response) {
                    console.error("🔴 API Response Status:", error.response.status);
                    console.error("🔴 API Response Data:", error.response.data);

                    if (error.response.status === 422) {
                        toast.error(error.response.data?.message || "Invalid email or password format. Please ensure your email is valid and your password is at least 6 characters long.");
                    } else if (error.response.status >= 500) {
                        toast.error("Server error. Please try again later.");
                    } else {
                        toast.error(error.response.data?.message || "Signup failed. Please try again.");
                    }
                } else {
                    toast.error("Network error. Please check your connection.");
                }
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white">
            <SignupForm
                email={email}
                password={password}
                buttonDisabled={buttonDisabled}
                loading={loading}
                setUser={setUser}
                onSignup={onSignup}
            />
        </div>
    );
}
