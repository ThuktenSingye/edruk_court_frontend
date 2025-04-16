import { create } from "zustand";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
    checkAuth: () => boolean;
    initializeAuth: () => void; // Added for initial load
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isAuthenticated: false,

    setToken: (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("authToken", token);
        }
        set({ token, isAuthenticated: true });
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
        }
        set({ token: null, isAuthenticated: false });
    },

    checkAuth: () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("authToken");
            const isAuthenticated = !!token;
            set({ token, isAuthenticated });
            return isAuthenticated;
        }
        return false;
    },

    initializeAuth: () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("authToken");
            if (token) {
                set({ token, isAuthenticated: true });
            }
        }
    },
}));