import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt, {JsonWebTokenError, JwtPayload} from 'jsonwebtoken';
import { Booking } from '@prisma/client';

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

    const madeById= decoded.id;


    const body = await request.json() as { checkInDate: string; checkOutDate: string; totalPrice: number; propertyId: string };
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
