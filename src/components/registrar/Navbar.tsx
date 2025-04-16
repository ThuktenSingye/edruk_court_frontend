import { Switch } from "@/components/ui/switch";
import { Bell, UserCircle } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="flex-1 z-100">
            <div className="h-[65px] bg-white flex flex-row justify-between items-center p-7">
                <div>
                    <h3 className="font-heading font-bold"></h3>
                </div>
                <div className="font-bold md:text-xl sm:text-sm">Phuentsoling Dungkhag Court</div>
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
