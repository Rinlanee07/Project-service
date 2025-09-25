"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

// Mock data
const shippingOrders = [
  {
    id: "SH001",
    repairId: "RX001",
    customer: "John Smith",
    phone: "+66 81-234-5678",
    address: "123/45 Sukhumvit Road, Bangkok 10110",
    device: "iPhone 14 Pro",
    status: "In Transit",
    trackingNumber: "TH1234567890",
    courier: "Thailand Post",
    shippedDate: "2024-01-16",
    estimatedDelivery: "2024-01-18",
    cost: "฿50",
  },
  {
    id: "SH002",
    repairId: "RX003",
    customer: "Mike Chen",
    phone: "+66 82-345-6789",
    address: "456/78 Rama IV Road, Bangkok 10500",
    device: "MacBook Air M2",
    status: "Delivered",
    trackingNumber: "TH0987654321",
    courier: "Kerry Express",
    shippedDate: "2024-01-15",
    estimatedDelivery: "2024-01-16",
    cost: "฿80",
  },
  {
    id: "SH003",
    repairId: "RX005",
    customer: "Tom Wilson",
    phone: "+66 83-456-7890",
    address: "789/12 Silom Road, Bangkok 10320",
    device: "Google Pixel 7",
    status: "Ready to Ship",
    trackingNumber: "",
    courier: "Flash Express",
    shippedDate: "",
    estimatedDelivery: "2024-01-19",
    cost: "฿45",
  },
];

const timeline = [
  { 
    date: "2024-01-16 10:00", 
    status: "Package Shipped", 
    location: "Bangkok Distribution Center",
    description: "Package picked up from repair center" 
  },
  { 
    date: "2024-01-16 14:30", 
    status: "In Transit", 
    location: "Bangkok Sorting Facility",
    description: "Package processed and sorted" 
  },
  { 
    date: "2024-01-17 09:15", 
    status: "Out for Delivery", 
    location: "Local Delivery Hub",
    description: "Package out for delivery to customer" 
  },
  { 
    date: "2024-01-17 16:45", 
    status: "Delivered", 
    location: "Customer Address",
    description: "Package successfully delivered to customer" 
  },
];

const Shipping = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Ready to Ship":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Shipment Created",
      description: "New shipping order has been created successfully.",
    });
  };

  const filteredOrders = shippingOrders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.repairId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shipping Management</h1>
            <p className="text-muted-foreground">
              Manage shipping and delivery of repaired devices
            </p>
          </div>
          <Button variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-glass shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ready to Ship</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-glass shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-glass shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered Today</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-glass shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Shipping Orders
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Shipment
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Track Package
            </TabsTrigger>
          </TabsList>

          {/* Shipping Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card className="bg-gradient-card border-glass shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Shipping Orders</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Repair ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Courier</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.repairId}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">{order.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.device}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.courier}</TableCell>
                        <TableCell>
                          {order.trackingNumber ? (
                            <span className="font-mono text-sm">{order.trackingNumber}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{order.estimatedDelivery}</TableCell>
                        <TableCell className="font-semibold text-primary">
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
          <TabsContent value="create" className="space-y-4">
            <Card className="bg-gradient-card border-glass shadow-card max-w-2xl">
              <CardHeader>
                <CardTitle>Create New Shipment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateShipment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="repair-id">Repair ID *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select repair" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RX004">RX004 - iPad Pro (Ready)</SelectItem>
                          <SelectItem value="RX006">RX006 - iPhone 13 (Ready)</SelectItem>
                          <SelectItem value="RX007">RX007 - Samsung S22 (Ready)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courier">Courier Service *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select courier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thailand-post">Thailand Post</SelectItem>
                          <SelectItem value="kerry">Kerry Express</SelectItem>
                          <SelectItem value="flash">Flash Express</SelectItem>
                          <SelectItem value="dhl">DHL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name *</Label>
                    <Input id="customer-name" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Shipping Address *</Label>
                    <Textarea 
                      id="address" 
                      placeholder="Enter complete shipping address..." 
                      rows={3}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-cost">Shipping Cost (฿)</Label>
                      <Input id="shipping-cost" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="overnight">Overnight</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any special delivery instructions..." 
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">
                      Save as Draft
                    </Button>
                    <Button type="submit" variant="hero">
                      Create Shipment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Package Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-glass shadow-card">
                <CardHeader>
                  <CardTitle>Track Package</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tracking-number">Tracking Number</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="tracking-number" 
                        placeholder="Enter tracking number"
                        defaultValue="TH1234567890"
                      />
                      <Button>Track</Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">iPhone 14 Pro</p>
                        <p className="text-sm text-muted-foreground">Shipment ID: SH001</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">John Smith</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">+66 81-234-5678</span>
                    </div>
                    <div className="flex items-start gap-3 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">123/45 Sukhumvit Road, Bangkok 10110</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-glass shadow-card">
                <CardHeader>
                  <CardTitle>Delivery Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeline.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === timeline.length - 1 ? 'bg-green-500' : 'bg-primary'
                          }`} />
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 h-8 bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{event.status}</span>
                            {index === timeline.length - 1 && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {event.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
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
    </DashboardLayout>
  );
};

export default Shipping;