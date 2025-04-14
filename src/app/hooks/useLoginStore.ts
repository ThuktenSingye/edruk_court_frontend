import { create } from "zustand";
import axios from "axios";

interface LoginState {
    email: string;
    password: string;
    loading: boolean;
    isAuthenticated: boolean;
    setUser: (key: "email" | "password", value: string) => void;
    login: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
    email: "",
    password: "",
    loading: false,
    isAuthenticated: false,

    setUser: (key, value) => set((state) => ({ ...state, [key]: value })),

    login: async () => {
        const { email, password } = get();
        if (!email || !password) return;

        set({ loading: true });

        try {
            const response = await axios.post("http://nganglam.lvh.me:3001/api/v1/auth/sign_in", {
                user: { email, password }
            });

            if (response.data.status === 200) {
                set({ isAuthenticated: true });
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            set({ loading: false });
        }
    },
}));