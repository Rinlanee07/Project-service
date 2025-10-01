"use client";

import { Bell, User, Settings, Home, Wrench, FileText, Clock, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";

// Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const menuItems = [
  { name: "Home", path: "/dashboard", icon: Home },
  { name: "Create", path: "/dashboard/create-repair", icon: Wrench },
  { name: "Details", path: "/dashboard/repair-details", icon: FileText },
  { name: "Track", path: "/dashboard/status-tracking", icon: Clock },
  { name: "Delivery", path: "/dashboard/shipping", icon: Truck },
  { name: "Complete", path: "/dashboard/close-repair", icon: Check },
];

const Header = () => {
  const pathname = usePathname();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  return (
    <>
      {/* ✅ Dialog อยู่นอก DropdownMenu — ป้องกันการหายเมื่อ Dropdown ปิด */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border border-blue-800/50 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️ ยืนยันการออกจากระบบ</span>
            </DialogTitle>
            <DialogDescription className="text-slate-300 mt-2">
              คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?  
              คุณจะต้องเข้าสู่ระบบอีกครั้งเพื่อใช้งานระบบซ่อมเครื่องพิมพ์
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3 pt-4">
          <Button
            variant="default"
            onClick={() => setLogoutDialogOpen(false)}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700"
          >
            ยกเลิก
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setLogoutDialogOpen(false);
              signOut({ callbackUrl: '/' });
            }}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            ออกจากระบบ
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="bg-gradient-to-r from-blue-900 to-slate-900 backdrop-blur-xl border-b border-blue-800 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center px-6 py-4 max-w-7xl mx-auto w-full">
          {/* Logo - ด้านซ้าย */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="p-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-[0_0_12px_rgba(45,212,191,0.3)]">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-cyan-300 hidden md:block">
              Printer Repair System
            </span>
          </div>

          {/* Navigation - อยู่ตรงกลาง */}
          <nav className="hidden md:flex items-center gap-1.5 mx-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "text-cyan-300 bg-blue-800/50 border border-blue-700 shadow-[0_0_8px_rgba(45,212,191,0.15)]"
                      : "text-slate-200 hover:text-cyan-300 hover:bg-blue-800/40"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive
                        ? "text-cyan-300"
                        : "text-slate-300 group-hover:text-cyan-300"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions (Notifications + User) - ด้านขวา */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-200 hover:bg-blue-800/50 hover:text-cyan-300"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-[0_0_8px_rgba(251,146,60,0.5)]">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 bg-slate-900/95 border border-blue-800/50 text-slate-200 shadow-xl shadow-cyan-900/20 backdrop-blur-lg"
              >
                <DropdownMenuLabel className="text-cyan-300 font-semibold">
                  การแจ้งเตือน
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-800/40" />
                <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-cyan-300">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">งานซ่อม #PR001 เสร็จสมบูรณ์</p>
                    <p className="text-xs text-slate-400">2 นาทีที่แล้ว</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-cyan-300">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">มีงานซ่อมใหม่</p>
                    <p className="text-xs text-slate-400">5 นาทีที่แล้ว</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-cyan-300">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">ข้อความจากลูกค้า</p>
                    <p className="text-xs text-slate-400">10 นาทีที่แล้ว</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-200 hover:bg-blue-800/50 hover:text-cyan-300"
                >
                  <Avatar className="h-9 w-9 border-2 border-cyan-500/50">
                    <AvatarImage src="/api/placeholder/36/36" />
                    <AvatarFallback className="bg-gradient-to-r from-teal-900/60 to-cyan-900/60 text-cyan-300 font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-cyan-400">เจ้าของร้าน</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-slate-900/95 border border-blue-800/50 text-slate-200 shadow-xl backdrop-blur-lg min-w-[200px]"
              >
                <DropdownMenuLabel className="text-cyan-300 font-semibold">
                  บัญชีของฉัน
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-800/40" />

                <DropdownMenuItem asChild className="focus:bg-blue-900/50 focus:text-cyan-300">
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-400" />
                    <span>โปรไฟล์</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-cyan-300 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-cyan-400" />
                  <span>การตั้งค่า</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-blue-800/40" />

                {/* ✅ เปิด Dialog โดยตรง ไม่ใช้ DialogTrigger */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault(); // ป้องกันการปิดเร็ว (optional แต่แนะนำ)
                    setLogoutDialogOpen(true);
                  }}
                  className="text-red-400 focus:text-red-400 focus:bg-blue-900/50 cursor-pointer"
                >
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;