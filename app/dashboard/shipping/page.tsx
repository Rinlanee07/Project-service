"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Calendar,
  User,
  Phone,
  Printer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - ปรับเป็นข้อมูลส่งคืนปริ้นเตอร์
const shippingOrders = [
  {
    id: "SH001",
    repairId: "PR001",
    customer: "สมชาย ใจดี",
    phone: "+66 89-123-4567",
    address: "456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    printer: "CANON PIXMA G1020",
    status: "กำลังจัดส่ง",
    trackingNumber: "TH1234567890",
    courier: "ไปรษณีย์ไทย",
    shippedDate: "2024-06-11",
    estimatedDelivery: "2024-06-13",
    cost: "฿50",
  },
  {
    id: "SH002",
    repairId: "PR003",
    customer: "ธนพล รักดี",
    phone: "+66 88-234-5678",
    address: "123 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
    printer: "HP Smart Tank 615",
    status: "ส่งถึงแล้ว",
    trackingNumber: "TH0987654321",
    courier: "Kerry Express",
    shippedDate: "2024-06-10",
    estimatedDelivery: "2024-06-11",
    cost: "฿80",
  },
  {
    id: "SH003",
    repairId: "PR005",
    customer: "อนุสรณ์ ทองดี",
    phone: "+66 87-345-6789",
    address: "789 ถนนพหลโยธิน แขวงเสนานิคม เขตจตุจักร กรุงเทพฯ 10900",
    printer: "CANON TS9570",
    status: "พร้อมจัดส่ง",
    trackingNumber: "",
    courier: "Flash Express",
    shippedDate: "",
    estimatedDelivery: "2024-06-14",
    cost: "฿45",
  },
];

const timeline = [
  { 
    date: "2024-06-11 10:00", 
    status: "จัดส่งแล้ว", 
    location: "ศูนย์กระจายสินค้า กรุงเทพฯ",
    description: "รับเครื่องปริ้นเตอร์จากศูนย์ซ่อม" 
  },
  { 
    date: "2024-06-11 14:30", 
    status: "อยู่ระหว่างจัดส่ง", 
    location: "ศูนย์คัดแยก กรุงเทพฯ",
    description: "เครื่องปริ้นเตอร์ถูกคัดแยกและเตรียมจัดส่ง" 
  },
  { 
    date: "2024-06-12 09:15", 
    status: "อยู่ระหว่างนำส่ง", 
    location: "ศูนย์กระจายสินค้าท้องถิ่น",
    description: "กำลังนำส่งเครื่องปริ้นเตอร์ให้ลูกค้า" 
  },
  { 
    date: "2024-06-12 16:45", 
    status: "ส่งถึงแล้ว", 
    location: "ที่อยู่ลูกค้า",
    description: "ส่งเครื่องปริ้นเตอร์ถึงลูกค้าเรียบร้อยแล้ว" 
  },
];

