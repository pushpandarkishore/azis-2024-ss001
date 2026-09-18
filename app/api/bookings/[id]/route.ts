import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus, getBookingById } from '@/lib/db/gigs';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { status, declineReason } = body;

    if (!status || (status !== 'Accepted' && status !== 'Declined')) {
      return NextResponse.json(
        { error: "Status must be either 'Accepted' or 'Declined'" },
        { status: 400 }
      );
    }

    const existing = getBookingById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updated = updateBookingStatus(id, status, declineReason);
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Error updating booking:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const booking = getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (err: any) {
    console.error('Error fetching booking:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch booking' }, { status: 500 });
  }
}
