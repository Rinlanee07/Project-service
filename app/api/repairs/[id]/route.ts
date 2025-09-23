import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

interface Params { id: string }

export async function GET(_req: NextRequest, { params }: { params: Params }) {
	const id = Number(params.id);
	const item = await prisma.repairRequest.findUnique({
		where: { id },
		include: {
			customer: true,
			details: { include: { parts: true, technician: true } },
			images: true,
			shipping: true,
			closedJob: true,
		},
	});
	if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
	return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
	const id = Number(params.id);
	const body = await req.json();
	const nextParts = Array.isArray(body.parts) ? body.parts : [];

	let detail = await prisma.repairDetail.findUnique({ where: { repairRequestId: id } });
	if (!detail) {
		detail = await prisma.repairDetail.create({ data: { repairRequestId: id } });
	}

	await prisma.repairPart.deleteMany({ where: { detailId: detail.id } });
	if (nextParts.length) {
		await prisma.repairPart.createMany({
			data: nextParts.map((p: any) => ({ detailId: detail.id, partName: String(p.partName || ""), price: Number(p.price || 0), quantity: Number(p.quantity || 1) })),
		});
	}

	const updated = await prisma.repairRequest.findUnique({
		where: { id },
		include: { details: { include: { parts: true } } },
	});
	return NextResponse.json(updated);
} 