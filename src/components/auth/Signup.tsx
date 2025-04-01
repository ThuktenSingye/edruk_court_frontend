import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface SignupFormProps {
    email: string;
    password: string;
    buttonDisabled: boolean;
    loading: boolean;
    setUser: (key: "email" | "password", value: string) => void;
    onSignup: () => void;
}

const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
};

const SignupForm: React.FC<SignupFormProps> = ({ email, password, buttonDisabled, loading, setUser, onSignup }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}
            className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-green-900">

            <Card className="h-full w-full max-w-8xl flex flex-col-reverse md:flex-row shadow-xl rounded-lg overflow-hidden">

                {/* Left Side: Info Section (Sign In Redirect) */}
                <CardContent className="w-full md:w-2/3 lg:w-3/5 bg-gradient-to-br from-green-700 to-green-900 flex flex-col justify-center items-center text-white p-7 md:p-10 rounded-none sm:rounded-t-full md:rounded-none md:rounded-r-full lg:rounded-t-full">
                    <h2 className="text-3xl md:text-5xl font-bold text-center">eDruk Court</h2>
                    <p className="mt-4 text-sm md:text-lg max-w-md text-center">
                        Already have an account? Sign in now.
                    </p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="mt-6 text-primary-normal border-white">Sign In</Button>
                    </Link>
                </CardContent>

                {/* Right Side: Sign Up Form */}
                <CardContent className="w-full md:w-1/2 bg-white p-6 md:p-8 flex flex-col justify-center items-center h-full">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900">SIGN UP</h1>
                    <p className="text-gray-600 mt-4 md:mt-6 text-sm md:text-base text-center">
                        Create your account by entering your details.
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
                                className="mt-1 rounded-lg border-gray-300 focus:border-green-500 h-10"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-11 transform -translate-y-1/2 right-3 flex items-center text-gray-500"
                            >
                                {showPassword ? <FiEye /> : <FiEyeOff />}
                            </button>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <Checkbox id="terms" />
                            <label htmlFor="terms" className="ml-2">I agree to the <Link href="#" className="hover:underline text-green-600">terms and conditions</Link></label>
                        </div>

                        <Button
                            onClick={!buttonDisabled ? onSignup : undefined}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md mt-4"
                            disabled={buttonDisabled}
                        >
                            {loading ? "Processing..." : "Sign Up"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SignupForm;
