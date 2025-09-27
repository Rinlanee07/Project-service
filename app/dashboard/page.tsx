"use client";

import React, { ReactNode } from "react";
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
      case "PENDING": return "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-lg";
      case "IN_PROGRESS": return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg";
      case "COMPLETED": return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg";
      case "WAITING_PARTS": return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg";
      case "SHIPPED": return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg";
      default: return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg";
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
      case "PENDING": return "from-orange-50 via-amber-50 to-yellow-50 border-orange-200 hover:border-orange-300";
      case "IN_PROGRESS": return "from-blue-50 via-indigo-50 to-blue-100 border-blue-200 hover:border-blue-300";
      case "COMPLETED": return "from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200 hover:border-emerald-300";
      case "WAITING_PARTS": return "from-purple-50 via-indigo-50 to-purple-100 border-purple-200 hover:border-purple-300";
      case "SHIPPED": return "from-cyan-50 via-blue-50 to-indigo-50 border-cyan-200 hover:border-cyan-300";
      default: return "from-gray-50 via-slate-50 to-gray-100 border-gray-200 hover:border-gray-300";
    }
  };

  const quickActions = [
    { 
      title: "งานของฉัน", 
      icon: <Wrench className="w-6 h-6" />, 
      href: "/technician/jobs", 
      gradient: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      description: "ดูงานที่ได้รับมอบหมาย"
    },
    { 
      title: "แจ้งซ่อมใหม่", 
      icon: <Plus className="w-6 h-6" />, 
      href: "/repairs/new", 
      gradient: "from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700",
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
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-500 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Welcome Section with Enhanced Animation */}
        <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 transform transition-all duration-700 hover:shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg animate-bounce">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2 animate-fade-in">
                สวัสดี, {user.name.split(" ")[0]} 👋
              </h2>
              <p className="text-slate-600 text-lg animate-slide-up">ยินดีต้อนรับสู่แดชบอร์ดงานซ่อม</p>
            </div>
          </div>
        </div>

        {/* KPI Cards with Improved Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {Object.entries(statusCounts).map(([status, count], index) => (
            <Card
              key={status}
              className={`bg-gradient-to-br ${getCardGradient(status)} backdrop-blur-sm transition-all duration-500 cursor-pointer rounded-2xl border-2 hover:shadow-2xl transform hover:-translate-y-1`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl ${getStatusColor(status)} transform transition-all duration-300 hover:rotate-6`}>
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

        {/* Quick Actions with Enhanced Design */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6">
            การดำเนินการด่วน
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className={`group p-8 rounded-2xl shadow-xl transition-all duration-500 flex items-center space-x-6 bg-gradient-to-r ${action.gradient} text-white hover:shadow-2xl transform hover:-translate-y-2`}
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="p-4 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">{action.title}</h4>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </div>
                <div className="text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Repairs with Modern Table Design */}
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
                    {recentRepairs.map((repair, index) => (
                      <tr 
                        key={repair.id} 
                        className="border-b border-blue-100 hover:bg-blue-50/50 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="py-6 px-6 font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                          {repair.serialNumber}
                        </td>
                        <td className="py-6 px-6 text-slate-600">{repair.model}</td>
                        <td className="py-6 px-6 text-slate-600">{repair.customer}</td>
                        <td className="py-6 px-6">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(repair.status)} transform transition-all duration-300 hover:scale-105`}>
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
                  href="/repairs" 
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:translate-x-2 group"
                >
                  <span>ดูงานซ่อมทั้งหมด</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .grid > * {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

// ---------- EXPORT DASHBOARD PAGE ----------
const DashboardPage = () => (
  <DashboardLayout>
    <DashboardPageContent />
  </DashboardLayout>
);

export default DashboardPage;