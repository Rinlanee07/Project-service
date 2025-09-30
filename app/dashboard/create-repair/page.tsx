"use client";

import { useState } from "react";
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
import { Upload, X, CheckCircle, Printer, FileText, Sparkles, User } from "lucide-react";

const CreateRepair = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [printerModel, setPrinterModel] = useState("");
  const [printerBrand, setPrinterBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customBrand, setCustomBrand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    alert("Repair Created Successfully - Repair #PR001 has been created and assigned to a technician.");
    setShowConfirmation(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files.slice(0, 5 - attachments.length)]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const isOtherModel = printerModel === "other";
  const isOtherBrand = printerBrand === "other";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-xl border border-teal-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-teal-50/70 to-cyan-50/70 border-b border-teal-200 pb-6">
            <div className="flex items-center gap-3">
              {/* Icon with glow */}
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-lg">
                <Printer className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700 bg-clip-text text-transparent">
                Printer Repair Request Form
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Printer Information */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2 border-b border-teal-200 pb-2">
                  <Printer className="h-5 w-5" />
                  Printer Information
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Required</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serial" className="text-sm font-semibold text-teal-700">Serial Number *</Label>
                    <Input
                      id="serial"
                      placeholder="Enter printer serial number"
                      className="border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-sm font-semibold text-teal-700">Printer Model *</Label>
                    <Select
                      value={printerModel}
                      onValueChange={setPrinterModel}
                      required={!isOtherModel}
                    >
                      <SelectTrigger className="border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
                        <SelectValue placeholder="Select printer model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="canon-ts307">CANON TS307</SelectItem>
                        <SelectItem value="canon-pixma-g1020">CANON PIXMA G1020</SelectItem>
                        <SelectItem value="epson-l1216">EPSON L1216</SelectItem>
                        <SelectItem value="hp-1tj09a">HP 1TJ09A</SelectItem>
                        <SelectItem value="hp-smart-tank-615">HP Smart Tank 615 All-in-One</SelectItem>
                        <SelectItem value="canon-pixma-ix6870">CANON PIXMA IX6870</SelectItem>
                        <SelectItem value="brother-hl-t4000dw">Brother HL-T4000DW</SelectItem>
                        <SelectItem value="epson-l1800">EPSON L1800</SelectItem>
                        <SelectItem value="canon-ts9570">CANON TS9570</SelectItem>
                        <SelectItem value="epson-m1120">EPSON M1120</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {isOtherModel && (
                      <Input
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="Enter custom printer model"
                        className="mt-2 border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-sm font-semibold text-teal-700">Printer Brand</Label>
                    <Select
                      value={printerBrand}
                      onValueChange={setPrinterBrand}
                    >
                      <SelectTrigger className="border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="canon">Canon</SelectItem>
                        <SelectItem value="epson">Epson</SelectItem>
                        <SelectItem value="hp">HP</SelectItem>
                        <SelectItem value="brother">Brother</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {isOtherBrand && (
                      <Input
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        placeholder="Enter custom brand"
                        className="mt-2 border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty" className="text-sm font-semibold text-teal-700">Warranty Status</Label>
                    <Select>
                      <SelectTrigger className="border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
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
              </section>

              {/* Problem Description */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2 border-b border-amber-200 pb-2">
                  <FileText className="h-5 w-5" />
                  Problem Description
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="symptoms" className="text-sm font-semibold text-amber-700">Symptoms *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe the printer issue in detail (e.g., paper jam, ink error, not printing)..."
                    rows={4}
                    className="border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </div>
              </section>

              {/* Attachments */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent flex items-center gap-2 border-b border-purple-200 pb-2">
                  <Upload className="h-5 w-5" />
                  Attachments
                </h2>
                <div className="border-2 border-dashed border-purple-300 bg-purple-50/40 rounded-xl p-8 text-center hover:bg-purple-100/60 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                  <p className="text-slate-700 font-medium mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
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
                  <Button variant="outline" asChild className="border-2 border-purple-500 text-purple-700 hover:bg-purple-100">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Select Files
                    </label>
                  </Button>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-purple-700">Uploaded Files</Label>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100/70 to-pink-100/70 rounded-lg border border-purple-200 shadow-sm"
                        >
                          <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="text-slate-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Customer Information */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name" className="text-sm font-semibold text-emerald-700">Customer Name *</Label>
                    <Input
                      id="customer-name"
                      placeholder="Enter customer name"
                      className="border-2 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone" className="text-sm font-semibold text-emerald-700">Phone Number *</Label>
                    <Input
                      id="customer-phone"
                      type="tel"
                      placeholder="Enter phone number"
                      className="border-2 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email" className="text-sm font-semibold text-emerald-700">Email Address</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="Enter email address"
                      className="border-2 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-address" className="text-sm font-semibold text-emerald-700">Address</Label>
                    <Input
                      id="customer-address"
                      placeholder="Enter address"
                      className="border-2 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold text-emerald-700">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about the printer or location..."
                    rows={3}
                    className="border-2 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </section>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  className="px-6 py-3 border-2 border-slate-300 hover:bg-slate-100 text-slate-700"
                >
                  Save as Draft
                </Button>
                <Button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-shadow"
                >
                  Create Repair Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="bg-white/95 backdrop-blur-xl border-2 border-teal-200 shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full shadow-sm">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Confirm Repair Creation
                </DialogTitle>
              </div>
              <DialogDescription className="text-base text-slate-600">
                Are you sure you want to create this repair request? This will generate a new repair ID and notify the assigned technician.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="border-2 border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                Confirm & Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateRepair;