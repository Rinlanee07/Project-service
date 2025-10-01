"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wrench, Menu, X, Rocket, ArrowRight
} from "lucide-react";
import { Sparkles } from "lucide-react";

// Import Forms จริงที่มี logic
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true); // true = Login, false = Register

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 text-white relative overflow-hidden">

      {/* Background World Map */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/80 to-indigo-950/90"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-slate-900 text-white border-b border-blue-800 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <Wrench className="h-8 w-8 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-2xl font-bold text-white">ORBIT</h1>
          </div>

          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-900"
            onClick={() => setIsLoginView(true)}
          >
            Login
          </Button>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-blue-800">
            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </header>

      {/* Main Content - Orbit Style */}
      <main className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12 relative z-10">

        {/* Left Side - Text */}
        <div className="lg:w-1/2 space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">ORBIT</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-lg">
            Welcome to the future of repair management. Track, assign, and complete repairs with ease. Designed for shops that want to scale smarter.
          </p>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-900"
            onClick={() => setIsLoginView(false)}
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Right Side - Login/Register Card */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            {/* Rocket Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <Rocket className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Toggle between Login and Register */}
            <div className="bg-white text-slate-800 rounded-2xl shadow-2xl p-8 border border-blue-100">
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
          </div>
        </div>

      </main>
    </div>
  );
}