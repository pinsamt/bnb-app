import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/app/utils/bcrypt';

const prisma = new PrismaClient();

interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { email, password, name }: RegisterUserRequest = await request.json();

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isAdmin: false,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'User already exists or invalid data' }, { status: 400 });
  }
}
