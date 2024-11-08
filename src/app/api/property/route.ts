import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { Property } from '@prisma/client';

interface DecodedToken extends JwtPayload {
  id: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      throw error;
    }

    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { name, desc, location, price, available } = await request.json();

    if (!name || !desc || !location || price === undefined || available === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const property: Property = await prisma.property.create({
      data: {
        name,
        desc,
        location,
        price,
        available,
        ownerId: userId,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const properties = await prisma.property.findMany();

    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
