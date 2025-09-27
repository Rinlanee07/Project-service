"use client";

import { ReactNode, useState } from "react"; // ✅ import ReactNode
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode; // type ของ children
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
