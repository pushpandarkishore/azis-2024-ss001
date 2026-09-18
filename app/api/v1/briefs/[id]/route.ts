import { NextRequest, NextResponse } from 'next/server';
import { getBriefById } from '@/lib/db/queries';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const brief = getBriefById(id) as { content?: string } | null;
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }
    const parsed = brief.content ? { ...brief, content: JSON.parse(brief.content as string) } : brief;
    return NextResponse.json({ data: parsed });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brief', detail: String(error) }, { status: 500 });
  }
}
