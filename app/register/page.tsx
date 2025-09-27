"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Wrench, Smartphone, Shield, Star, Menu, X, Sparkles, FileText, Target, Award 
} from "lucide-react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

const steps = [
  { icon: FileText, title: "Create Repair", description: "Register new repair request with detailed information" },
  { icon: Target, title: "Assign & Track", description: "Assign to technicians and track progress in real-time" },
  { icon: Wrench, title: "Update Status", description: "Technicians update repair status and communicate with customers" },
  { icon: Award, title: "Complete & Feedback", description: "Mark as complete and collect customer feedback" }
];

const testimonials = [
  { name: "Sarah Chen", role: "Shop Owner", company: "TechFix Pro", content: "RepairPro transformed our business. Customer satisfaction increased by 40% since we started using it.", avatar: "SC" },
  { name: "Mike Rodriguez", role: "Lead Technician", company: "Mobile Repair Hub", content: "The real-time tracking feature is amazing. Customers love knowing exactly where their repair stands.", avatar: "MR" },
  { name: "Jenny Kim", role: "Operations Manager", company: "QuickFix Solutions", content: "Our efficiency improved dramatically. We can now handle 3x more repairs with the same team size.", avatar: "JK" }
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">

      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Wrench className="absolute top-1/4 left-1/4 w-8 h-8 text-blue-400/20 animate-bounce delay-300" />
        <Smartphone className="absolute top-1/3 right-1/4 w-6 h-6 text-purple-400/20 animate-bounce delay-700" />
        <Shield className="absolute bottom-1/3 left-1/3 w-7 h-7 text-green-400/20 animate-bounce delay-1000" />
        <Star className="absolute bottom-1/4 right-1/3 w-5 h-5 text-yellow-400/20 animate-bounce delay-1500" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-slate-900 text-white border-b border-blue-800 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <Wrench className="h-8 w-8 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-2xl font-bold text-white">RepairPro</h1>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {["Features", "How it Works", "Testimonials", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-white hover:text-blue-300">{item}</a>
            ))}
            <Button variant="outline" onClick={() => setModalType("login")}>Login</Button>
            <Button onClick={() => setModalType("register")}>Get Started</Button>
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-blue-800">
            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6">
          Track Your Repairs,<br/>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
            Transform Your Business
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Professional repair management system that streamlines operations, delights customers, and grows your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => setModalType("register")}>
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" onClick={() => setModalType("login")}>
            Sign In
          </Button>
        </div>
      </section>

      {/* Modal Dialog */}
      <Dialog open={modalType !== null} onOpenChange={() => setModalType(null)}>
        <DialogContent className="max-w-md w-full rounded-xl p-6 mx-auto my-12 max-h-[80vh] overflow-y-auto shadow-xl">
          <DialogHeader>
            <DialogTitle>{modalType === "login" ? "Sign In" : "Get Started"}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {modalType === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Global CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient-x { animation: gradient-x 8s ease infinite; }
      `}</style>
    </div>
  );
}
