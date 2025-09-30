"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Plus, Clock, CheckCircle, AlertCircle, Package, TrendingUp } from "lucide-react";

// ---------- TYPES ----------
type Repair = {
  id: number;
  serialNumber: string;
  model: string;
  customer: string;
  status: string;
  date: string;
};

type User = {
  name: string;
  role: "MEMBER" | "SHOP" | "TECHNICIAN" | "ADMIN";
  avatar: string;
};

// ---------- DASHBOARD CONTENT ----------
const DashboardPageContent = () => {
  const user: User = { name: "สมชาย ใจดี", role: "TECHNICIAN", avatar: "SC" };

  const statusCounts = {
    PENDING: 12,
    IN_PROGRESS: 8,
    COMPLETED: 25,
    WAITING_PARTS: 4,
    SHIPPED: 15,
  };

  const recentRepairs: Repair[] = [
    { id: 1, serialNumber: "HP001234", model: "HP LaserJet Pro", customer: "บริษัท ABC", status: "IN_PROGRESS", date: "2024-01-15" },
    { id: 2, serialNumber: "CN002456", model: "Canon Pixma", customer: "คุณสมศรี", status: "PENDING", date: "2024-01-14" },
    { id: 3, serialNumber: "EP003789", model: "Epson EcoTank", customer: "ร้าน XYZ", status: "COMPLETED", date: "2024-01-13" },
  ];

  // ---------- STATUS COLORS ----------
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-gradient-to-r from-orange-400 to-amber-500 text-white";
      case "IN_PROGRESS": return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "COMPLETED": return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white";
      case "WAITING_PARTS": return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white";
      case "SHIPPED": return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white";
      default: return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <AlertCircle className="w-6 h-6" />;
      case "IN_PROGRESS": return <Clock className="w-6 h-6" />;
      case "COMPLETED": return <CheckCircle className="w-6 h-6" />;
      case "WAITING_PARTS": return <Package className="w-6 h-6" />;
      case "SHIPPED": return <TrendingUp className="w-6 h-6" />;
      default: return <AlertCircle className="w-6 h-6" />;
    }
  };

  const getCardGradient = (status: string) => {
    switch (status) {
      case "PENDING": return "from-orange-50 via-amber-50 to-yellow-50 border-orange-200";
      case "IN_PROGRESS": return "from-blue-50 via-indigo-50 to-blue-100 border-blue-200";
      case "COMPLETED": return "from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200";
      case "WAITING_PARTS": return "from-purple-50 via-indigo-50 to-purple-100 border-purple-200";
      case "SHIPPED": return "from-cyan-50 via-blue-50 to-indigo-50 border-cyan-200";
      default: return "from-gray-50 via-slate-50 to-gray-100 border-gray-200";
    }
  };

  const quickActions = [
    { 
      title: "งานซ่อมของฉัน", 
      icon: <Wrench className="w-6 h-6" />, 
      href: "/dashboard/repair-details", 
      gradient: "from-blue-500 to-blue-600",
      description: "ดูงานที่แจ้งซ่อม"
    },
    { 
      title: "แจ้งซ่อมใหม่", 
      icon: <Plus className="w-6 h-6" />, 
      href: "/dashboard/create-repair", 
      gradient: "from-cyan-500 to-teal-600",
      description: "สร้างรายการซ่อมใหม่"
    },
  ];

  const statusLabels = {
    PENDING: "รอดำเนินการ",
    IN_PROGRESS: "กำลังซ่อม",
    COMPLETED: "เสร็จสิ้น",
    WAITING_PARTS: "รออะไหล่",
    SHIPPED: "จัดส่งแล้ว"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Pattern (static) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-500"></div>
      </div>

      <div className="relative z-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Card
              key={status}
              className={`bg-gradient-to-br ${getCardGradient(status)} backdrop-blur-sm rounded-2xl border-2`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{statusLabels[status as keyof typeof statusLabels]}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                      {count}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6">
            การดำเนินการด่วน
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className={`p-8 rounded-2xl shadow-xl flex items-center space-x-6 bg-gradient-to-r ${action.gradient} text-white`}
              >
                <div className="p-4 bg-white/20 rounded-2xl">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">{action.title}</h4>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </div>
                <div className="text-white/60">→</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Repairs */}
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6">
            งานซ่อมล่าสุด
          </h3>
          <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <tr>
                      <th className="py-6 px-6 font-semibold">Serial Number</th>
                      <th className="py-6 px-6 font-semibold">รุ่น</th>
                      <th className="py-6 px-6 font-semibold">ลูกค้า</th>
                      <th className="py-6 px-6 font-semibold">สถานะ</th>
                      <th className="py-6 px-6 font-semibold">วันที่</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRepairs.map((repair) => (
                      <tr key={repair.id} className="border-b border-blue-100">
                        <td className="py-6 px-6 font-medium text-slate-700">
                          {repair.serialNumber}
                        </td>
                        <td className="py-6 px-6 text-slate-600">{repair.model}</td>
                        <td className="py-6 px-6 text-slate-600">{repair.customer}</td>
                        <td className="py-6 px-6">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(repair.status)}`}>
                            {statusLabels[repair.status as keyof typeof statusLabels]}
                          </span>
                        </td>
                        <td className="py-6 px-6 text-slate-600">
                          {new Date(repair.date).toLocaleDateString("th-TH")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 text-right">
                <Link 
                  href="/dashboard/repair-details" 
                  className="inline-flex items-center space-x-2 text-blue-600 font-semibold"
                >
                  <span>ดูงานซ่อมทั้งหมด</span>
                  <span>→</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => (
  <DashboardPageContent />
);

export default DashboardPage;