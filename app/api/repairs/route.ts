import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const role = token?.role as string | undefined;
	const userId = token?.id as string | number | undefined;

	let where: any = {};
	if (role === "MEMBER") {
		where = { customerId: Number(userId) || -1 };
	}
	// SHOP/TECHNICIAN/ADMIN see all for now; extend with shop scoping if needed

	const repairs = await prisma.repairRequest.findMany({
		where,
		include: {
			customer: true,
			details: { include: { parts: true, technician: true } },
			shipping: true,
			closedJob: true,
		},
		orderBy: { requestDate: "desc" },
	});
	return NextResponse.json(repairs);
}

export async function POST(req: NextRequest) {
	const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const role = token?.role as string | undefined;
	const userId = token?.id as string | number | undefined;

	const form = await req.formData();
	const printerModel = String(form.get("printerModel") || "").trim();
	const serialNumber = String(form.get("serialNumber") || "").trim();
	const address = String(form.get("address") || "").trim();
	const issueDesc = String(form.get("issueDesc") || "").trim();
	const accessories = form.get("accessories") ? String(form.get("accessories")) : null;
	const requestDateIso = String(form.get("requestDate") || new Date().toISOString());
	const contactInfo = form.get("contactInfo") ? String(form.get("contactInfo")) : null;

	if (!printerModel || !serialNumber || !issueDesc) {
		return NextResponse.json({ error: "invalid_input" }, { status: 400 });
	}

	let customerId = Number(form.get("customerId"));
	if (role === "MEMBER") customerId = Number(userId);
	if (!customerId || Number.isNaN(customerId)) {
		return NextResponse.json({ error: "missing_customer" }, { status: 400 });
	}

	const created = await prisma.repairRequest.create({
		data: {
			printerModel,
			serialNumber,
			customerId,
			address: address || null,
			issueDesc,
			accessories,
			requestDate: new Date(requestDateIso),
			contactInfo,
			status: "PENDING",
		},
	});

	// Image uploads are skipped; integrate storage and create RepairImage records here later

	return NextResponse.json({ id: created.id }, { status: 201 });
} 