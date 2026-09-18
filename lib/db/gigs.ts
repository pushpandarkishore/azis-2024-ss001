import getDb from './client';
import { v4 as uuidv4 } from 'uuid';

export interface Gig {
  id: string;
  title: string;
  category: string;
  rate: string;
  rate_numeric: number;
  description: string;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  responsiveness_rate: number;
  completed_bookings: number;
  composite_score: number;
  created_at: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  gig_id: string;
  gig_title: string;
  category: string;
  rate: string;
  client_id: string;
  client_name: string;
  creator_id: string;
  creator_name: string;
  notes: string;
  requested_date: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  decline_reason?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface GetGigsFilter {
  search?: string | null;
  category?: string | null;
  sort?: string | null;
}

export function parseRateNumeric(rateStr: string): number {
  if (!rateStr) return 0;
  const match = rateStr.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

export function getGigs(filter: GetGigsFilter = {}): Gig[] {
  const db = getDb();
  let query = 'SELECT * FROM gigs WHERE 1=1';
  const params: (string | number)[] = [];

  if (filter.search && filter.search.trim()) {
    const term = `%${filter.search.trim()}%`;
    query += ' AND (title LIKE ? OR description LIKE ? OR creator_name LIKE ?)';
    params.push(term, term, term);
  }

  if (filter.category && filter.category.trim() && filter.category.toLowerCase() !== 'all') {
    const cat = filter.category.trim();
    // Normalize video / video editing
    if (cat.toLowerCase() === 'video' || cat.toLowerCase() === 'video editing') {
      query += " AND (LOWER(category) = 'video editing' OR LOWER(category) = 'video')";
    } else {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(cat);
    }
  }

  // Sorting
  const sort = filter.sort?.trim().toLowerCase() || 'composite';
  if (sort.includes('low') || sort === 'rate_asc') {
    query += ' ORDER BY rate_numeric ASC';
  } else if (sort.includes('high') || sort === 'rate_desc') {
    query += ' ORDER BY rate_numeric DESC';
  } else if (sort === 'newest') {
    query += ' ORDER BY created_at DESC';
  } else {
    // Default: Composite Recommended
    query += ' ORDER BY composite_score DESC, created_at DESC';
  }

  const rows = db.prepare(query).all(...params) as Gig[];
  return rows;
}

export function getGigById(id: string): Gig | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM gigs WHERE id = ?').get(id) as Gig | undefined;
  return row || null;
}

export interface CreateGigInput {
  title: string;
  category: string;
  rate: string;
  description: string;
  creatorName?: string;
  creatorId?: string;
}

export function createGig(input: CreateGigInput): Gig {
  const db = getDb();
  const id = `gig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const rateNumeric = parseRateNumeric(input.rate);
  const creatorId = input.creatorId || 'creator_demo';
  const creatorName = input.creatorName || 'Alex Rivera (Demo Creator)';
  const creatorAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(creatorName)}&backgroundColor=b6e3f4`;
  const responsivenessRate = 0.98;
  const completedBookings = 12;
  const compositeScore = 90.0;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const stmt = db.prepare(`
    INSERT INTO gigs (id, title, category, rate, rate_numeric, description, creator_id, creator_name, creator_avatar, responsiveness_rate, completed_bookings, composite_score, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    input.title,
    input.category,
    input.rate,
    rateNumeric,
    input.description,
    creatorId,
    creatorName,
    creatorAvatar,
    responsivenessRate,
    completedBookings,
    compositeScore,
    now,
    now
  );

  return getGigById(id)!;
}

export interface GetBookingsFilter {
  role?: string | null;
  userId?: string | null;
}

export function getBookings(filter: GetBookingsFilter = {}): Booking[] {
  const db = getDb();
  let query = 'SELECT * FROM bookings WHERE 1=1';
  const params: string[] = [];

  const role = filter.role?.toLowerCase();
  const userId = filter.userId;

  if (role === 'creator') {
    if (userId) {
      query += ' AND creator_id = ?';
      params.push(userId);
    } else {
      query += " AND creator_id = 'creator_demo'";
    }
  } else if (role === 'client') {
    if (userId) {
      query += ' AND client_id = ?';
      params.push(userId);
    } else {
      query += " AND client_id = 'client_demo'";
    }
  } else if (userId) {
    query += ' AND (creator_id = ? OR client_id = ?)';
    params.push(userId, userId);
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params) as Booking[];
  return rows;
}

export function getBookingById(id: string): Booking | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) as Booking | undefined;
  return row || null;
}

export interface CreateBookingInput {
  gigId: string;
  clientName: string;
  notes: string;
  requestedDate: string;
  clientId?: string;
}

export function createBooking(input: CreateBookingInput): Booking {
  const db = getDb();
  const gig = getGigById(input.gigId);

  const id = `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const gigTitle = gig ? gig.title : 'Custom Creative Gig';
  const category = gig ? gig.category : 'General';
  const rate = gig ? gig.rate : '$50/hr';
  const creatorId = gig ? gig.creator_id : 'creator_demo';
  const creatorName = gig ? gig.creator_name : 'Alex Rivera (Demo Creator)';
  const clientId = input.clientId || 'client_demo';
  const clientName = input.clientName || 'Demo Client';
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const stmt = db.prepare(`
    INSERT INTO bookings (id, gig_id, gig_title, category, rate, client_id, client_name, creator_id, creator_name, notes, requested_date, status, decline_reason, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NULL, ?, ?)
  `);

  stmt.run(
    id,
    input.gigId,
    gigTitle,
    category,
    rate,
    clientId,
    clientName,
    creatorId,
    creatorName,
    input.notes,
    input.requestedDate,
    now,
    now
  );

  return getBookingById(id)!;
}

export function updateBookingStatus(
  id: string,
  status: 'Accepted' | 'Declined',
  declineReason?: string
): Booking | null {
  const db = getDb();
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const stmt = db.prepare(`
    UPDATE bookings
    SET status = ?, decline_reason = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(status, declineReason || null, now, id);
  return getBookingById(id);
}
