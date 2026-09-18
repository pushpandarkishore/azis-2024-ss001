import { NextRequest, NextResponse } from 'next/server';
import { getCreatorById, createBrief } from '@/lib/db/queries';
import { generateBriefWithAI, generateFallbackBrief } from '@/lib/ai/gemini';
import getDb from '@/lib/db/client';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const BriefRequestSchema = z.object({
  creatorAId: z.string().min(1),
  creatorBId: z.string().min(1),
  offerScope: z.object({
    skill: z.string(),
    hours: z.number(),
    complexity: z.string(),
    deliverables: z.array(z.string()),
  }).optional(),
  requestScope: z.object({
    skill: z.string(),
    hours: z.number(),
    complexity: z.string(),
    deliverables: z.array(z.string()),
  }).optional(),
  tradeRequestId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorAId, creatorBId, offerScope, requestScope, tradeRequestId } = BriefRequestSchema.parse(body);

    const creatorA = getCreatorById(creatorAId);
    const creatorB = getCreatorById(creatorBId);

    if (!creatorA) return NextResponse.json({ error: 'Creator A not found' }, { status: 404 });
    if (!creatorB) return NextResponse.json({ error: 'Creator B not found' }, { status: 404 });

    const creatorASkill = creatorA.skills?.[0]?.name || 'Creative Services';
    const creatorBSkill = creatorB.skills?.[0]?.name || 'Creative Services';

    let briefData;
    try {
      briefData = await generateBriefWithAI({
        creatorAName: creatorA.name,
        creatorASkill,
        creatorABio: creatorA.bio || '',
        creatorBName: creatorB.name,
        creatorBSkill,
        creatorBBio: creatorB.bio || '',
        offerScope,
        requestScope,
      });
    } catch {
      briefData = generateFallbackBrief(creatorA.name, creatorASkill, creatorB.name, creatorBSkill);
    }

    const briefId = uuidv4();
    const expiresAt = new Date(Date.now() + briefData.totalDurationDays * 24 * 60 * 60 * 1000).toISOString();

    const brief = createBrief({
      id: briefId,
      trade_request_id: tradeRequestId,
      creator_a_id: creatorAId,
      creator_b_id: creatorBId,
      title: briefData.title,
      content: JSON.stringify(briefData),
      expires_at: expiresAt,
    });

    return NextResponse.json({
      data: {
        brief,
        content: briefData,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: error.issues }, { status: 422 });
    }
    return NextResponse.json({ error: 'Brief generation failed', detail: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');
    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId query param required' }, { status: 400 });
    }
    const db = getDb();
    const briefs = db.prepare(
      'SELECT * FROM briefs WHERE creator_a_id = ? OR creator_b_id = ? ORDER BY created_at DESC'
    ).all(creatorId, creatorId);

    return NextResponse.json({ data: briefs, total: briefs.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch briefs', detail: String(error) }, { status: 500 });
  }
}
