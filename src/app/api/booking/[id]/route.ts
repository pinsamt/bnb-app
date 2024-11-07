import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import based on your project structure
import { Booking} from '@prisma/client';

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const { id } = params;

  const booking: Booking | null = await prisma.booking.findUnique({
    where: { id },
    include: {
      madeBy: true,
      property: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function PUT(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const { id } = params;
  const body: { checkInDate: string; checkOutDate: string; totalPrice: number; madeById: string; propertyId: string } = await request.json();

  const updatedBooking: Booking = await prisma.booking.update({
    where: { id },
    data: {
      checkInDate: new Date(body.checkInDate),
      checkOutDate: new Date(body.checkOutDate),
      totalPrice: body.totalPrice,
      madeById: body.madeById,
      propertyId: body.propertyId,
    },
  });

  return NextResponse.json(updatedBooking);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const { id } = params;

  await prisma.booking.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Booking deleted successfully' });
}