const Shipping = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ส่งถึงแล้ว":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-sm";
      case "กำลังจัดส่ง":
        return "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 shadow-sm";
      case "พร้อมจัดส่ง":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "สร้างรายการจัดส่งสำเร็จ",
      description: "รายการจัดส่งเครื่องปริ้นเตอร์ใหม่ถูกสร้างเรียบร้อยแล้ว",
    });
  };

  const filteredOrders = shippingOrders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.repairId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700 bg-clip-text text-transparent">
                  Printer Shipping Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  จัดการการจัดส่งเครื่องปริ้นเตอร์ที่ซ่อมเสร็จแล้ว
                </p>
              </div>
            </div>
          </div>
          <Button 
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="h-4 w-4 mr-2" />
            สร้างรายการจัดส่ง
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "พร้อมจัดส่ง", value: "5", icon: Package, color: "from-amber-500 to-orange-500", iconBg: "bg-amber-100" },
            { title: "กำลังจัดส่ง", value: "8", icon: Truck, color: "from-teal-500 to-cyan-500", iconBg: "bg-teal-100" },
            { title: "ส่งวันนี้", value: "12", icon: CheckCircle, color: "from-emerald-500 to-teal-500", iconBg: "bg-emerald-100" },
            { title: "เดือนนี้", value: "156", icon: Calendar, color: "from-cyan-500 to-blue-500", iconBg: "bg-cyan-100" },
          ].map((stat, i) => (
            <Card 
              key={i} 
              className="bg-white/80 backdrop-blur-lg border border-teal-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color.split('-')[1] || 'teal'}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-teal-100 p-1 rounded-lg">
            <TabsTrigger 
              value="orders" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-md transition-all"
            >
              <Package className="h-4 w-4" />
              รายการจัดส่ง
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-md transition-all"
            >
              <Plus className="h-4 w-4" />
              สร้างรายการ
            </TabsTrigger>
            <TabsTrigger 
              value="tracking" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-md transition-all"
            >
              <MapPin className="h-4 w-4" />
              ติดตามพัสดุ
            </TabsTrigger>
          </TabsList>

          {/* Shipping Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
              <CardHeader className="border-b border-teal-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    รายการจัดส่งเครื่องปริ้นเตอร์
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                    <Input
                      placeholder="ค้นหาเลขที่จัดส่งหรือชื่อลูกค้า..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full md:w-64 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-teal-50/50">
                      <TableHead className="font-semibold text-teal-700">เลขที่จัดส่ง</TableHead>
                      <TableHead className="font-semibold text-teal-700">เลขที่ซ่อม</TableHead>
                      <TableHead className="font-semibold text-teal-700">ลูกค้า</TableHead>
                      <TableHead className="font-semibold text-teal-700">ปริ้นเตอร์</TableHead>
                      <TableHead className="font-semibold text-teal-700">สถานะ</TableHead>
                      <TableHead className="font-semibold text-teal-700">ผู้ให้บริการ</TableHead>
                      <TableHead className="font-semibold text-teal-700">เลขติดตาม</TableHead>
                      <TableHead className="font-semibold text-teal-700">วันที่ส่งถึง</TableHead>
                      <TableHead className="font-semibold text-teal-700">ค่าจัดส่ง</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-teal-50/30 transition-colors">
                        <TableCell className="font-medium text-teal-700">{order.id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-teal-100 text-teal-800 border-teal-200">
                            {order.repairId}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">{order.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.printer}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.courier}</TableCell>
                        <TableCell>
                          {order.trackingNumber ? (
                            <span className="font-mono text-sm text-teal-700">{order.trackingNumber}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{order.estimatedDelivery}</TableCell>
                        <TableCell className="font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          {order.cost}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Shipment Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  สร้างรายการจัดส่งใหม่
                </CardTitle>
                <CardDescription>กรอกข้อมูลเพื่อจัดส่งเครื่องปริ้นเตอร์ที่ซ่อมเสร็จแล้ว</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateShipment} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="repair-id" className="text-teal-700 font-medium">เลขที่ซ่อม *</Label>
                      <Select required>
                        <SelectTrigger className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
                          <SelectValue placeholder="เลือกงานซ่อมที่เสร็จแล้ว" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PR002">PR002 - EPSON L1216 (พร้อมจัดส่ง)</SelectItem>
                          <SelectItem value="PR004">PR004 - Brother HL-T4000DW (พร้อมจัดส่ง)</SelectItem>
                          <SelectItem value="PR006">PR006 - CANON TS307 (พร้อมจัดส่ง)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courier" className="text-teal-700 font-medium">ผู้ให้บริการ *</Label>
                      <Select required>
                        <SelectTrigger className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
                          <SelectValue placeholder="เลือกผู้ให้บริการ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thailand-post">ไปรษณีย์ไทย</SelectItem>
                          <SelectItem value="kerry">Kerry Express</SelectItem>
                          <SelectItem value="flash">Flash Express</SelectItem>
                          <SelectItem value="dhl">DHL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-name" className="text-teal-700 font-medium">ชื่อลูกค้า *</Label>
                    <Input 
                      id="customer-name" 
                      className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-teal-700 font-medium">เบอร์โทรศัพท์ *</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-teal-700 font-medium">อีเมล</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-teal-700 font-medium">ที่อยู่จัดส่ง *</Label>
                    <Textarea 
                      id="address" 
                      placeholder="กรอกที่อยู่จัดส่งแบบเต็ม..."
                      rows={3}
                      className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-cost" className="text-teal-700 font-medium">ค่าจัดส่ง (฿)</Label>
                      <Input 
                        id="shipping-cost" 
                        type="number" 
                        placeholder="0.00"
                        className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-teal-700 font-medium">ระดับความเร่งด่วน</Label>
                      <Select>
                        <SelectTrigger className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
                          <SelectValue placeholder="เลือกระดับความเร่งด่วน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">มาตรฐาน</SelectItem>
                          <SelectItem value="express">ด่วนพิเศษ</SelectItem>
                          <SelectItem value="overnight">ด่วนที่สุด</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-teal-700 font-medium">คำแนะนำพิเศษ</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="ระบุคำแนะนำเพิ่มเติมสำหรับการจัดส่ง..."
                      rows={2}
                      className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="border-teal-300 text-teal-700 hover:bg-teal-50"
                    >
                      บันทึกแบบร่าง
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      สร้างรายการจัดส่ง
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Package Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    ติดตามพัสดุ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="tracking-number" className="text-teal-700 font-medium">เลขติดตามพัสดุ</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="tracking-number" 
                        placeholder="กรอกเลขติดตามพัสดุ"
                        defaultValue="TH1234567890"
                        className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      />
                      <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-md">
                        ติดตาม
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-teal-100 pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg shadow-sm">
                        <Printer className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-teal-700">CANON PIXMA G1020</p>
                        <p className="text-sm text-muted-foreground">เลขที่จัดส่ง: SH001</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-teal-600" />
                        <span className="text-sm font-medium">สมชาย ใจดี</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-teal-600" />
                        <span className="text-sm">+66 89-123-4567</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-teal-600 mt-0.5" />
                        <span className="text-sm">456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    ประวัติการจัดส่ง
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center mt-1">
                          <div className={`w-3 h-3 rounded-full ${
                            index === timeline.length - 1 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm' 
                              : 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-sm'
                          }`} />
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 h-10 bg-teal-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                              {event.status}
                            </span>
                            {index === timeline.length - 1 && (
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {event.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                          <p className="text-xs text-teal-600 mt-1">
                            {event.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shipping;