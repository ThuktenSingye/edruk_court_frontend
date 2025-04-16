"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AiFillAppstore, AiFillFile } from "react-icons/ai";
import { FaCalendarAlt, FaFileInvoice, FaRegFileAlt, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { userRole, getUserRole, checkAuth, logout } = useLoginStore();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    // Ensure auth state is checked when component mounts
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Get the current role with fallbacks
    const currentRole = userRole || getUserRole() || (typeof window !== 'undefined' ? localStorage.getItem("userRole") : null);

    const menuItems = [
        { name: "Dashboard", path: "/pages/dashboard", icon: <AiFillAppstore /> },
        {
            name: "Cases",
            path: `/pages/users/case?role=${currentRole}`,
            icon: <AiFillFile />
        },
        { name: "Calendar", path: "/pages/users/calendar", icon: <FaCalendarAlt /> },
        { name: "Order", path: "/pages/users/courtorder", icon: <FaRegFileAlt /> },
        { name: "Report", path: "/pages/users/report", icon: <FaFileInvoice /> },
    ];

    if (currentRole === "Registrar") {
        menuItems.push({ name: "Bench", path: "/pages/users/bench", icon: <FaFileInvoice /> });
    }

    useEffect(() => {
        menuItems.forEach((item) => router.prefetch(item.path));
    }, [router, currentRole]);

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleLogout = () => {
        logout();
        setIsLogoutDialogOpen(false);
        router.push("/");
    };

    return (
        <div className="fixed flex flex-shrink-0 overflow-hidden">
            <div className="w-64 h-screen relative bg-green-800 text-white flex flex-col">
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo.png" alt="Royal Court of Justice" className="w-16 h-16 rounded-full" />
                    <h2 className="mt-2 font-semibold text-lg text-center">Royal Court of Justice</h2>
                    <hr className="w-full border-gray-500 my-4" />
                </div>

                <div className="absolute bg-center opacity-10 -top-20 -left-20">
                    <img src="/bg_image.png" width={200} height={200} alt="bg_image" />
                </div>

                <div className="absolute bg-center opacity-10 -bottom-20 -right-20">
                    <Image src="/bg_image.png" width={200} height={200} alt="bg_image" />
                </div>

                <nav className="flex flex-col space-y-4 overflow-y-auto h-full">
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-md ${pathname.startsWith(item.path.split('?')[0]) ? "bg-gray-300 text-black" : "hover:bg-gray-500"} cursor-pointer`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.name}</span>
                        </div>
                    ))}

                    {/* Logout Button with Confirmation Dialog */}
                    <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                        <DialogTrigger asChild>
                            <div className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-500 cursor-pointer mt-auto mb-4">
                                <span className="text-xl"><FaSignOutAlt /></span>
                                <span>Logout</span>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Logout</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to logout from the system?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsLogoutDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="bg-primary-normal hover:bg-primary-light" // Change to blue color
                                >
                                    Logout
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;