import { create } from "zustand";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
    checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isAuthenticated: false,

    setToken: (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("authToken", token);
        }
        set({ token, isAuthenticated: !!token });
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
            set({ token, isAuthenticated: !!token });
            return !!token;
        }
        return false;
    },
}));