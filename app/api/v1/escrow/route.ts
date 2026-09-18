import { NextRequest, NextResponse } from 'next/server';
import { createEscrowItem, getEscrowItems } from '@/lib/db/queries';
import { z } from 'zod';

const CreateEscrowSchema = z.object({
  brief_id: z.string().min(1),
  title: z.string().min(2).max(200),
  description: z.string().max(500).optional().default(''),
  assigned_to: z.string().min(1),
  skill_credits: z.number().int().min(0).max(500),
  due_date: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateEscrowSchema.parse(body);
    const item = createEscrowItem(validated);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: error.issues }, { status: 422 });
    }
    return NextResponse.json({ error: 'Failed to create escrow item', detail: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const briefId = searchParams.get('briefId');
    if (!briefId) {
      return NextResponse.json({ error: 'briefId query param required' }, { status: 400 });
    }
    const items = getEscrowItems(briefId);
    return NextResponse.json({ data: items, total: items.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch escrow items', detail: String(error) }, { status: 500 });
  }
}
