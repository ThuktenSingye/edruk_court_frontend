import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import the icons
import Image from "next/image";

interface LoginFormProps {
    email: string;
    password: string;
    buttonDisabled: boolean;
    loading: boolean;
    setUser: (key: "email" | "password", value: string) => void;
    onLogin: () => void;
}

const pageVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
};

const LoginForm: React.FC<LoginFormProps> = ({ email, password, buttonDisabled, loading, setUser, onLogin }) => {
    const [showPassword, setShowPassword] = useState(false); // State for showing password

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}
            className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-green-900">

            <Card className="h-full w-full max-w-8xl flex flex-col md:flex-row shadow-xl rounded-lg overflow-hidden">

                {/* Left Side: Form */}
                <CardContent className="w-full md:w-1/2 bg-white p-6 md:p-8 flex flex-col justify-center items-center h-full">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900">KUZUZANGPO</h1>
                    <p className="text-gray-600 mt-4 md:mt-6 text-sm md:text-base text-center">
                        Welcome back! Please enter your details.
                    </p>

                    <div className="w-full max-w-sm mt-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <Input id="email" value={email} onChange={(e) => setUser("email", e.target.value)}
                                placeholder="Enter your email" type="email"
                                className="mt-1 rounded-lg border-gray-300 focus:border-green-500" />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <Input
                                id="password"
                                value={password}
                                onChange={(e) => setUser("password", e.target.value)}
                                placeholder="**********"
                                type={showPassword ? "text" : "password"}
                                className="mt-1 rounded-lg border-gray-300 focus:border-green-500 h-10" // Added fixed height
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-11 transform -translate-y-1/2 right-3 flex items-center text-gray-500"
                            >
                                {showPassword ? <FiEye /> : <FiEyeOff />}
                            </button>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <div className="flex items-center">
                                <Checkbox id="remember-me" />
                                <label htmlFor="remember-me" className="ml-2">Remember me</label>
                            </div>
                            <Link href="#" className="hover:underline text-primary-normal">Forgot password?</Link>
                        </div>

                        <Button onClick={onLogin} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
                            disabled={buttonDisabled}>
                            {loading ? "Processing..." : "Sign in"}
                        </Button>
                    </div>
                </CardContent>

                <CardContent className="w-full md:w-2/3 lg:w-3/5 bg-gradient-to-br from-green-700 to-green-900 flex flex-col justify-center items-center text-white p-7 md:p-10 rounded-none sm:rounded-t-full md:rounded-none md:rounded-l-full lg:rounded-b-full">
                    <Image src="/logo.png" alt="Logo" width={200} height={200} className="mb-5" />

                    <h2 className="text-3xl md:text-5xl font-bold text-center">eDruk Court</h2>

                </CardContent>

            </Card>
        </motion.div>
    );
};
export default LoginForm;