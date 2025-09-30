"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Image,
  Plus,
  MessageCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Printer,
  DollarSign,
  Send,
  CheckCircle2,
  AlertCircle,
  Package,
  Settings,
  Inbox,
  Cog,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - ปรับเป็นข้อมูลซ่อมปริ้นเตอร์
const repairDetails = {
  id: "PR001",
  printer: "CANON PIXMA G1020",
  serialNumber: "CN123456789TH",
  customer: {
    name: "สมชาย ใจดี",
    phone: "+66 89-123-4567",
    email: "somchai@email.com",
    address: "456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
  },
  issue: "กระดาษติด & หมึกผิดพลาด",
  description: "เครื่องค้างขณะพิมพ์ กระดาษติดในถาด พร้อมแจ้งข้อผิดพลาดหมึก (Ink Error B200) ลูกค้าลองรีเซ็ตแล้วไม่หาย",
  status: "กำลังซ่อม",
  priority: "High",
  createdDate: "2024-06-10",
  assignedTech: "วิชัย ช่างปริ้น",
  estimatedCost: "฿1,200",
  estimatedTime: "1-2 ชั่วโมง",
};

const parts = [
  { name: "ตลับหมึก Canon GI-790 Black", quantity: 1, cost: "฿450", status: "In Stock" },
  { name: "ตลับหมึก Canon GI-790 Color", quantity: 1, cost: "฿550", status: "In Stock" },
  { name: "ลูกกลิ้งป้อนกระดาษ (Roller)", quantity: 1, cost: "฿150", status: "Ordered" },
  { name: "ค่าแรง", quantity: 1, cost: "฿50", status: "N/A" },
];

const images = [
  { id: 1, name: "ภาพเครื่องปริ้นเตอร์", url: "/api/placeholder/200/150" },
  { id: 2, name: "ตำแหน่งกระดาษติด", url: "/api/placeholder/200/150" },
  { id: 3, name: "เลขซีเรียล", url: "/api/placeholder/200/150" },
];

const statusHistory = [
  { status: "รับงาน", date: "2024-06-10 09:00", user: "แผนกต้อนรับ", note: "รับเครื่องและตรวจสอบเบื้องต้น" },
  { status: "วินิจฉัย", date: "2024-06-10 10:15", user: "วิชัย ช่างปริ้น", note: "พบปัญหากระดาษติด + หมึกเสีย" },
  { status: "สั่งอะไหล่", date: "2024-06-10 11:00", user: "วิชัย ช่างปริ้น", note: "สั่งลูกกลิ้งป้อนกระดาษเพิ่ม" },
  { status: "กำลังซ่อม", date: "2024-06-10 13:30", user: "วิชัย ช่างปริ้น", note: "เริ่มถอดเครื่องและเปลี่ยนอะไหล่" },
];

