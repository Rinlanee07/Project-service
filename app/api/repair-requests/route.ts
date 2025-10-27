import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";

// Singleton pattern for Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ======================
// GET: ใช้ในหน้าโปรไฟล์ (ไม่แก้ไข)
// ======================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  let whereClause: any = {};

  if (startDate && endDate) {
    whereClause.requestDate = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  try {
    const repairs = await prisma.repairRequest.findMany({
      where: whereClause,
      orderBy: { requestDate: "desc" },
      include: {
        customer: {
          select: { name: true, email: true },
        },
      },
    });

    return Response.json(repairs);
  } catch (error) {
    console.error("Error fetching repairs:", error);
    return Response.json({ error: "Failed to fetch repairs" }, { status: 500 });
  }
}

// ======================
// POST: สร้างคำขอซ่อมใหม่ (เพิ่มใหม่)
// ======================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      printerModel,
      serialNumber,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      issueDesc,
      accessories,
      contactInfo,
      notes,
      images = [],
    } = body;

    // ✅ ตรวจสอบ required fields
    if (!printerModel || !serialNumber || !customerEmail || !issueDesc) {
      return Response.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน (โมเดลเครื่องพิมพ์, เลขซีเรียล, อีเมล, อาการเสีย)" },
        { status: 400 }
      );
    }

    // ✅ ค้นหาหรือสร้างลูกค้า
    let customer = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!customer) {
      // สร้างลูกค้าใหม่ (role = MEMBER)
      customer = await prisma.user.create({
        data: {
          email: customerEmail,
          name: customerName || null,
          phone: customerPhone || null,
          password: "", // ⚠️ ถ้าไม่ใช้ระบบ login จริง ให้เก็บค่าว่างได้ชั่วคราว
          role: "MEMBER",
        },
      });
    } else {
      // อัปเดตข้อมูลลูกค้า (ถ้ามีการเปลี่ยนแปลง)
      customer = await prisma.user.update({
        where: { id: customer.id },
        data: {
          name: customerName || customer.name,
          phone: customerPhone || customer.phone,
        },
      });
    }

    // ✅ สร้าง RepairRequest
    const repairRequest = await prisma.repairRequest.create({
      data: {
        printerModel,
        serialNumber,
        customerId: customer.id,
        address: customerAddress || null,
        issueDesc,
        accessories: accessories || null,
        contactInfo: contactInfo || null,
        status: "PENDING",
        // requestDate จะถูกตั้งอัตโนมัติจาก @default(now())
      },
    });

    // ✅ บันทึกภาพ (ถ้ามี)
    if (Array.isArray(images) && images.length > 0) {
      await prisma.repairImage.createMany({
        data: images.map((url: string) => ({
          repairRequestId: repairRequest.id,
          url,
        })),
      });
    }

    // ✅ สร้าง RepairDetail (ถ้ามี notes)
    if (notes) {
      await prisma.repairDetail.create({
        data: {
          repairRequestId: repairRequest.id,
          notes,
        },
      });
    }

    // ✅ ส่งกลับ ID คำขอซ่อม
    return Response.json(
      { repairRequestId: repairRequest.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/repair-requests:", error);

    // ✅ รับประกันว่าส่ง JSON กลับเสมอ → ป้องกัน client error
    return Response.json(
      { error: "เกิดข้อผิดพลาดในการสร้างคำขอซ่อม กรุณาลองอีกครั้ง" },
      { status: 500 }
    );
  }
}