import { NextRequest, NextResponse } from 'next/server';
import { createReview, getReviews } from '@/lib/db/queries';
import { z } from 'zod';

const CreateReviewSchema = z.object({
  reviewer_id: z.string().min(1),
  reviewee_id: z.string().min(1),
  brief_id: z.string().optional(),
  trade_quality: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5),
  timeliness: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
  skill_tags: z.string().optional(),
  would_trade_again: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateReviewSchema.parse(body);
    const overall = ((validated.trade_quality + validated.communication + validated.timeliness) / 3);
    const review = createReview({ ...validated, overall_rating: Math.round(overall * 10) / 10 });
    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: error.issues }, { status: 422 });
    }
    return NextResponse.json({ error: 'Failed to create review', detail: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');
    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId query param required' }, { status: 400 });
    }
    const reviews = getReviews(creatorId);
    return NextResponse.json({ data: reviews, total: reviews.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews', detail: String(error) }, { status: 500 });
  }
}
