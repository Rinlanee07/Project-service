"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header user={user} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
