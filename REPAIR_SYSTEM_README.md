# ระบบจัดการคำขอซ่อมเครื่องพิมพ์

## ฟีเจอร์ที่เพิ่มเข้ามา

### 1. API Routes
- **POST /api/repair-requests** - สร้างคำขอซ่อมใหม่
- **GET /api/repair-requests** - ดึงรายการคำขอซ่อมทั้งหมด
- **POST /api/upload** - อัพโหลดไฟล์รูปภาพ

### 2. หน้า Create Repair
- เชื่อมต่อกับฐานข้อมูล Prisma
- รองรับการอัพโหลดไฟล์รูปภาพ
- Form validation และ error handling
- Loading states และ success messages

### 3. ฐานข้อมูล
ใช้ Prisma ORM กับ PostgreSQL โดยมี models:
- **User** - ข้อมูลผู้ใช้ (ลูกค้า, ช่าง, ร้าน, แอดมิน)
- **RepairRequest** - คำขอซ่อม
- **RepairImage** - รูปภาพที่แนบมา
- **RepairDetail** - รายละเอียดการซ่อม
- **RepairPart** - อะไหล่ที่ใช้
- **Shipping** - ข้อมูลการจัดส่ง
- **CloseRepair** - การปิดงาน

## การใช้งาน

### 1. การสร้างคำขอซ่อม
1. กรอกข้อมูลเครื่องพิมพ์ (รุ่น, หมายเลขซีเรียล)
2. อธิบายปัญหาที่พบ
3. อัพโหลดรูปภาพ (ถ้ามี)
4. กรอกข้อมูลลูกค้า
5. กดปุ่ม "Create Repair Request"

### 2. การอัพโหลดไฟล์
- รองรับไฟล์: JPG, PNG, GIF, PDF
- ขนาดสูงสุด: 5MB
- จำนวนสูงสุด: 5 ไฟล์

### 3. การจัดการข้อมูล
- ระบบจะสร้าง User ใหม่ถ้าไม่มีในระบบ
- บันทึกข้อมูลลงฐานข้อมูล PostgreSQL
- สร้าง RepairRequest พร้อมกับ RepairImage

## การติดตั้งและรัน

1. ติดตั้ง dependencies:
```bash
npm install
```

2. ตั้งค่า environment variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

3. รัน Prisma migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

4. รัน development server:
```bash
npm run dev
```

## โครงสร้างไฟล์

```
app/
├── api/
│   ├── repair-requests/
│   │   └── route.ts          # API สำหรับจัดการคำขอซ่อม
│   └── upload/
│       └── route.ts          # API สำหรับอัพโหลดไฟล์
├── dashboard/
│   └── create-repair/
│       └── page.tsx          # หน้าสร้างคำขอซ่อม
└── generated/
    └── prisma/               # Prisma client
public/
└── uploads/                  # ไฟล์ที่อัพโหลด
prisma/
└── schema.prisma             # Prisma schema
```

## การพัฒนาต่อ

1. เพิ่มระบบ authentication
2. เพิ่มหน้าแสดงรายการคำขอซ่อม
3. เพิ่มระบบแจ้งเตือน
4. เพิ่มระบบรายงาน
5. เพิ่มระบบการจัดการช่าง
