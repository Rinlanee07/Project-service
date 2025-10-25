import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 400 });
    }

    // ตรวจสอบประเภทไฟล์ - ใช้การตรวจสอบที่ยืดหยุ่นมากขึ้น
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf'
    ];
    
    // ตรวจสอบ MIME type และ file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
    
    const isValidMimeType = allowedTypes.includes(file.type);
    const isValidExtension = fileExt && allowedExtensions.includes(fileExt);
    
    if (!isValidMimeType && !isValidExtension) {
      console.log('File type check failed:', {
        mimeType: file.type,
        extension: fileExt,
        fileName: file.name
      });
      
      return NextResponse.json(
        { error: 'ประเภทไฟล์ไม่ถูกต้อง อนุญาตเฉพาะ JPG, PNG, GIF, WEBP, PDF' },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'ขนาดไฟล์ใหญ่เกินไป (สูงสุด 5MB)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้างโฟลเดอร์ uploads ถ้าไม่มี
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // สร้างชื่อไฟล์ที่ไม่ซ้ำ
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // ส่งกลับ URL ของไฟล์
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      size: file.size
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์' },
      { status: 500 }
    );
  }
}
