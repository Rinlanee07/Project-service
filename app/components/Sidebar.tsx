"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Wrench, FileText, Clock, Truck, Check, LucideIcon } from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "สร้างงานซ่อม", path: "/dashboard/create-repair", icon: Wrench },
    { name: "รายละเอียดงานซ่อม", path: "/dashboard/repair-details", icon: FileText },
    { name: "ติดตามสถานะ", path: "/dashboard/status-tracking", icon: Clock },
    { name: "การจัดส่ง", path: "/dashboard/shipping", icon: Truck },
    { name: "ปิดงานซ่อม", path: "/dashboard/close-repair", icon: Check },
  ];

  return (
    <aside className="w-64 p-4 border-r border-blue-800/30 bg-gradient-to-b from-slate-950/95 to-blue-950/95 backdrop-blur-xl shadow-lg z-30 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 p-2">
        <div className="p-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-[0_0_10px_rgba(45,212,191,0.3)]">
          <img 
            src="/pheonix_logo.png" 
            alt="Logo" 
            className="h-16 w-auto filter brightness-150" 
            onError={(e) => {
              // ถ้า logo โหลดไม่ได้ แสดง placeholder แทน
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 9.73 9 11 5.16-1.27 9-5.45 9-11V7l-10-5z'/%3E%3C/svg%3E";
            }}
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-250 group relative",
                isActive
                  ? "bg-gradient-to-r from-teal-600/20 to-cyan-600/20 text-cyan-300 border-l-2 border-cyan-400 shadow-[0_0_12px_rgba(45,212,191,0.15)]"
                  : "text-slate-300 hover:text-cyan-300 hover:bg-blue-900/30 hover:translate-x-1"
              )}
            >
              <IconComponent 
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-300"
                )} 
              />
              <span className={cn(
                "font-medium transition-all",
                isActive ? "text-cyan-300" : "text-slate-300"
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;