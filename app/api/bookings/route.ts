import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/db/gigs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');

    const bookings = getBookings({ role, userId });
    return NextResponse.json(bookings);
  } catch (err: any) {
    console.error('Error fetching bookings:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gigId, clientName, notes, requestedDate, clientId } = body;

    if (!gigId) {
      return NextResponse.json({ error: 'gigId is required' }, { status: 400 });
    }
    if (!clientName || !clientName.trim()) {
      return NextResponse.json({ error: 'clientName is required' }, { status: 400 });
    }
    if (!notes || !notes.trim()) {
      return NextResponse.json({ error: 'Project scope/notes is required' }, { status: 400 });
    }
    if (!requestedDate || !requestedDate.trim()) {
      return NextResponse.json({ error: 'requestedDate is required' }, { status: 400 });
    }

    const newBooking = createBooking({
      gigId: gigId.trim(),
      clientName: clientName.trim(),
      notes: notes.trim(),
      requestedDate: requestedDate.trim(),
      clientId: clientId ? clientId.trim() : undefined,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (err: any) {
    console.error('Error creating booking:', err);
    return NextResponse.json({ error: err.message || 'Failed to create booking' }, { status: 500 });
  }
}
