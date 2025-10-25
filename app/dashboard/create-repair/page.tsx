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
import { Upload, X, CheckCircle, Printer, FileText, Sparkles, User, Loader2 } from "lucide-react";

const CreateRepair = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [printerModel, setPrinterModel] = useState("");
  const [printerBrand, setPrinterBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [accessories, setAccessories] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setShowConfirmation(true);
  };

  const uploadFile = async (file: File): Promise<string> => {
    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload error:', errorData);
      throw new Error(errorData.error || 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์');
    }

    const data = await response.json();
    console.log('Upload success:', data);
    return data.url;
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // อัพโหลดไฟล์ทั้งหมด
      const imageUrls: string[] = [];
      if (attachments.length > 0) {
        setIsUploading(true);
        try {
          for (const file of attachments) {
            const url = await uploadFile(file);
            imageUrls.push(url);
          }
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          throw new Error(`การอัพโหลดไฟล์ล้มเหลว: ${uploadError instanceof Error ? uploadError.message : 'ไม่ทราบสาเหตุ'}`);
        } finally {
          setIsUploading(false);
        }
      }

      // ส่งข้อมูลไปยัง API
      const response = await fetch('/api/repair-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          printerModel: isOtherModel ? customModel : printerModel,
          serialNumber,
          customerName,
          customerPhone,
          customerEmail,
          customerAddress,
          issueDesc,
          accessories,
          contactInfo,
          notes,
          images: imageUrls
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'เกิดข้อผิดพลาดในการสร้างคำขอซ่อม');
      }

      const data = await response.json();
      setSuccess(`สร้างคำขอซ่อมเรียบร้อยแล้ว (ID: ${data.repairRequestId})`);
      setShowConfirmation(false);
      
      // รีเซ็ตฟอร์ม
      resetForm();

    } catch (error) {
      console.error('Error creating repair request:', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setPrinterModel("");
    setPrinterBrand("");
    setCustomModel("");
    setCustomBrand("");
    setSerialNumber("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerAddress("");
    setIssueDesc("");
    setAccessories("");
    setContactInfo("");
    setNotes("");
    setAttachments([]);
    setUploadedImages([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
    
    const validFiles = files.filter(file => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isValidMimeType = allowedTypes.includes(file.type);
      const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension);
      
      if (!isValidMimeType && !isValidExtension) {
        console.warn('Invalid file type:', {
          name: file.name,
          type: file.type,
          extension: fileExtension
        });
        return false;
      }
      return true;
    });
    
    if (validFiles.length !== files.length) {
      setError('มีไฟล์บางไฟล์ที่ไม่รองรับ กรุณาเลือกไฟล์ JPG, PNG, GIF, WEBP, หรือ PDF เท่านั้น');
    }
    
    setAttachments([...attachments, ...validFiles.slice(0, 5 - attachments.length)]);
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
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-lg">
                <Printer className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700 bg-clip-text text-transparent">
                Printer Repair Request Form
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  <span className="font-medium">เกิดข้อผิดพลาด:</span>
                </div>
                <p className="mt-1">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">สำเร็จ:</span>
                </div>
                <p className="mt-1">{success}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Printer Information */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2 border-b border-blue-200 pb-2">
                  <Printer className="h-5 w-5" />
                  Printer Information
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Required</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serial" className="text-sm font-semibold text-blue-800">Serial Number *</Label>
                    <Input
                      id="serial"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="Enter printer serial number"
                      className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-sm font-semibold text-blue-800">Printer Model *</Label>
                    <Select
                      value={printerModel}
                      onValueChange={setPrinterModel}
                      required={!isOtherModel}
                    >
                      <SelectTrigger className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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
                        className="mt-2 border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-sm font-semibold text-blue-800">Printer Brand</Label>
                    <Select
                      value={printerBrand}
                      onValueChange={setPrinterBrand}
                    >
                      <SelectTrigger className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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
                        className="mt-2 border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty" className="text-sm font-semibold text-blue-800">Warranty Status</Label>
                    <Select>
                      <SelectTrigger className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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

              {/* Problem Description & Attachments Side by Side */}
              <section className="flex flex-col lg:flex-row gap-8">
                {/* Problem Description - Left */}
                <div className="flex-1 space-y-4">
                  <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2 border-b border-blue-200 pb-2">
                    <FileText className="h-5 w-5" />
                    Problem Description
                  </h2>
                  <div className="space-y-2">
                    <Textarea
                      id="symptoms"
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      placeholder="Describe the printer issue in detail (e.g., paper jam, ink error, not printing)..."
                      className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-[195px]"
                      required
                    />
                  </div>
                </div>

                {/* Attachments - Right */}
                <div className="flex-1 space-y-4">
                  <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2 border-b border-blue-200 pb-2">
                    <Upload className="h-5 w-5" />
                    Attachments
                  </h2>
                  <div
                    className="border-2 border-dashed border-blue-300 bg-blue-50/40 rounded-xl p-6 text-center hover:bg-blue-100/60 transition-all duration-300 shadow-lg shadow-green-200/50 flex flex-col items-center justify-center min-h-[150px]"
                    style={{ boxShadow: '0 0 12px rgba(34, 44, 120, 0.25)' }}
                  >
                    <Upload className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                    <p className="text-slate-700 font-medium text-sm mb-1">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-slate-500 mb-3">
                      JPG, PNG, GIF, WEBP, PDF • Max 5 files
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button variant="outline" asChild className="border border-blue-500 text-blue-700 hover:bg-green-100 text-xs px-3 py-1.5">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Select Files
                      </label>
                    </Button>
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-green-700">Uploaded Files</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gradient-to-r from-green-100/70 to-emerald-100/70 rounded-lg border border-green-200 shadow-sm"
                          >
                            <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="text-slate-500 hover:text-red-600 p-1"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Customer Information */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2 border-b border-blue-200 pb-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name" className="text-sm font-semibold text-blue-800">Customer Name *</Label>
                    <Input
                      id="customer-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone" className="text-sm font-semibold text-blue-800">Phone Number *</Label>
                    <Input
                      id="customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email" className="text-sm font-semibold text-blue-800">Email Address</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-address" className="text-sm font-semibold text-blue-800">Address</Label>
                    <Input
                      id="customer-address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Enter address"
                      className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold text-blue-800">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information about the printer or location..."
                    rows={3}
                    className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  ยืนยันการสร้างคำขอซ่อม
                </DialogTitle>
              </div>
              <DialogDescription className="text-base text-slate-600">
                คุณแน่ใจหรือไม่ที่จะสร้างคำขอซ่อมนี้? ระบบจะสร้าง ID คำขอซ่อมใหม่และแจ้งให้ช่างที่ได้รับมอบหมาย
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="border-2 border-slate-300 hover:bg-slate-100"
                disabled={isSubmitting}
              >
                ยกเลิก
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={isSubmitting || isUploading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? 'กำลังอัพโหลดไฟล์...' : 'กำลังสร้างคำขอซ่อม...'}
                  </>
                ) : (
                  'ยืนยันและสร้าง'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateRepair;