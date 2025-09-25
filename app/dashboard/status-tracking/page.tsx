"use client";

import { useState, useEffect} from "react";
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
  Package,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const ClockBadge = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString());
    updateTime(); // แสดงเวลาเลยตอน mount
    const interval = setInterval(updateTime, 1000); // อัปเดตทุก 1 วินาที
    return () => clearInterval(interval); // ล้าง interval ตอน unmount
  }, []);

  return <Badge variant="outline">Updated: {time}</Badge>;
};

// Mock data
const repairs = [
  {
    id: "RX001",
    device: "iPhone 14 Pro",
    customer: "John Smith",
    issue: "Screen Replacement",
    status: "In Progress",
    priority: "High",
    technician: "Mike Johnson",
    created: "2024-01-15",
    updated: "2024-01-15 14:30",
    estimatedCompletion: "2024-01-16",
    cost: "฿3,500",
  },
  {
    id: "RX002",
    device: "Samsung Galaxy S23",
    customer: "Sarah Johnson",
    issue: "Battery Replacement",
    status: "Pending",
    priority: "Medium",
    technician: "Alice Chen",
    created: "2024-01-14",
    updated: "2024-01-14 16:00",
    estimatedCompletion: "2024-01-17",
    cost: "฿2,200",
  },
  {
    id: "RX003",
    device: "MacBook Air M2",
    customer: "Mike Chen",
    issue: "Keyboard Issue",
    status: "Completed",
    priority: "Low",
    technician: "David Park",
    created: "2024-01-13",
    updated: "2024-01-15 11:00",
    estimatedCompletion: "2024-01-15",
    cost: "฿1,800",
  },
  {
    id: "RX004",
    device: "iPad Pro",
    customer: "Lisa Wang",
    issue: "Water Damage",
    status: "Assessment",
    priority: "High",
    technician: "Mike Johnson",
    created: "2024-01-12",
    updated: "2024-01-12 09:30",
    estimatedCompletion: "2024-01-18",
    cost: "฿4,500",
  },
  {
    id: "RX005",
    device: "Google Pixel 7",
    customer: "Tom Wilson",
    issue: "Camera Issue",
    status: "Parts Ordered",
    priority: "Medium",
    technician: "Alice Chen",
    created: "2024-01-11",
    updated: "2024-01-14 13:15",
    estimatedCompletion: "2024-01-19",
    cost: "฿2,800",
  },
];

const statusStats = [
  { status: "Pending", count: 12, color: "bg-yellow-100 text-yellow-800", icon: Clock },
  { status: "In Progress", count: 8, color: "bg-blue-100 text-blue-800", icon: Package },
  { status: "Completed", count: 25, color: "bg-green-100 text-green-800", icon: CheckCircle },
  { status: "Assessment", count: 5, color: "bg-purple-100 text-purple-800", icon: AlertTriangle },
];

const StatusTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Assessment":
        return "bg-purple-100 text-purple-800";
      case "Parts Ordered":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch = 
      repair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.device.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || repair.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleQuickStatusUpdate = (repairId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Repair ${repairId} status updated to ${newStatus}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Status Tracking</h1>
            <p className="text-muted-foreground">
              Monitor and update repair statuses in real-time
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="hero" asChild>
              <Link href="/dashboard/create-repair">New Repair</Link>
            </Button>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusStats.map((stat) => (
            <Card key={stat.status} className="bg-gradient-card border-glass shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.status}</p>
                    <p className="text-2xl font-bold">{stat.count}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-gradient-card border-glass shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search repairs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Assessment">Assessment</SelectItem>
                  <SelectItem value="Parts Ordered">Parts Ordered</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Repairs Table */}
        <Card className="bg-gradient-card border-glass shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Repair Tracking ({filteredRepairs.length} items)
              <ClockBadge />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repair ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Est. Completion</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepairs.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell className="font-medium">
                        <Link 
                          href="/dashboard/repair-details" 
                          className="text-primary hover:underline"
                        >
                          {repair.id}
                        </Link>
                      </TableCell>
                      <TableCell>{repair.device}</TableCell>
                      <TableCell>{repair.customer}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {repair.issue}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 h-auto">
                              <Badge
                                className={`${getStatusColor(repair.status)} cursor-pointer hover:opacity-80`}
                              >
                                {repair.status}
                              </Badge>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleQuickStatusUpdate(repair.id, "Assessment")}
                            >
                              Assessment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleQuickStatusUpdate(repair.id, "Parts Ordered")}
                            >
                              Parts Ordered
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleQuickStatusUpdate(repair.id, "In Progress")}
                            >
                              In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleQuickStatusUpdate(repair.id, "Completed")}
                            >
                              Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(repair.priority)}
                        >
                          {repair.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {repair.technician.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm">{repair.technician.split(' ')[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {repair.estimatedCompletion}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {repair.cost}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href="/dashboard/repair-details">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Repair
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Manage Parts
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Report
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
        <Card className="bg-gradient-card border-glass shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Mark as In Progress (5)
              </Button>
              <Button variant="outline" className="justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed (3)
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Bulk Export (12)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StatusTracking;