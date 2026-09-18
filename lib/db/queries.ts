import { v4 as uuidv4 } from 'uuid';
import getDb from './client';

export interface Creator {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  avatar_url: string;
  cover_url: string;
  hourly_rate_equiv: number;
  availability: string;
  response_time: string;
  completed_trades: number;
  review_count: number;
  average_rating: number;
  skill_credits: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
  skills?: Skill[];
  portfolio_items?: PortfolioItem[];
  reviews?: Review[];
}

export interface Skill {
  id: string;
  creator_id: string;
  name: string;
  category: string;
  proficiency_level: string;
  years_experience: number;
  scarcity_score: number;
  is_primary: boolean;
}

export interface PortfolioItem {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  media_url: string;
  thumbnail_url: string;
  category: string;
  tools_used: string;
  client_type: string;
  embedding?: string;
  featured: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  brief_id?: string;
  trade_quality: number;
  communication: number;
  timeliness: number;
  overall_rating: number;
  comment: string;
  skill_tags?: string;
  would_trade_again: boolean;
  created_at: string;
}

export interface TradeScope {
  skill: string;
  category: string;
  hours: number;
  revisions: number;
  complexity: 'low' | 'medium' | 'high' | 'expert';
  deliverables: string[];
  scarcityScore?: number;
}

export interface TradeEvaluation {
  equivalenceRatio: number;
  fairnessScore: number;
  laborUnitsA: number;
  laborUnitsB: number;
  scarcityAdjustedA: number;
  scarcityAdjustedB: number;
  recommendation: string;
  adjustmentSuggestions: string[];
}

