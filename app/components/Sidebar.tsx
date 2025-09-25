"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "สร้างงานซ่อม", path: "/dashboard/create-repair" },
    { name: "รายละเอียดงานซ่อม", path: "/dashboard/repair-details" },
    { name: "ติดตามสถานะ", path: "/dashboard/status-tracking" },
    { name: "การจัดส่ง", path: "/dashboard/shipping" },
    { name: "ปิดงานซ่อม", path: "/dashboard/close-repair" },
  ];

  return (
    <aside className="w-64 p-4 border-r border-border">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "px-2 py-1 rounded transition-colors",
              pathname === item.path ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
