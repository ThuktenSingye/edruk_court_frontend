"use client";
import { create } from "zustand";
import axios from "axios";

interface AuthState {
    email: string;
    password: string;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    userRole: string | null;
    setUser: (key: "email" | "password", value: string) => void;
    setToken: (token: string) => void;
    setUserRole: (role: string) => void;
    login: () => Promise<void>;
    logout: () => void;
    checkAuth: () => boolean;
    getUserRole: () => string | null;
}

const initializeAuthState = () => {
    if (typeof window === "undefined") {
        return {
            token: null,
            isAuthenticated: false,
            userRole: null,
        };
    }

    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    return {
        token,
        isAuthenticated: !!token,
        userRole,
    };
};

const { token, isAuthenticated, userRole } = initializeAuthState();

export const useLoginStore = create<AuthState>((set, get) => ({
    email: "",
    password: "",
    token: null,
    isAuthenticated: false,
    loading: false,
    userRole: null,

    setUser: (key, value) => set((state) => ({ ...state, [key]: value })),

    setToken: (token) => {
        if (typeof window !== "undefined") {
            console.log("Saving token to localStorage:", token);
            localStorage.setItem("authToken", token);
        } else {
            console.warn("No window object — this is likely running on the server");
        }
        set({ token, isAuthenticated: !!token });
    },

    setUserRole: (role) => {
        if (typeof window !== "undefined") {
            console.log("Saving role to localStorage:", role);
            localStorage.setItem("userRole", role);
        }
        set({ userRole: role });
    },

    login: async () => {
        const { email, password } = get();
        if (!email || !password) return;

        set({ loading: true });

        try {
            const response = await axios.post(
                "http://nganglam.lvh.me:3001/api/v1/auth/sign_in",
                { user: { email, password } }
            );

            const bodyToken = response.data.token;
            const authHeader = response.headers['authorization'];
            const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

            const token = headerToken || bodyToken;

            if (!token) {
                throw new Error("No token received");
            }

            const rolesArray = response.data.data?.roles || [];
            const role = rolesArray.length > 0 ? rolesArray[0] : null;

            set({ isAuthenticated: true, token, userRole: role, loading: false });

            if (typeof window !== "undefined") {
                localStorage.setItem("authToken", token);
                if (role) localStorage.setItem("userRole", role);

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error logging in:", error);
            set({ loading: false });
            throw error;
        }
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            delete axios.defaults.headers.common['Authorization'];
        }
        set({
            token: null,
            isAuthenticated: false,
            userRole: null,
            email: "",
            password: ""
        });
    },

    checkAuth: () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("authToken");
            const userRole = localStorage.getItem("userRole");

            if (token) {
                set({ token, isAuthenticated: true, userRole });
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return true;
            }
        }
        return false;
    },

    getUserRole: () => {
        return get().userRole;
    },
}));