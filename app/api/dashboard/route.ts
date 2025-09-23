import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const role = token?.role as string | undefined;
	const userId = token?.id as string | number | undefined;

	let where: any = {};
	if (role === "MEMBER") where.customerId = Number(userId) || -1;

	const [repairs, counts] = await Promise.all([
		prisma.repairRequest.findMany({
			where,
			include: { customer: true },
			orderBy: { requestDate: "desc" },
			take: 15,
		}),
		prisma.repairRequest.groupBy({
			by: ["status"],
			where,
			_count: { _all: true },
		}),
	]);

	const statusCounts = counts.reduce<Record<string, number>>((acc, row) => {
		acc[row.status] = row._count._all;
		return acc;
	}, {});

	return NextResponse.json({ repairs, statusCounts });
}
