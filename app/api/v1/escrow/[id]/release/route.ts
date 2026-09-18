import { NextRequest, NextResponse } from 'next/server';
import { releaseEscrow } from '@/lib/db/queries';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const released = releaseEscrow(id);
    if (!released) {
      return NextResponse.json({ error: 'Escrow item not found' }, { status: 404 });
    }
    return NextResponse.json({ data: released, message: 'Skill-credits released successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to release escrow', detail: String(error) }, { status: 500 });
  }
}
