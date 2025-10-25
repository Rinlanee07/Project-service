// app/api/repair-requests/route.ts
import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";

// Singleton pattern (inline)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

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