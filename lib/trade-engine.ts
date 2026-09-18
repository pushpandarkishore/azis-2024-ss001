import { TradeScope, TradeEvaluation } from './db/queries';

// Skill Difficulty Coefficients (SDC)
const SKILL_DIFFICULTY: Record<string, number> = {
  'motion-graphics': 1.7,
  '3d-animation': 1.7,
  'audio-engineering': 1.6,
  'music-production': 1.6,
  'ui-ux-design': 1.5,
  'brand-identity': 1.4,
  'logo-design': 1.4,
  'video-editing': 1.3,
  'color-grading': 1.3,
  'illustration': 1.3,
  'character-design': 1.3,
  'photography': 1.2,
  'photo-editing': 1.1,
  'copywriting': 1.2,
  'content-strategy': 1.15,
  'social-media': 1.1,
  'podcast-production': 1.2,
  'voice-over': 1.15,
  'graphic-design': 1.2,
  'web-development': 1.4,
  'default': 1.0,
};

const COMPLEXITY_MULTIPLIER: Record<string, number> = {
  low: 0.8,
  medium: 1.0,
  high: 1.3,
  expert: 1.7,
};

export function getSDC(skill: string): number {
  const normalized = skill.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  for (const key of Object.keys(SKILL_DIFFICULTY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return SKILL_DIFFICULTY[key];
    }
  }
  return SKILL_DIFFICULTY['default'];
}

export function calculateMSI(scarcityScore?: number): number {
  // If a custom scarcity score provided (0–1 range = supply density), compute MSI
  // Otherwise use a default mid-tier scarcity
  const supplyDensity = scarcityScore !== undefined ? Math.max(0.01, Math.min(1, scarcityScore)) : 0.3;
  const msi = 1 / (supplyDensity * 0.8 + 0.2);
  return Math.max(0.2, Math.min(5.0, msi));
}

export function calculateLEU(scope: TradeScope): number {
  const sdc = getSDC(scope.skill);
  const complexityMult = COMPLEXITY_MULTIPLIER[scope.complexity] ?? 1.0;
  const revisionPremium = 1 + scope.revisions * 0.07;
  const deliverableComplexity = Math.log(1 + scope.deliverables.length) * 0.5 + 1;

  return scope.hours * sdc * complexityMult * revisionPremium * deliverableComplexity;
}

export function evaluateTrade(offerScope: TradeScope, requestScope: TradeScope): TradeEvaluation {
  const leuA = calculateLEU(offerScope);
  const leuB = calculateLEU(requestScope);

  const msiA = calculateMSI(offerScope.scarcityScore);
  const msiB = calculateMSI(requestScope.scarcityScore);

  const tvsA = leuA * msiA;
  const tvsB = leuB * msiB;

  const equivalenceRatio = tvsA / Math.max(tvsB, 0.001);
  const fairnessScore = 1 - Math.abs(1 - equivalenceRatio) / Math.max(equivalenceRatio, 1);

  let recommendation: string;
  const adjustmentSuggestions: string[] = [];

  if (fairnessScore >= 0.80) {
    recommendation = 'Fair Exchange — both parties contribute equivalent value. Proceed with trade.';
  } else if (fairnessScore >= 0.60) {
    recommendation = 'Slight Imbalance — consider adding deliverables or reducing scope on the higher-value side.';
    if (equivalenceRatio > 1) {
      adjustmentSuggestions.push(`Reduce ${offerScope.skill} scope by ~${Math.round((1 - 1 / equivalenceRatio) * 100)}%`);
      adjustmentSuggestions.push(`Add 1–2 extra revisions to ${requestScope.skill} offering`);
    } else {
      adjustmentSuggestions.push(`Reduce ${requestScope.skill} scope by ~${Math.round((1 - equivalenceRatio) * 100)}%`);
      adjustmentSuggestions.push(`Add 1–2 extra revisions to ${offerScope.skill} offering`);
    }
  } else {
    recommendation = 'Significant Imbalance — this trade is unlikely to feel equitable. Restructure one or both scopes.';
    if (equivalenceRatio > 1) {
      adjustmentSuggestions.push(`${offerScope.skill} offers ${Math.round(equivalenceRatio * 100 - 100)}% more value — reduce hours or complexity`);
      adjustmentSuggestions.push(`${requestScope.skill} should add more deliverables or increase complexity rating`);
    } else {
      adjustmentSuggestions.push(`${requestScope.skill} offers ${Math.round((1 / equivalenceRatio) * 100 - 100)}% more value — reduce hours or complexity`);
      adjustmentSuggestions.push(`${offerScope.skill} should add more deliverables or increase complexity rating`);
    }
  }

  return {
    equivalenceRatio: Math.round(equivalenceRatio * 100) / 100,
    fairnessScore: Math.round(fairnessScore * 100) / 100,
    laborUnitsA: Math.round(leuA * 100) / 100,
    laborUnitsB: Math.round(leuB * 100) / 100,
    scarcityAdjustedA: Math.round(tvsA * 100) / 100,
    scarcityAdjustedB: Math.round(tvsB * 100) / 100,
    recommendation,
    adjustmentSuggestions,
  };
}

export function computeMatchScore(
  querySkills: string[],
  creatorSkills: string[],
  portfolioDescriptions: string[],
  reviewCount: number,
  averageRating: number
): number {
  // Tag overlap (25%)
  const queryLower = querySkills.map(s => s.toLowerCase());
  const creatorLower = creatorSkills.map(s => s.toLowerCase());
  const overlap = queryLower.filter(q => creatorLower.some(c => c.includes(q) || q.includes(c))).length;
  const tagScore = queryLower.length > 0 ? Math.min(overlap / queryLower.length, 1) : 0.5;

  // Portfolio relevance (simulated without embeddings — keyword match; 65%)
  const portfolioText = portfolioDescriptions.join(' ').toLowerCase();
  const portfolioMatches = queryLower.filter(q => portfolioText.includes(q)).length;
  const portfolioScore = queryLower.length > 0 ? Math.min(portfolioMatches / queryLower.length, 1) : 0.5;

  // Review score (10%)
  const normalizedRating = averageRating > 0 ? averageRating / 5 : 0.5;

  // Cold-start bonus
  const coldStartBonus = reviewCount < 3 ? 0.05 : 0;

  return Math.min(
    portfolioScore * 0.65 + tagScore * 0.25 + normalizedRating * 0.10 + coldStartBonus,
    1.0
  );
}
