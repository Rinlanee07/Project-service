// components/Header.tsx
'use client';

import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ProfileData } from 'types/profile';

const Header = () => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load user data.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Network error.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const initials = user
    ? user.name
        .split(' ')
        .filter(part => part.length > 0)
        .map(part => part[0].toUpperCase())
        .join('')
    : 'JD';

  return (
    <>
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-[#D9DEE8] text-[#1F1F1F]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              ⚠️ ยืนยันการออกจากระบบ
            </DialogTitle>
            <DialogDescription className="text-[#1F1F1F]/80 mt-2">
              คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?  
              คุณจะต้องเข้าสู่ระบบอีกครั้งเพื่อใช้งานระบบซ่อมเครื่องพิมพ์
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="flex-1 border-[#D9DEE8] text-[#1F1F1F] hover:bg-gray-100"
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setLogoutDialogOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              ออกจากระบบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="bg-[#0A2463] backdrop-blur-xl border-b border-[#D9DEE8] sticky top-0 z-50 shadow-md">
        <div className="flex items-center px-6 py-3 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="p-1.5 bg-[#3FA9F5] rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-white hidden md:block">
              Printer Repair System
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-white hover:bg-[#102A54]/30 hover:text-[#3FA9F5]"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#3FA9F5] text-white border-0">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 bg-white border border-[#D9DEE8] text-[#1F1F1F] shadow-lg"
              >
                <DropdownMenuLabel className="font-semibold text-[#0A2463]">
                  การแจ้งเตือน
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#D9DEE8]" />
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">งานซ่อม #PR001 เสร็จสมบูรณ์</p>
                    <p className="text-xs text-gray-500">2 นาทีที่แล้ว</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">มีงานซ่อมใหม่</p>
                    <p className="text-xs text-gray-500">5 นาทีที่แล้ว</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">ข้อความจากลูกค้า</p>
                    <p className="text-xs text-gray-500">10 นาทีที่แล้ว</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-[#102A54]/30 hover:text-[#3FA9F5]"
                >
                  <Avatar className="h-9 w-9 border-2 border-[#3FA9F5]/50">
                    <AvatarImage src={user?.avatar || '/api/placeholder/36/36'} />
                    <AvatarFallback className="bg-[#102A54] text-white font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.name || 'Loading...'}</p>
                    <p className="text-xs text-[#3FA9F5]">{user?.role || 'User'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-[#D9DEE8] text-[#1F1F1F] shadow-lg min-w-[200px]"
              >
                <DropdownMenuLabel className="font-semibold text-[#0A2463]">
                  บัญชีของฉัน
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#D9DEE8]" />

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#0A2463]" />
                    <span>โปรไฟล์</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[#0A2463]" />
                  <span>การตั้งค่า</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#D9DEE8]" />

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setLogoutDialogOpen(true);
                  }}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;