"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar({ isOpen }) {
  const router = useRouter();
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
    <aside
      className={`bg-white shadow h-screen transition-all duration-300 flex flex-col items-center
        ${isOpen ? "w-64" : "hidden"}`}
    >
      {/* โลโก้ */}
      <div className="p-6 flex flex-col items-center">
        <Image
          src="/pheonix_logo.png"
          alt="Company Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* เมนู */}
      <nav className="flex flex-col w-full mt-6 gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
