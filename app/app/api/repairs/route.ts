import { NextResponse } from 'next/server';
import { prisma } from '../../../generated/prisma/client'; // Adjust the import path as necessary

export async function GET(request: Request) {
  try {
    const repairs = await prisma.repair.findMany();
    return NextResponse.json(repairs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch repairs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const newRepair = await prisma.repair.create({
      data: body,
    });
    return NextResponse.json(newRepair, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create repair' }, { status: 500 });
  }
}