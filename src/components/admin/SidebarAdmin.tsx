"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AiFillAppstore } from "react-icons/ai";
import { FaGavel, FaUserTie, FaCalendarAlt, FaPaperPlane, FaFileInvoice, FaUserCircle } from "react-icons/fa";
import { useEffect } from "react";

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { name: "Manage Court", path: "/pages/admin/court", icon: <AiFillAppstore /> },
        { name: "Manage Judge", path: "/pages/admin/judge", icon: <FaGavel /> },
        { name: "Manage Clerk", path: "/pages/admin/clerk", icon: <FaUserTie /> },
        { name: "Manage Registrar", path: "/pages/admin/registrar", icon: <FaCalendarAlt /> },
        { name: "Manage User", path: "/pages/admin/user", icon: <FaPaperPlane /> },
        { name: "Order", path: "/pages/admin/orders", icon: <FaFileInvoice /> },
        { name: "Profile", path: "/pages/admin/profile", icon: <FaUserCircle /> },
    ];

    // Prefetch all menu item routes
    useEffect(() => {
        menuItems.forEach((item) => router.prefetch(item.path));
    }, [router]);

    // Handle navigation
    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="fixed flex flex-shrink-0">
            <div className="w-64 h-screen relative bg-green-800 text-white flex flex-col">
                {/* Logo and Title */}
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo.png" alt="Royal Court of Justice" className="w-16 h-16 rounded-full" />
                    <h2 className="mt-2 font-semibold text-lg text-center">Royal Court of Justice</h2>
                    <hr className="w-full border-gray-500 my-4" />
                </div>

                {/* Navigation Links - Scrollable */}
                <nav className="flex flex-col space-y-3 overflow-y-auto h-full">
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-md ${pathname === item.path ? "bg-gray-300 text-black" : "hover:bg-gray-500"
                                } cursor-pointer`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.name}</span>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
