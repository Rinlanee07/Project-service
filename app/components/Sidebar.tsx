"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Wrench, FileText, Clock, Truck, Check } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "สร้างงานซ่อม", path: "/dashboard/create-repair", icon: Wrench },
    { name: "รายละเอียดงานซ่อม", path: "/dashboard/repair-details", icon: FileText },
    { name: "ติดตามสถานะ", path: "/dashboard/status-tracking", icon: Clock },
    { name: "การจัดส่ง", path: "/dashboard/shipping", icon: Truck },
    { name: "ปิดงานซ่อม", path: "/dashboard/close-repair", icon: Check },
  ];

  return (
    <aside className="w-64 p-4 border-r border-gray-200 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6 p-2">
        <img src="/pheonix_logo.png" alt="Logo" className="h-50" />
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
              pathname === item.path
                ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
