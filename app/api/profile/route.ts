// app/api/profile/route.ts
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        repairRequests: {
          where: { status: { not: "CLOSED" } },
          select: { id: true },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const roleMap: Record<string, string> = {
      MEMBER: "Member",
      SHOP: "Shop Owner",
      TECHNICIAN: "Technician",
      ADMIN: "Admin",
    };

    const activeRepairs = user.repairRequests.length;

    const profileData = {
      id: `USR${String(user.id).padStart(3, "0")}`,
      name: user.name || "Anonymous",
      email: user.email,
      phone: user.phone || "",
      role: roleMap[user.role] || "Member",
      department: user.role === "SHOP" ? "Management" : "General",
      address: "",
      joinDate: user.createdAt.toISOString().split("T")[0],
      avatar: user.image || "/api/placeholder/100/100",
      stats: {
        repairsManaged: activeRepairs,
        totalRevenue: "฿245,680",
        avgRating: 4.8,
        activeRepairs,
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        weeklyReports: true,
        language: "en",
        timezone: "Asia/Bangkok",
      },
    };

    return new Response(JSON.stringify(profileData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}