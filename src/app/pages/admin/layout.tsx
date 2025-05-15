/** @format */

"use client";

import Sidebar from "../../../components/admin/SidebarAdmin";
import { Switch } from "@/components/ui/switch";
import { Bell, UserCircle } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 z-100">
        <div className="h-[65px] bg-white flex flex-row justify-between items-center p-7">
          <div>
            <h3 className="font-heading font-bold">Admin</h3>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div>
              <p className="flex flex-row gap-4 items-center">
                <span>Eng</span>
                <Switch />
                <span>DZO</span>
              </p>
            </div>

            <div className="cursor-pointer">
              <Bell className="w-6 h-6 text-gray-700" />
            </div>
            <div className="cursor-pointer">
              <Link href="/pages/admin/profile">
                <UserCircle className="w-8 h-8 text-gray-700" />
              </Link>
            </div>
          </div>
        </div>

        {/* Render the children here */}
        <main className="px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
