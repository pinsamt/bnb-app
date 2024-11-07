import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { Booking } from '@prisma/client';

interface JwtPayload {
  id: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const madeById = decoded.id;

    const body: { checkInDate: string; checkOutDate: string; totalPrice: number; propertyId: string } = await request.json();
    const { checkInDate, checkOutDate, totalPrice, propertyId } = body;

    const booking: Booking = await prisma.booking.create({
      data: {
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        totalPrice,
        madeById,
        propertyId,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const bookings: Booking[] = await prisma.booking.findMany({
      include: {
        madeBy: true,
        property: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
