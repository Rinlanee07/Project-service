// components/DashboardLayout.tsx
'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 ml-[72px] text-[#1F1F1F]">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;