import { NextResponse } from 'next/server';
import { prisma } from '@/generated/prisma/client'; // Adjust the import based on your Prisma client setup
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'อีเมลนี้ถูกใช้ไปแล้ว' }, { status: 409 });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}