'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Printer,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClockBadge = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Badge variant="outline" className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 shadow-lg">
      <Clock className="h-3 w-3 mr-1" />
      {time}
    </Badge>
  );
};

// Mock data - ปรับเป็นข้อมูลซ่อมปริ้นเตอร์
const repairs = [
  {
    id: "PR001",
    printer: "CANON PIXMA G1020",
    customer: "สมชาย ใจดี",
    issue: "กระดาษติด + หมึกไม่ออก",
    status: "กำลังซ่อม",
    technician: "วิชัย ช่างปริ้น",
    created: "2024-06-10",
    updated: "2024-06-10 14:30",
    estimatedCompletion: "2024-06-11",
    cost: "฿1,200",
  },
  {
    id: "PR002",
    printer: "EPSON L1216",
    customer: "น้ำฝน แสงใส",
    issue: "เครื่องค้างขณะพิมพ์",
    status: "รออะไหล่",
    technician: "กานต์ ช่างเทคนิค",
    created: "2024-06-09",
    updated: "2024-06-09 16:00",
    estimatedCompletion: "2024-06-12",
    cost: "฿850",
  },
  {
    id: "PR003",
    printer: "HP Smart Tank 615",
    customer: "ธนพล รักดี",
    issue: "หมึกเลอะ ไม่พิมพ์สี",
    status: "เสร็จสิ้น",
    technician: "วิชัย ช่างปริ้น",
    created: "2024-06-08",
    updated: "2024-06-10 11:00",
    estimatedCompletion: "2024-06-10",
    cost: "฿950",
  },
  {
    id: "PR004",
    printer: "Brother HL-T4000DW",
    customer: "ปวีณา ใจดี",
    issue: "ไม่รับสัญญาณ Wi-Fi",
    status: "วินิจฉัย",
    technician: "กานต์ ช่างเทคนิค",
    created: "2024-06-07",
    updated: "2024-06-07 09:30",
    estimatedCompletion: "2024-06-13",
    cost: "฿1,500",
  },
  {
    id: "PR005",
    printer: "CANON TS9570",
    customer: "อนุสรณ์ ทองดี",
    issue: "ถาดกระดาษเสีย",
    status: "สั่งอะไหล่",
    technician: "วิชัย ช่างปริ้น",
    created: "2024-06-06",
    updated: "2024-06-09 13:15",
    estimatedCompletion: "2024-06-14",
    cost: "฿2,100",
  },
];

const statusStats = [
  { 
    status: "รอรับงาน", 
    count: 7, 
    icon: Clock,
    gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
    iconBg: "bg-amber-500/20",
    change: "+1"
  },
  { 
    status: "กำลังซ่อม", 
    count: 5, 
    icon: Printer,
    gradient: "bg-gradient-to-r from-teal-500 to-cyan-500",
    iconBg: "bg-teal-500/20",
    change: "+2"
  },
  { 
    status: "เสร็จสิ้น", 
    count: 18, 
    icon: CheckCircle,
    gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-500/20",
    change: "+4"
  },
  { 
    status: "วินิจฉัย", 
    count: 3, 
    icon: AlertTriangle,
    gradient: "bg-gradient-to-br from-purple-400 to-indigo-500",
    iconBg: "bg-purple-500/20",
    change: "0"
  },
];

const StatusTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "เสร็จสิ้น":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg";
      case "กำลังซ่อม":
        return "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 shadow-lg";
      case "รอรับงาน":
        return "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg";
      case "วินิจฉัย":
        return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg";
      case "สั่งอะไหล่":
      case "รออะไหล่":
        return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 shadow-lg";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch = 
      repair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.printer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleQuickStatusUpdate = (repairId: string, newStatus: string) => {
    toast({
      title: "อัปเดตสถานะสำเร็จ",
      description: `งานซ่อม ${repairId} ถูกเปลี่ยนเป็น "${newStatus}"`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 dark:from-slate-950 dark:via-cyan-950 dark:to-teal-950">
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-lg">
                <Printer className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700 bg-clip-text text-transparent">
                  Printer Status Tracking
                </h1>
                <p className="text-muted-foreground text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  ติดตามและอัปเดตสถานะการซ่อมปริ้นเตอร์แบบเรียลไทม์
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-2 hover:border-teal-500 hover:shadow-lg transition-all">
              <Download className="h-4 w-4 mr-2" />
              ส่งออกข้อมูล
            </Button>
            <Button variant="outline" className="border-2 hover:border-teal-500 hover:shadow-lg transition-all">
              <RefreshCw className="h-4 w-4 mr-2" />
              รีเฟรช
            </Button>
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all">
              <Printer className="h-4 w-4 mr-2" />
              รับงานซ่อมใหม่
            </Button>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statusStats.map((stat, index) => (
            <Card 
              key={stat.status} 
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className={`absolute inset-0 ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.status}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        {stat.count}
                      </p>
                      <Badge variant="success" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-4 ${stat.iconBg} rounded-2xl shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-teal-600" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${stat.gradient} rounded-full`} style={{ width: `${(stat.count / 40) * 100}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-2 border-teal-100 dark:border-teal-900 shadow-xl bg-gradient-to-br from-white to-cyan-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-teal-950">
          <CardHeader className="border-b border-teal-100 dark:border-teal-900">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg shadow-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                ตัวกรองและการค้นหา
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-600 group-focus-within:text-cyan-500 transition-colors" />
                <Input
                  placeholder="ค้นหาเลขที่งาน, ชื่อลูกค้า, หรือรุ่นปริ้นเตอร์..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 border-2 focus:border-teal-500 focus:shadow-lg transition-all h-11"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2 hover:border-teal-500 focus:shadow-lg transition-all h-11">
                  <SelectValue placeholder="ทุกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="รอรับงาน">รอรับงาน</SelectItem>
                  <SelectItem value="วินิจฉัย">วินิจฉัย</SelectItem>
                  <SelectItem value="สั่งอะไหล่">สั่งอะไหล่</SelectItem>
                  <SelectItem value="รออะไหล่">รออะไหล่</SelectItem>
                  <SelectItem value="กำลังซ่อม">กำลังซ่อม</SelectItem>
                  <SelectItem value="เสร็จสิ้น">เสร็จสิ้น</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="border-2 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all h-11"
              >
                ล้างตัวกรอง
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Repairs Table */}
        <Card className="border-2 border-teal-100 dark:border-teal-900 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="border-b-2 border-teal-100 dark:border-teal-900 bg-gradient-to-r from-white to-cyan-50 dark:from-slate-900 dark:to-teal-950">
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg shadow-lg">
                  <Printer className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  รายการซ่อมปริ้นเตอร์
                </span>
                <Badge variant="info" className="ml-2">
                  {filteredRepairs.length} รายการ
                </Badge>
              </div>
              <ClockBadge />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border-b-2 border-teal-100 dark:border-teal-900">
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">เลขที่งาน</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">ปริ้นเตอร์</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">ลูกค้า</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">ปัญหา</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">สถานะ</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">ช่างผู้รับผิดชอบ</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">วันที่เสร็จ</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">ค่าใช้จ่าย</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepairs.map((repair) => (
                    <TableRow 
                      key={repair.id} 
                      className="hover:bg-gradient-to-r hover:from-teal-50 hover:to-transparent dark:hover:from-teal-950 dark:hover:to-transparent transition-all cursor-pointer group"
                    >
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />
                          <span className="text-teal-600 group-hover:text-cyan-500 transition-colors">
                            {repair.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{repair.printer}</TableCell>
                      <TableCell>{repair.customer}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {repair.issue}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                              <Badge
                                className={`${getStatusColor(repair.status)} cursor-pointer transition-transform`}
                              >
                                {repair.status}
                              </Badge>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="border-2 shadow-xl">
                            <DropdownMenuItem
                              onClick={() => handleQuickStatusUpdate(repair.id, "วินิจฉัย")}
                              className="cursor-pointer"
                            >
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                              วินิจฉัย
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleQuickStatusUpdate(repair.id, "สั่งอะไหล่")}
                              className="cursor-pointer"
                            >
                              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2" />
                              สั่งอะไหล่
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleQuickStatusUpdate(repair.id, "กำลังซ่อม")}
                              className="cursor-pointer"
                            >
                              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2" />
                              กำลังซ่อม
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleQuickStatusUpdate(repair.id, "เสร็จสิ้น")}
                              className="cursor-pointer"
                            >
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                              เสร็จสิ้น
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold text-white">
                              {repair.technician.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{repair.technician}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-teal-600" />
                          {repair.estimatedCompletion}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-lg bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                        {repair.cost}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-teal-100 hover:shadow-lg transition-all"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-2 shadow-xl">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4 text-teal-500" />
                              ดูรายละเอียด
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4 text-amber-500" />
                              แก้ไขงานซ่อม
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Printer className="mr-2 h-4 w-4 text-purple-500" />
                              จัดการอะไหล่
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="mr-2 h-4 w-4 text-emerald-500" />
                              ส่งออกรายงาน
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-2 border-teal-100 dark:border-teal-900 shadow-xl bg-gradient-to-br from-white to-cyan-50 dark:from-slate-900 dark:to-teal-950">
          <CardHeader className="border-b border-teal-100 dark:border-teal-900">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                การดำเนินการด่วน
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="justify-start h-14 border-2 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950 hover:shadow-lg transition-all group"
              >
                <Clock className="h-5 w-5 mr-3 text-amber-500" />
                <div className="text-left">
                  <div className="font-semibold">เริ่มซ่อมทันที</div>
                  <div className="text-xs text-muted-foreground">3 งานรอรับ</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-14 border-2 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:shadow-lg transition-all group"
              >
                <CheckCircle className="h-5 w-5 mr-3 text-emerald-500" />
                <div className="text-left">
                  <div className="font-semibold">ทำเครื่องว่าเสร็จ</div>
                  <div className="text-xs text-muted-foreground">2 งานกำลังซ่อม</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-14 border-2 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950 hover:shadow-lg transition-all group"
              >
                <Download className="h-5 w-5 mr-3 text-teal-500" />
                <div className="text-left">
                  <div className="font-semibold">ส่งออกรายงานทั้งหมด</div>
                  <div className="text-xs text-muted-foreground">รวม {repairs.length} รายการ</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusTracking;