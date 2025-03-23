"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AiFillAppstore, AiFillFile, AiFillFolderOpen } from "react-icons/ai";
import { FaCalendarAlt, FaFileInvoice, FaUserCircle, FaRegFileAlt } from "react-icons/fa";
import { useEffect } from "react";
import Image from "next/image";

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", path: "/pages/judge/dashboard", icon: <AiFillAppstore /> },
        { name: "Cases", path: "/pages/judge/case", icon: <AiFillFile /> },
        { name: "Case Docs", path: "/pages/judge/casedocs", icon: <AiFillFolderOpen /> },
        { name: "Calendar", path: "/pages/judge/calendar", icon: <FaCalendarAlt /> },
        { name: "Order", path: "/pages/judge/courtorder", icon: <FaRegFileAlt /> },
        { name: "Report", path: "/pages/judge/report", icon: <FaFileInvoice /> },
    ];

    useEffect(() => {
        menuItems.forEach((item) => router.prefetch(item.path));
    }, [router]);

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="fixed flex flex-shrink-0 overflow-hidden">
            <div className="w-64 h-screen relative bg-green-800 text-white flex flex-col">

                <div className="flex flex-col items-center mb-6">
                    <img src="/logo.png" alt="Royal Court of Justice" className="w-16 h-16 rounded-full" />
                    <h2 className="mt-2 font-semibold text-lg text-center">Royal Court of Justice</h2>
                    <hr className="w-full border-gray-500 my-4" />
                </div>
                <div className="absolute  bg-center opacity-10 -top-20 -left-20">
                    <img src="/bg_image.png" width={200} height={200} alt="bg_image" />
                </div>

                <div className="absolute bg-center opacity-10 -bottom-20 -right-20 ">
                    <Image src="/bg_image.png" width={200} height={200} alt="bg_image" />
                </div>

                <nav className="flex flex-col space-y-4 overflow-y-auto h-full">
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
