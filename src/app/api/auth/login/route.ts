import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { comparePassword } from '@/app/utils/bcrypt';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  id: string;
  email: string;
  isAdmin?: boolean;
}

export async function POST(request: Request): Promise<NextResponse> {
  const { email, password }: { email: string; password: string } = await request.json();

  try {
    const user: User | null = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin } as JwtPayload, JWT_SECRET, {
      expiresIn: '1h',
    });

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
