import { NextRequest, NextResponse } from 'next/server';
import { listCreators, searchCreators } from '@/lib/db/queries';
import { computeMatchScore } from '@/lib/trade-engine';
import { semanticMatchWithAI } from '@/lib/ai/gemini';
import { z } from 'zod';

const MatchSchema = z.object({
  query: z.string().min(1).max(500),
  creatorId: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
  limit: z.number().int().min(1).max(20).optional().default(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, skills, limit } = MatchSchema.parse(body);

    // Get all creators
    const allCreators = listCreators({ limit: 50 });

    // Extract query skills from the text query
    const queryTerms = [...skills, ...query.toLowerCase().split(/\s+/).filter(w => w.length > 3)];

    // Try AI semantic matching first, fall back to algorithmic
    let aiMatches: Array<{ creatorId: string; matchConfidence: number; rationale: string; complementarySkills: string[] }> = [];

    if (process.env.GEMINI_API_KEY) {
      const creatorSummaries = allCreators.map(c => ({
        id: c.id,
        name: c.name,
        skills: (c.skills || []).map(s => s.name).join(', '),
        bio: c.bio?.slice(0, 200) || '',
        portfolio: (c.portfolio_items || []).map(p => p.title + ': ' + p.description?.slice(0, 100)).join(' | '),
      }));
      aiMatches = await semanticMatchWithAI(query, creatorSummaries);
    }

    // Algorithmic scoring for all creators
    const algorithmicMatches = allCreators.map(creator => {
      const creatorSkills = (creator.skills || []).map(s => s.name);
      const portfolioDescs = (creator.portfolio_items || []).map(p => `${p.title} ${p.description} ${p.tools_used}`);
      const score = computeMatchScore(queryTerms, creatorSkills, portfolioDescs, creator.review_count, creator.average_rating);

      // Merge with AI score if available
      const aiMatch = aiMatches.find(m => m.creatorId === creator.id);
      const finalScore = aiMatch
        ? aiMatch.matchConfidence * 0.5 + score * 0.5
        : score;

      const complementarySkills = aiMatch?.complementarySkills || creatorSkills.filter(s =>
        queryTerms.some(t => s.toLowerCase().includes(t) || t.includes(s.toLowerCase()))
      );

      const rationale = aiMatch?.rationale || generateRationale(creator.name, creatorSkills, queryTerms, finalScore);

      return {
        creator,
        matchConfidence: Math.round(finalScore * 100) / 100,
        complementarySkills,
        rationale,
      };
    });

    const sorted = algorithmicMatches
      .filter(m => m.matchConfidence > 0.1)
      .sort((a, b) => b.matchConfidence - a.matchConfidence)
      .slice(0, limit);

    return NextResponse.json({
      data: sorted,
      query,
      total: sorted.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: error.issues }, { status: 422 });
    }
    return NextResponse.json({ error: 'Match failed', detail: String(error) }, { status: 500 });
  }
}

function generateRationale(name: string, skills: string[], queryTerms: string[], score: number): string {
  const matched = skills.filter(s => queryTerms.some(t => s.toLowerCase().includes(t) || t.includes(s.toLowerCase())));
  if (matched.length > 0) {
    return `${name} specializes in ${matched.join(', ')} which directly matches your needs. Score: ${Math.round(score * 100)}%`;
  }
  return `${name}'s portfolio shows relevant expertise for your requirements. Match confidence: ${Math.round(score * 100)}%`;
}
