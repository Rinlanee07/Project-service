// app/dashboard/page.tsx
import { PrismaClient } from "@/generated/prisma";
import DashboardClient from "../dashboard/DashboardClient";

// Singleton pattern (inline)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const DashboardPage = async () => {
  const statusCountsRaw = await prisma.repairRequest.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const defaultCounts = {
    PENDING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    WAITING_PARTS: 0,
    SHIPPED: 0,
  };

  const statusCounts = statusCountsRaw.reduce((acc, item) => {
    if (item.status in acc) {
      acc[item.status as keyof typeof acc] = item._count.status;
    }
    return acc;
  }, { ...defaultCounts });

  return <DashboardClient statusCounts={statusCounts} />;
};

export default DashboardPage;