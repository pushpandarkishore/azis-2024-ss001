import { NextRequest, NextResponse } from 'next/server';
import { evaluateTrade } from '@/lib/trade-engine';
import { z } from 'zod';

const TradeScopeSchema = z.object({
  skill: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  hours: z.number().min(0.5).max(200),
  revisions: z.number().int().min(0).max(10),
  complexity: z.enum(['low', 'medium', 'high', 'expert']),
  deliverables: z.array(z.string().min(1).max(200)).min(1).max(10),
  scarcityScore: z.number().min(0.01).max(1).optional(),
});

const EvaluateTradeSchema = z.object({
  offerScope: TradeScopeSchema,
  requestScope: TradeScopeSchema,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerScope, requestScope } = EvaluateTradeSchema.parse(body);

    const evaluation = evaluateTrade(offerScope, requestScope);

    return NextResponse.json({
      data: {
        ...evaluation,
        input: { offerScope, requestScope },
        metadata: {
          model: 'LEU×MSI v1.0',
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: error.issues }, { status: 422 });
    }
    return NextResponse.json({ error: 'Evaluation failed', detail: String(error) }, { status: 500 });
  }
}
