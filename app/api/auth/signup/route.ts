import { PrismaClient } from '@/app/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// POST /api/auth/signup
export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // เช็คว่ามี email อยู่แล้วหรือยัง
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 409 }
      )
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // สร้าง user ใหม่
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    return new Response(JSON.stringify({ message: 'User created', user }), {
      status: 201,
    })
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: 'User could not be created' }),
      { status: 500 }
    )
  }
}

// ตัวอย่างรองรับ GET (เช็ค API alive)
export async function GET() {
  return new Response(JSON.stringify({ message: 'Signup API is running' }), {
    status: 200,
  })
}