const RepairDetails = () => {
  const [activeTab, setActiveTab] = useState("parts");
  const [newMessage, setNewMessage] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const { toast } = useToast();

  const handleStatusUpdate = () => {
    toast({
      title: "อัปเดตสถานะสำเร็จ",
      description: "สถานะการซ่อมได้รับการอัปเดตเรียบร้อยแล้ว",
    });
    setStatusUpdate("");
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast({
        title: "ส่งข้อความสำเร็จ",
        description: "ลูกค้าได้รับการแจ้งเตือนแล้ว",
      });
      setNewMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "กำลังซ่อม":
        return "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 shadow-lg";
      case "สั่งอะไหล่":
      case "Ordered":
        return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 shadow-lg";
      case "In Stock":
      case "เสร็จสิ้น":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "parts":
        return (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      อะไหล่และวัสดุ
                    </CardTitle>
                    <CardDescription>รายการอะไหล่ที่ใช้ในการซ่อม</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="border-teal-300 hover:bg-teal-50">
                    <Plus className="h-4 w-4 mr-2 text-teal-600" />
                    เพิ่มอะไหล่
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-teal-50/50">
                        <TableHead className="font-semibold text-teal-700">รายการ</TableHead>
                        <TableHead className="text-center font-semibold text-teal-700">จำนวน</TableHead>
                        <TableHead className="text-right font-semibold text-teal-700">ราคา</TableHead>
                        <TableHead className="text-center font-semibold text-teal-700">สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parts.map((part, index) => (
                        <TableRow key={index} className="hover:bg-teal-50/30 transition-colors">
                          <TableCell className="font-medium">{part.name}</TableCell>
                          <TableCell className="text-center">{part.quantity}</TableCell>
                          <TableCell className="text-right font-medium">{part.cost}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getStatusColor(part.status)}>
                              {part.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 pt-4 border-t border-teal-100">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>รวม</span>
                      <span>฿1,200</span>
                    </div>
                    <div className="flex justify-between mt-2 text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      <span>ยอดรวมทั้งหมด</span>
                      <span>฿1,200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    สรุปรายการค่าใช้จ่าย
                  </CardTitle>
                  <CardDescription>รายละเอียดราคาการซ่อม</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ค่าอะไหล่</span>
                      <span className="font-medium">฿1,150</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ค่าแรง</span>
                      <span className="font-medium">฿50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ภาษี (7%)</span>
                      <span className="text-muted-foreground">฿84</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-teal-100 font-bold text-lg bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      <span>ยอดรวมสุทธิ</span>
                      <span>฿1,284</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-shadow">
                    <FileText className="mr-2 h-4 w-4" />
                    สร้างใบเสนอราคา
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "images":
        return (
          <div className="mt-6">
            <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    รูปภาพการซ่อม
                  </CardTitle>
                  <CardDescription>เอกสารประกอบและภาพความคืบหน้า</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="border-teal-300 hover:bg-teal-50">
                  <Plus className="h-4 w-4 mr-2 text-teal-600" />
                  อัปโหลดรูป
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="space-y-2 group">
                      <div className="aspect-video bg-teal-50/30 rounded-lg overflow-hidden border border-teal-200 shadow-sm group-hover:shadow-md transition-shadow">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-center font-medium text-teal-700">{img.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "status":
        return (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    อัปเดตสถานะ
                  </CardTitle>
                  <CardDescription>เปลี่ยนสถานะการซ่อมและเพิ่มหมายเหตุ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status-select" className="text-teal-700 font-medium">สถานะใหม่</Label>
                    <Select>
                      <SelectTrigger id="status-select" className="border-teal-300 focus:ring-teal-500 focus:border-teal-500">
                        <SelectValue placeholder="เลือกสถานะ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assessment">รับงาน</SelectItem>
                        <SelectItem value="diagnosed">วินิจฉัย</SelectItem>
                        <SelectItem value="parts-ordered">สั่งอะไหล่</SelectItem>
                        <SelectItem value="in-progress">กำลังซ่อม</SelectItem>
                        <SelectItem value="testing">ทดสอบ</SelectItem>
                        <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                        <SelectItem value="ready-pickup">พร้อมรับเครื่อง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status-notes" className="text-teal-700 font-medium">หมายเหตุ</Label>
                    <Textarea
                      id="status-notes"
                      placeholder="เพิ่มหมายเหตุเกี่ยวกับการอัปเดตสถานะนี้..."
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="min-h-[100px] border-teal-300 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <Button onClick={handleStatusUpdate} className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-shadow">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    อัปเดตสถานะ
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    ประวัติสถานะ
                  </CardTitle>
                  <CardDescription>ไทม์ไลน์ความคืบหน้าการซ่อม</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 border-l-2 border-teal-300 space-y-6">
                    {statusHistory.map((entry, i) => (
                      <div key={i} className="relative -left-6">
                        <div className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 -left-1.5 top-1 shadow-lg"></div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                              {entry.status}
                            </span>
                            <Badge variant="outline" className="text-xs border-teal-300 text-teal-600">
                              {entry.user}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-teal-500" />
                            {entry.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "customer":
        return (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    ข้อมูลลูกค้า
                  </CardTitle>
                  <CardDescription>รายละเอียดการติดต่อ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: User, label: "ชื่อ-นามสกุล", value: repairDetails.customer.name },
                    { icon: Phone, label: "เบอร์โทรศัพท์", value: repairDetails.customer.phone },
                    { icon: Mail, label: "อีเมล", value: repairDetails.customer.email },
                    { icon: MapPin, label: "ที่อยู่", value: repairDetails.customer.address },
                    { icon: Calendar, label: "วันที่รับงาน", value: repairDetails.createdDate },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-teal-50/50 to-cyan-50/50 border border-teal-100">
                      <div className="mt-1 p-2 bg-teal-100 rounded-md shadow-sm">
                        <item.icon className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs text-teal-700 font-medium">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    แจ้งลูกค้า
                  </CardTitle>
                  <CardDescription>ส่งอัปเดตผ่าน SMS หรืออีเมล</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-message" className="text-teal-700 font-medium">ข้อความ</Label>
                    <Textarea
                      id="customer-message"
                      placeholder="พิมพ์ข้อความถึงลูกค้า..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={5}
                      className="border-teal-300 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-teal-300 hover:bg-teal-50 text-teal-700">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      ส่ง SMS
                    </Button>
                    <Button onClick={handleSendMessage} className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-shadow">
                      <Send className="mr-2 h-4 w-4" />
                      ส่งอีเมล
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-teal-100">
                    <p className="text-sm font-medium text-teal-700 mb-2">เทมเพลตด่วน</p>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 text-teal-700"
                        onClick={() =>
                          setNewMessage("เครื่องปริ้นเตอร์ของคุณซ่อมเสร็จเรียบร้อยแล้ว สามารถมารับได้ที่ร้านพร้อมใบเสร็จ")
                        }
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                        <span className="text-sm">พร้อมรับเครื่อง</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 text-amber-700"
                        onClick={() =>
                          setNewMessage("เราต้องการอนุมัติเพิ่มเติมสำหรับอะไหล่พิเศษ กรุณาติดต่อเราโดยด่วน")
                        }
                      >
                        <AlertCircle className="mr-2 h-4 w-4 text-amber-600" />
                        <span className="text-sm">ต้องการอนุมัติ</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 **pt-1 p-4 md:pt-2 md:p-6 lg:pt-4 lg:p-8**">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              {/* ไอคอนใหญ่ + glow */}
              <div className="p-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <Printer className="h-7 w-7 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700 bg-clip-text text-transparent">
                  Printer Repair Details
                </h1>
                <Badge variant="secondary" className="mt-1 text-sm font-mono bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-teal-200 shadow-sm">
                  #{repairDetails.id}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-teal-300 hover:bg-teal-50 text-teal-700">
              <FileText className="mr-2 h-4 w-4" />
              พิมพ์รายงาน
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-shadow">
              <Settings className="mr-2 h-4 w-4" />
              อัปเดตสถานะ
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "เครื่องปริ้นเตอร์", value: repairDetails.printer, subtitle: `S/N: ${repairDetails.serialNumber}`, icon: Printer },
            { title: "ค่าซ่อมโดยประมาณ", value: repairDetails.estimatedCost, subtitle: repairDetails.estimatedTime, icon: DollarSign },
            { title: "ช่างผู้รับผิดชอบ", value: repairDetails.assignedTech, subtitle: "ช่างปริ้นเตอร์มืออาชีพ", icon: Cog },
            { title: "วันที่รับงาน", value: repairDetails.createdDate, subtitle: repairDetails.issue, icon: Calendar },
          ].map((item, i) => (
            <Card 
              key={i} 
              className="p-4 bg-white/70 backdrop-blur-lg border border-teal-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-teal-700 flex items-center gap-2 font-medium">
                    <item.icon className="h-4 w-4 text-teal-600" />
                    {item.title}
                  </p>
                  <p className="text-lg font-bold mt-1 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {item.value}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                  )}
                </div>
                {item.title === "ช่างผู้รับผิดชอบ" && (
                  <Avatar className="h-9 w-9 border-2 border-teal-200">
                    <AvatarFallback className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 font-semibold shadow-sm">
                      วช
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* === ปุ่มสลับส่วน === */}
        <div className="flex flex-wrap gap-3 mt-6">
          {[
            { id: "parts", label: "อะไหล่และค่าใช้จ่าย", icon: Cog },
            { id: "images", label: "รูปภาพ", icon: Image },
            { id: "status", label: "สถานะ", icon: Clock },
            { id: "customer", label: "ลูกค้า", icon: MessageCircle },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-white/80 text-teal-700 hover:bg-teal-50 border-teal-300 backdrop-blur-sm"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* เนื้อหาตามปุ่มที่เลือก */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RepairDetails;