// Queries
export function listCreators(filters?: {
  skill?: string;
  availability?: string;
  limit?: number;
  offset?: number;
}): Creator[] {
  const db = getDb();
  let query = `SELECT * FROM creators`;
  const params: (string | number)[] = [];
  const conditions: string[] = [];

  if (filters?.availability) {
    conditions.push(`availability = ?`);
    params.push(filters.availability);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` ORDER BY average_rating DESC, completed_trades DESC`;
  query += ` LIMIT ? OFFSET ?`;
  params.push(filters?.limit ?? 50, filters?.offset ?? 0);

  const creators = db.prepare(query).all(...params) as Creator[];

  if (filters?.skill) {
    const skillFilter = filters.skill.toLowerCase();
    const filtered = creators.filter(c => {
      const skills = db.prepare('SELECT name FROM skills WHERE creator_id = ?').all(c.id) as { name: string }[];
      return skills.some(s => s.name.toLowerCase().includes(skillFilter));
    });
    return filtered.map(c => enrichCreator(c));
  }

  return creators.map(c => enrichCreator(c));
}

export function getCreatorById(id: string): Creator | null {
  const db = getDb();
  const creator = db.prepare('SELECT * FROM creators WHERE id = ?').get(id) as Creator | undefined;
  if (!creator) return null;
  return enrichCreator(creator);
}

export function getCreatorByUsername(username: string): Creator | null {
  const db = getDb();
  const creator = db.prepare('SELECT * FROM creators WHERE username = ?').get(username) as Creator | undefined;
  if (!creator) return null;
  return enrichCreator(creator);
}

function enrichCreator(creator: Creator): Creator {
  const db = getDb();
  creator.skills = db.prepare('SELECT * FROM skills WHERE creator_id = ? ORDER BY is_primary DESC').all(creator.id) as Skill[];
  creator.portfolio_items = db.prepare('SELECT * FROM portfolio_items WHERE creator_id = ? ORDER BY featured DESC').all(creator.id) as PortfolioItem[];
  creator.reviews = db.prepare('SELECT * FROM reviews WHERE reviewee_id = ? ORDER BY created_at DESC LIMIT 10').all(creator.id) as Review[];
  return creator;
}

export function createCreator(data: Omit<Creator, 'id' | 'created_at' | 'updated_at' | 'review_count' | 'average_rating' | 'completed_trades' | 'skill_credits'>): Creator {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO creators (id, name, username, email, bio, location, avatar_url, cover_url, hourly_rate_equiv, availability, response_time, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.name, data.username, data.email, data.bio, data.location, data.avatar_url, data.cover_url, data.hourly_rate_equiv, data.availability, data.response_time, data.verified ? 1 : 0);

  return getCreatorById(id)!;
}

export function updateCreator(id: string, data: Partial<Creator>): Creator | null {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM creators WHERE id = ?').get(id);
  if (!existing) return null;

  const fields = Object.keys(data).filter(k => !['id', 'created_at', 'skills', 'portfolio_items', 'reviews'].includes(k));
  if (fields.length === 0) return getCreatorById(id);

  const set = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => (data as Record<string, unknown>)[f]);
  db.prepare(`UPDATE creators SET ${set}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
  return getCreatorById(id);
}

export function addSkill(creatorId: string, skill: Omit<Skill, 'id' | 'creator_id'>): Skill {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO skills (id, creator_id, name, category, proficiency_level, years_experience, scarcity_score, is_primary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, creatorId, skill.name, skill.category, skill.proficiency_level, skill.years_experience, skill.scarcity_score, skill.is_primary ? 1 : 0);
  return db.prepare('SELECT * FROM skills WHERE id = ?').get(id) as Skill;
}

export function addPortfolioItem(creatorId: string, item: Omit<PortfolioItem, 'id' | 'creator_id' | 'created_at'>): PortfolioItem {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO portfolio_items (id, creator_id, title, description, media_url, thumbnail_url, category, tools_used, client_type, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, creatorId, item.title, item.description, item.media_url, item.thumbnail_url, item.category, item.tools_used, item.client_type, item.featured ? 1 : 0);
  return db.prepare('SELECT * FROM portfolio_items WHERE id = ?').get(id) as PortfolioItem;
}

export function getBriefById(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM briefs WHERE id = ?').get(id);
}

export function createBrief(data: {
  id: string;
  trade_request_id?: string;
  creator_a_id: string;
  creator_b_id: string;
  title: string;
  content: string;
  expires_at?: string;
}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO briefs (id, trade_request_id, creator_a_id, creator_b_id, title, content, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(data.id, data.trade_request_id || null, data.creator_a_id, data.creator_b_id, data.title, data.content, data.expires_at || null);
  return db.prepare('SELECT * FROM briefs WHERE id = ?').get(data.id);
}

export function getEscrowItems(briefId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM escrow_items WHERE brief_id = ? ORDER BY due_date ASC').all(briefId);
}

export function createEscrowItem(data: {
  brief_id: string;
  title: string;
  description: string;
  assigned_to: string;
  skill_credits: number;
  due_date?: string;
}) {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO escrow_items (id, brief_id, title, description, assigned_to, skill_credits, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.brief_id, data.title, data.description, data.assigned_to, data.skill_credits, data.due_date || null);
  return db.prepare('SELECT * FROM escrow_items WHERE id = ?').get(id);
}

export function releaseEscrow(id: string) {
  const db = getDb();
  const item = db.prepare('SELECT * FROM escrow_items WHERE id = ?').get(id) as { assigned_to: string; skill_credits: number } | undefined;
  if (!item) return null;

  db.prepare(`UPDATE escrow_items SET status = 'released', completed_at = CURRENT_TIMESTAMP WHERE id = ?`).run(id);
  db.prepare(`UPDATE creators SET skill_credits = skill_credits + ? WHERE id = ?`).run(item.skill_credits, item.assigned_to);
  return db.prepare('SELECT * FROM escrow_items WHERE id = ?').get(id);
}

export function createReview(data: {
  reviewer_id: string;
  reviewee_id: string;
  brief_id?: string;
  trade_quality: number;
  communication: number;
  timeliness: number;
  overall_rating: number;
  comment: string;
  skill_tags?: string;
  would_trade_again: boolean;
}) {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO reviews (id, reviewer_id, reviewee_id, brief_id, trade_quality, communication, timeliness, overall_rating, comment, skill_tags, would_trade_again)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.reviewer_id, data.reviewee_id, data.brief_id || null, data.trade_quality, data.communication, data.timeliness, data.overall_rating, data.comment, data.skill_tags || null, data.would_trade_again ? 1 : 0);

  // Update reviewer stats
  const avg = db.prepare('SELECT AVG(overall_rating) as avg, COUNT(*) as cnt FROM reviews WHERE reviewee_id = ?').get(data.reviewee_id) as { avg: number; cnt: number };
  db.prepare('UPDATE creators SET average_rating = ?, review_count = ? WHERE id = ?').run(avg.avg, avg.cnt, data.reviewee_id);

  return db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
}

export function getReviews(revieweeId: string) {
  const db = getDb();
  return db.prepare('SELECT r.*, c.name as reviewer_name, c.avatar_url as reviewer_avatar FROM reviews r LEFT JOIN creators c ON r.reviewer_id = c.id WHERE r.reviewee_id = ? ORDER BY r.created_at DESC').all(revieweeId);
}

export function searchCreators(query: string): Creator[] {
  const db = getDb();
  const term = `%${query.toLowerCase()}%`;
  const bySkill = db.prepare(`
    SELECT DISTINCT c.* FROM creators c
    JOIN skills s ON s.creator_id = c.id
    WHERE LOWER(s.name) LIKE ? OR LOWER(s.category) LIKE ?
    OR LOWER(c.bio) LIKE ? OR LOWER(c.name) LIKE ?
  `).all(term, term, term, term) as Creator[];
  return bySkill.map(c => enrichCreator(c));
}
