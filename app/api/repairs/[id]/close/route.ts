import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

interface Params { id: string }

export async function POST(req: NextRequest, { params }: { params: Params }) {
	const id = Number(params.id);
	const body = await req.json();
	const exists = await prisma.repairRequest.findUnique({ where: { id } });
	if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

	const close = await prisma.closeRepair.upsert({
		where: { repairRequestId: id },
		create: {
			repairRequestId: id,
			finishedDate: new Date(body.finishedDate || new Date().toISOString()),
			receivedDate: body.receivedDate ? new Date(body.receivedDate) : null,
			receiptUrl: null,
		},
		update: {
			finishedDate: new Date(body.finishedDate || new Date().toISOString()),
			receivedDate: body.receivedDate ? new Date(body.receivedDate) : null,
		},
	});

	await prisma.repairRequest.update({ where: { id }, data: { status: "CLOSED" } });
	return NextResponse.json({ status: "CLOSED", close });
} 