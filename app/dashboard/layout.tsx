// app/dashboard/layout.tsx

// ตรวจสอบเส้นทางการ import ให้ถูกต้องตามที่ตั้งไว้ในโปรเจกต์ของคุณ
import DashboardLayout from "@/components/DashboardLayout"; 
import { ReactNode } from "react";

// นี่คือ Layout Component ที่ Next.js App Router ต้องการ
export default function Layout({ children }: { children: ReactNode }) {
  // เรียกใช้ DashboardLayout ที่คุณออกแบบไว้
  return <DashboardLayout>{children}</DashboardLayout>;
}