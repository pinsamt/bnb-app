import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { Property, User } from '@prisma/client';

interface JwtPayload {
  id: string;
}

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const { id } = params;

    const property: Property | null = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve property' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const { id } = params;

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded: JwtPayload | undefined;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json({ error: 'Invalid or malformed token' }, { status: 401 });
      }

      throw error;
    }

    const userId = decoded?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, desc, location, price, available }: {
      name: string;
      desc: string;
      location: string;
      price: number;
      available: boolean;
    } = await request.json();

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check if user has permission to update the property
    if (property.ownerId !== userId && !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { name, desc, location, price, available },
    });

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const { id } = params;

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const userId = decoded.id;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Ensure user exists and handle the case where user may be null
    if (!user || (property.ownerId !== userId && !user.isAdmin)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.booking.deleteMany({ where: { propertyId: id } });
    await prisma.property.delete({ where: { id } });

    return NextResponse.json({ message: 'Property and related bookings deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}