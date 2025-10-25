// components/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Wrench, FileText, Clock, Truck, Check, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'สร้างงานซ่อม', path: '/dashboard/create-repair', icon: Wrench },
  { name: 'รายละเอียดงานซ่อม', path: '/dashboard/repair-details', icon: FileText },
  { name: 'ติดตามสถานะ', path: '/dashboard/status-tracking', icon: Clock },
  { name: 'การจัดส่ง', path: '/dashboard/shipping', icon: Truck },
  { name: 'ปิดงานซ่อม', path: '/dashboard/close-repair', icon: Check },
];

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string): boolean => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="fixed left-0 top-0 w-[72px] h-screen flex flex-col items-center py-4 border-r border-[#D9DEE8] bg-[#102A54] z-50">
      <Tooltip.Provider delayDuration={100}>
        <nav className="flex flex-col gap-4 mt-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);

            return (
              <Tooltip.Root key={item.path}>
                <Tooltip.Trigger asChild>
                  <Link
                    href={item.path}
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 relative',
                      active
                        ? 'bg-[#3FA9F5] text-white shadow-md'
                        : 'text-[#D9DEE8] hover:text-white hover:bg-[#0A2463]'
                    )}
                  >
                    <IconComponent className="w-5 h-5" />
                    {active && (
                      <div className="absolute right-0 w-1 h-1 rounded-full bg-white" />
                    )}
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="right"
                  align="center"
                  sideOffset={10}
                  className="px-3 py-2 text-xs font-medium text-[#1F1F1F] bg-white border border-[#D9DEE8] rounded-md shadow-lg z-50"
                >
                  {item.name}
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Root>
            );
          })}
        </nav>
      </Tooltip.Provider>
    </aside>
  );
};

export default Sidebar;
