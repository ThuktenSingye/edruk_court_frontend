/** @format */

import { Switch } from "@/components/ui/switch";
import { Bell, UserCircle } from "lucide-react";
import Link from "next/link";
import { useLoginStore } from "@/app/hooks/useLoginStore";

export default function Navbar() {
  const courtName = useLoginStore((state) => state.court_name);
  return (
    <div className="z-100 w-full">
      <div className="h-[65px] bg-white flex flex-row justify-between items-center p-7">
        <div className="font-bold md:text-xl sm:text-sm">{courtName} Court</div>
        <div className="flex flex-row items-center gap-4">
          <div>
            <p className="flex flex-row gap-4 items-center">
              <span>Eng</span>
              <Switch />
              <span>DZO</span>
            </p>
          </div>

          <div className="cursor-pointer">
            <Link href="/pages/users/notification">
              <Bell className="w-6 h-6 text-gray-700" />
            </Link>
          </div>
          <div className="cursor-pointer">
            <Link href="/pages/users/profile">
              <UserCircle className="w-8 h-8 text-gray-700" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
