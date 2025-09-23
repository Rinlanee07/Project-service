import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// กำหนด type สำหรับ body ของ request
interface RequestBody {
  status?: string;
  remark?: string | null;
}

interface Params {
  id: string;
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const id = Number(params.id);
  const body: RequestBody = await req.json();

  const nextStatus = body.status ? String(body.status) : "";
  const remark = body.remark ? String(body.remark) : null;

  // ตรวจสอบว่ามี request หรือไม่
  const exists = await prisma.repairRequest.findUnique({ where: { id } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // อัปเดต status
  await prisma.repairRequest.update({
    where: { id },
    data: { status: nextStatus as any }, // Cast to any if RepairStatus is not imported
  });

  // อัปเดตหรือสร้าง remark
  if (remark) {
    let detail = await prisma.repairDetail.findUnique({
      where: { repairRequestId: id },
    });

    if (!detail) {
      detail = await prisma.repairDetail.create({
        data: { repairRequestId: id, notes: remark },
      });
    } else {
      await prisma.repairDetail.update({
        where: { id: detail.id },
        data: { notes: remark },
      });
    }
  }

  return NextResponse.json({ status: nextStatus });
}
