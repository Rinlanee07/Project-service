"use client";

import { useState } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header({ user, toggleSidebar }) {
  const router = useRouter();

  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center h-20">
    {/* ซ้าย: โลโก้ + toggle sidebar */}
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleSidebar}
        className="text-black text-2xl focus:outline-none"
        title="Toggle Sidebar"
      >
        <FiMenu />
      </button>

      <div className="text-black font-bold text-xl flex items-center">
        <img
          src="/pheonix_logo.png"
          alt="Company Logo"
          className="inline w-8 h-8 mr-2"
        />
        PrinterFix
      </div>
    </div>

    {/* ขวา: ชื่อผู้ใช้ + ปุ่ม logout */}
    <div className="flex items-center space-x-6">
      <span className="text-black font-medium text-lg">
        สวัสดี, {user.name}
      </span>
      <button
        onClick={() => {
          signOut({ redirect: false });
          router.push("/signin");
        }}
        className="text-black text-2xl hover:text-red-600"
        title="ออกจากระบบ"
      >
        <FiLogOut />
      </button>
    </div>
  </header>
  );
}
