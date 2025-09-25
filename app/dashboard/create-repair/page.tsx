"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "../../components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateRepair = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    toast({
      title: "Repair Created Successfully",
      description: "Repair #RX005 has been created and assigned to a technician.",
    });
    setShowConfirmation(false);
    // Reset form or redirect
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files.slice(0, 5 - attachments.length)]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Repair</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new repair request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Device Information */}
          <Card className="bg-gradient-card border-glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Device Information
                <Badge variant="outline">Required</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serial">Serial Number *</Label>
                  <Input
                    id="serial"
                    placeholder="Enter device serial number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Device Model *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iphone14pro">iPhone 14 Pro</SelectItem>
                      <SelectItem value="iphone14">iPhone 14</SelectItem>
                      <SelectItem value="samsungs23">Samsung Galaxy S23</SelectItem>
                      <SelectItem value="macbookair">MacBook Air M2</SelectItem>
                      <SelectItem value="ipadpro">iPad Pro</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="samsung">Samsung</SelectItem>
                      <SelectItem value="huawei">Huawei</SelectItem>
                      <SelectItem value="xiaomi">Xiaomi</SelectItem>
                      <SelectItem value="oppo">OPPO</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warranty status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-warranty">In Warranty</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem Description */}
          <Card className="bg-gradient-card border-glass shadow-card">
            <CardHeader>
              <CardTitle>Problem Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe the problem in detail..."
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Problem Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="screen">Screen/Display</SelectItem>
                      <SelectItem value="battery">Battery</SelectItem>
                      <SelectItem value="water">Water Damage</SelectItem>
                      <SelectItem value="software">Software Issue</SelectItem>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="bg-gradient-card border-glass shadow-card">
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Support: JPG, PNG, PDF (Max 5 files, 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Select Files
                  </label>
                </Button>
              </div>

              {/* Uploaded Files */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="bg-gradient-card border-glass shadow-card">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name *</Label>
                  <Input
                    id="customer-name"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone Number *</Label>
                  <Input
                    id="customer-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email Address</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Address</Label>
                  <Input
                    id="customer-address"
                    placeholder="Enter address"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" variant="hero">
              Create Repair Request
            </Button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <DialogTitle>Confirm Repair Creation</DialogTitle>
              </div>
              <DialogDescription>
                Are you sure you want to create this repair request? This will generate a new repair ID and notify the assigned technician.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="hero" onClick={handleConfirm}>
                Confirm & Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CreateRepair;
