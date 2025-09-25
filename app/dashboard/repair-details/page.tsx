"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Wrench,
  DollarSign,
  Send,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

// Mock data
const repairDetails = {
  id: "RX001",
  device: "iPhone 14 Pro",
  serialNumber: "F4K8N9L2M1P0",
  customer: {
    name: "John Smith",
    phone: "+66 81-234-5678",
    email: "john.smith@email.com",
    address: "123/45 Sukhumvit Road, Bangkok 10110",
  },
  issue: "Screen Replacement",
  description: "Customer dropped the phone and the screen is cracked. Touch is still working but display has black lines.",
  status: "In Progress",
  priority: "High",
  createdDate: "2024-01-15",
  assignedTech: "Mike Johnson",
  estimatedCost: "฿3,500",
  estimatedTime: "2-3 hours",
};

const parts = [
  { name: "iPhone 14 Pro Screen Assembly", quantity: 1, cost: "฿2,800", status: "Ordered" },
  { name: "Screen Protector", quantity: 1, cost: "฿200", status: "In Stock" },
  { name: "Labor", quantity: 1, cost: "฿500", status: "N/A" },
];

const images = [
  { id: 1, name: "Before Repair", url: "/api/placeholder/200/150" },
  { id: 2, name: "Damage Close-up", url: "/api/placeholder/200/150" },
  { id: 3, name: "Serial Number", url: "/api/placeholder/200/150" },
];

const statusHistory = [
  { status: "Created", date: "2024-01-15 09:00", user: "Reception", note: "Initial assessment completed" },
  { status: "Diagnosed", date: "2024-01-15 10:30", user: "Mike Johnson", note: "Screen replacement required" },
  { status: "Parts Ordered", date: "2024-01-15 11:00", user: "Mike Johnson", note: "OEM screen ordered from supplier" },
  { status: "In Progress", date: "2024-01-15 14:00", user: "Mike Johnson", note: "Started screen replacement" },
];

const RepairDetails = () => {
  const [newMessage, setNewMessage] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const { toast } = useToast();

  const handleStatusUpdate = () => {
    toast({
      title: "Status Updated",
      description: "Repair status has been updated successfully.",
    });
    setStatusUpdate("");
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast({
        title: "Message Sent",
        description: "Customer has been notified.",
      });
      setNewMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Ordered":
        return "bg-yellow-100 text-yellow-800";
      case "In Stock":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Repair Details</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {repairDetails.id}
              </Badge>
              <Badge className={getStatusColor(repairDetails.status)}>
                {repairDetails.status}
              </Badge>
              <Badge variant="outline" className="text-red-600">
                {repairDetails.priority} Priority
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Print Report
            </Button>
            <Button variant="hero">
              Update Status
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card border-glass shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Device</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{repairDetails.device}</p>
              <p className="text-sm text-muted-foreground">S/N: {repairDetails.serialNumber}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-glass shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Estimated Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-primary">{repairDetails.estimatedCost}</p>
              <p className="text-sm text-muted-foreground">Time: {repairDetails.estimatedTime}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-glass shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Assigned Tech</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{repairDetails.assignedTech}</p>
                  <p className="text-sm text-muted-foreground">Senior Technician</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="parts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="parts" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Parts & Cost
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Status Update
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Customer
            </TabsTrigger>
          </TabsList>

          {/* Parts & Cost Tab */}
          <TabsContent value="parts" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-glass shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Parts & Materials
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Part
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parts.map((part, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{part.name}</TableCell>
                          <TableCell>{part.quantity}</TableCell>
                          <TableCell>{part.cost}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(part.status)}>
                              {part.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Cost:</span>
                      <span className="text-xl font-bold text-primary">฿3,500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-glass shadow-card">
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Parts Cost:</span>
                      <span className="font-semibold">฿3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor Cost:</span>
                      <span className="font-semibold">฿500</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (7%):</span>
                      <span>฿245</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Grand Total:</span>
                      <span className="text-primary">฿3,745</span>
                    </div>
                  </div>
                  <Button variant="hero" className="w-full">
                    Generate Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            <Card className="bg-gradient-card border-glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Repair Images
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Upload Image
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium text-center">{image.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status Update Tab */}
          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-glass shadow-card">
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">New Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assessment">Assessment</SelectItem>
                        <SelectItem value="diagnosed">Diagnosed</SelectItem>
                        <SelectItem value="parts-ordered">Parts Ordered</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="ready-pickup">Ready for Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Status Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes about this status update..."
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                    />
                  </div>
                  <Button variant="hero" onClick={handleStatusUpdate} className="w-full">
                    Update Status
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-glass shadow-card">
                <CardHeader>
                  <CardTitle>Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusHistory.map((entry, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{entry.status}</span>
                            <Badge variant="outline" className="text-xs">
                              {entry.user}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                          <p className="text-xs text-muted-foreground">{entry.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Communication Tab */}
          <TabsContent value="customer" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-glass shadow-card">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">{repairDetails.customer.name}</p>
                        <p className="text-sm text-muted-foreground">Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <p>{repairDetails.customer.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <p>{repairDetails.customer.email}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <p>{repairDetails.customer.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <p>Created: {repairDetails.createdDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-glass shadow-card">
                <CardHeader>
                  <CardTitle>Notify Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Type your message to the customer..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Send SMS
                    </Button>
                    <Button variant="hero" onClick={handleSendMessage} className="flex-1">
                      <Send className="h-4 w-4 mr-1" />
                      Send Email
                    </Button>
                  </div>
                  <div className="pt-2 text-sm text-muted-foreground">
                    <p>Quick templates:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewMessage("Your device is ready for pickup. Please bring your receipt.")}
                      >
                        Ready for pickup
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewMessage("We need additional approval for extra parts. Please contact us.")}
                      >
                        Need approval
                      </Button>
                    </div>
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

export default RepairDetails;