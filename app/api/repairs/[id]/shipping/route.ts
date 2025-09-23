import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

interface Params { id: string }

export async function POST(req: NextRequest, { params }: { params: Params }) {
	const id = Number(params.id);
	const body = await req.json();
	const exists = await prisma.repairRequest.findUnique({ where: { id } });
	if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

	const payload = {
		company: String(body.company || ""),
		trackingNumber: String(body.trackingNumber || ""),
		sentDate: new Date(body.sentDate || new Date().toISOString()),
		status: body.status ? String(body.status) : null,
	};

	const upserted = await prisma.shipping.upsert({
		where: { repairRequestId: id },
		create: { repairRequestId: id, ...payload },
		update: payload,
	});
	return NextResponse.json(upserted);
} 