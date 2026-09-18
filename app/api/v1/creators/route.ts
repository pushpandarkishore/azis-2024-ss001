import { NextRequest, NextResponse } from 'next/server';
import { listCreators, createCreator, searchCreators } from '@/lib/db/queries';
import seed from '@/lib/db/seed';
import { z } from 'zod';

const CreateCreatorSchema = z.object({
  name: z.string().min(2).max(100),
  username: z.string().min(2).max(50).regex(/^[a-z0-9_-]+$/),
  email: z.string().email(),
  bio: z.string().min(10).max(1000).optional().default(''),
  location: z.string().max(100).optional().default(''),
  avatar_url: z.string().url().optional().default(''),
  cover_url: z.string().url().optional().default(''),
  hourly_rate_equiv: z.number().min(0).max(1000).optional().default(0),
  availability: z.enum(['available', 'busy', 'unavailable']).optional().default('available'),
  response_time: z.string().optional().default('24h'),
  verified: z.boolean().optional().default(false),
});

// Auto-seed on first request
let seeded = false;
async function ensureSeeded() {
  if (!seeded) {
    try { await seed(); seeded = true; } catch { seeded = true; }
  }
}

export async function GET(req: NextRequest) {
  await ensureSeeded();
  try {
    const { searchParams } = new URL(req.url);
    const skill = searchParams.get('skill') || undefined;
    const availability = searchParams.get('availability') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');
    const query = searchParams.get('q') || undefined;

    let creators;
    if (query) {
      creators = searchCreators(query);
    } else {
      creators = listCreators({ skill, availability, limit, offset });
    }

    return NextResponse.json({
      data: creators,
      total: creators.length,
      limit,
      offset,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch creators', detail: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const body = await req.json();
    const validated = CreateCreatorSchema.parse(body);
    const creator = createCreator(validated);
    return NextResponse.json({ data: creator }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: error.issues }, { status: 422 });
    }
    return NextResponse.json({ error: 'Failed to create creator', detail: String(error) }, { status: 500 });
  }
}
