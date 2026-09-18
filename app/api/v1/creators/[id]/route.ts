import { NextRequest, NextResponse } from 'next/server';
import { getCreatorById, updateCreator } from '@/lib/db/queries';
import { z } from 'zod';

const UpdateCreatorSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().min(10).max(1000).optional(),
  location: z.string().max(100).optional(),
  avatar_url: z.string().url().optional(),
  cover_url: z.string().url().optional(),
  hourly_rate_equiv: z.number().min(0).max(1000).optional(),
  availability: z.enum(['available', 'busy', 'unavailable']).optional(),
  response_time: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const creator = getCreatorById(id);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    return NextResponse.json({ data: creator });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch creator', detail: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateCreatorSchema.parse(body);
    const updated = updateCreator(id, validated);
    if (!updated) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: error.issues }, { status: 422 });
    }
    return NextResponse.json({ error: 'Failed to update creator', detail: String(error) }, { status: 500 });
  }
}
