"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wrench, Menu, X, ArrowRight
} from "lucide-react";

// Import Forms จริงที่มี logic
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true); // true = Login, false = Register

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F] relative overflow-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A2463] text-white border-b border-[#D9DEE8] shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Wrench className="h-7 w-7 text-white" />
              <h1 className="text-xl font-bold">แจ้งซ่อมปริ้นเตอร์</h1>
            </div>
            <a href="mailto:it-support@company.com" className="text-sm text-[#3FA9F5] hover:underline hidden md:block">
              ติดต่อผู้ดูแลระบบ
            </a>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-[#102A54]">
            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12 relative z-10">

        {/* Left Side - Text */}
        <div className="lg:w-1/2 space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-[#0A2463]">ระบบแจ้งซ่อมปริ้นเตอร์</span>
          </h1>
          <p className="text-xl text-[#1F1F1F] max-w-lg">
            รายงานปัญหาปริ้นเตอร์ได้ทันที ติดตามสถานะการซ่อม และรับการแจ้งเตือนเมื่อซ่อมเสร็จ!
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-[#3FA9F5]">
              <ArrowRight className="h-4 w-4 text-[#3FA9F5]" />
              <span>แจ้งซ่อม</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[#3FA9F5]">
              <ArrowRight className="h-4 w-4 text-[#3FA9F5]" />
              <span>สนับสนุน</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Register Card */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            {/* ไอคอนซ่อมแซม (แทน Rocket) */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#3FA9F5] rounded-full flex items-center justify-center">
                <Wrench className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Toggle between Login and Register */}
            <div className="bg-white text-[#1F1F1F] rounded-2xl shadow-lg p-8 border border-[#D9DEE8]">
              {isLoginView ? (
                <LoginForm 
                  onSwitchToRegister={() => setIsLoginView(false)} 
                />
              ) : (
                <RegisterForm 
                  onSwitchToLogin={() => setIsLoginView(true)} 
                />
              )}
            </div>

            {/* Small hint below form */}
            <p className="mt-4 text-center text-[#1F1F1F] text-sm">
              {isLoginView ? "ยังไม่มีบัญชี? " : "มีบัญชีอยู่แล้ว? "}
              <button 
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-[#3FA9F5] hover:underline font-medium"
              >
                {isLoginView ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              </button>
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}