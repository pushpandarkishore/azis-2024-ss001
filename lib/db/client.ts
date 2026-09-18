import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

const DB_PATH = process.env.DATABASE_PATH || './skillswap.db';

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    let resolvedPath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), DB_PATH);

    // Vercel Serverless environment compatibility (ensures writable SQLite)
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const tmpPath = path.join(os.tmpdir(), 'skillswap.db');
      if (!fs.existsSync(tmpPath) && fs.existsSync(/*turbopackIgnore: true*/ resolvedPath)) {
        try {
          fs.copyFileSync(/*turbopackIgnore: true*/ resolvedPath, tmpPath);
        } catch {
          // If copy fails, database will initialize fresh in /tmp
        }
      }
      resolvedPath = tmpPath;
    }

    db = new Database(resolvedPath);
    try {
      db.pragma('journal_mode = WAL');
    } catch {
      // Ignore if WAL mode is constrained
    }
    db.pragma('foreign_keys = ON');
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS creators (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      bio TEXT,
      location TEXT,
      avatar_url TEXT,
      cover_url TEXT,
      hourly_rate_equiv REAL DEFAULT 0,
      availability TEXT DEFAULT 'available',
      response_time TEXT DEFAULT '24h',
      completed_trades INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      average_rating REAL DEFAULT 0,
      skill_credits INTEGER DEFAULT 100,
      verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency_level TEXT DEFAULT 'intermediate',
      years_experience INTEGER DEFAULT 1,
      scarcity_score REAL DEFAULT 1.0,
      is_primary BOOLEAN DEFAULT 0,
      FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS portfolio_items (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      media_url TEXT,
      thumbnail_url TEXT,
      category TEXT,
      tools_used TEXT,
      client_type TEXT,
      embedding TEXT,
      featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS trade_requests (
      id TEXT PRIMARY KEY,
      initiator_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      offer_scope TEXT NOT NULL,
      request_scope TEXT NOT NULL,
      equivalence_ratio REAL,
      fairness_score REAL,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (initiator_id) REFERENCES creators(id),
      FOREIGN KEY (receiver_id) REFERENCES creators(id)
    );

    CREATE TABLE IF NOT EXISTS briefs (
      id TEXT PRIMARY KEY,
      trade_request_id TEXT,
      creator_a_id TEXT NOT NULL,
      creator_b_id TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      signed_by_a BOOLEAN DEFAULT 0,
      signed_by_b BOOLEAN DEFAULT 0,
      version INTEGER DEFAULT 1,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_a_id) REFERENCES creators(id),
      FOREIGN KEY (creator_b_id) REFERENCES creators(id)
    );

    CREATE TABLE IF NOT EXISTS escrow_items (
      id TEXT PRIMARY KEY,
      brief_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to TEXT NOT NULL,
      skill_credits INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      due_date DATETIME,
      completed_by_assignee BOOLEAN DEFAULT 0,
      confirmed_by_counterpart BOOLEAN DEFAULT 0,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brief_id) REFERENCES briefs(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES creators(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      reviewer_id TEXT NOT NULL,
      reviewee_id TEXT NOT NULL,
      brief_id TEXT,
      trade_quality INTEGER NOT NULL CHECK(trade_quality BETWEEN 1 AND 5),
      communication INTEGER NOT NULL CHECK(communication BETWEEN 1 AND 5),
      timeliness INTEGER NOT NULL CHECK(timeliness BETWEEN 1 AND 5),
      overall_rating REAL NOT NULL,
      comment TEXT,
      skill_tags TEXT,
      would_trade_again BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reviewer_id) REFERENCES creators(id),
      FOREIGN KEY (reviewee_id) REFERENCES creators(id)
    );

    CREATE TABLE IF NOT EXISTS gigs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      rate TEXT NOT NULL,
      rate_numeric REAL DEFAULT 0,
      description TEXT NOT NULL,
      creator_id TEXT DEFAULT 'creator_demo',
      creator_name TEXT DEFAULT 'Demo Creator',
      creator_avatar TEXT,
      responsiveness_rate REAL DEFAULT 0.95,
      completed_bookings INTEGER DEFAULT 12,
      composite_score REAL DEFAULT 85.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      gig_id TEXT NOT NULL,
      gig_title TEXT NOT NULL,
      category TEXT NOT NULL,
      rate TEXT NOT NULL,
      client_id TEXT DEFAULT 'client_demo',
      client_name TEXT NOT NULL,
      creator_id TEXT DEFAULT 'creator_demo',
      creator_name TEXT DEFAULT 'Demo Creator',
      notes TEXT NOT NULL,
      requested_date TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      decline_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  autoSeedMarketplace(db);
}

function autoSeedMarketplace(db: Database.Database) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM gigs').get() as { count: number };
  if (countRow && countRow.count > 0) {
    return;
  }

  const INITIAL_GIGS = [
    {
      id: 'gig_1',
      title: 'Brand Identity & Modern Design System',
      category: 'Design',
      rate: '$65/hr',
      rate_numeric: 65,
      description: 'Comprehensive brand identity suites, modern typographic scale, custom iconography, and scalable Figma component libraries designed for fast-growing startups.',
      creator_id: 'creator_demo',
      creator_name: 'Alex Rivera (Demo Creator)',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera&backgroundColor=b6e3f4',
      responsiveness_rate: 0.98,
      completed_bookings: 34,
      composite_score: 96.2,
      created_at: '2026-09-01 10:00:00',
    },
    {
      id: 'gig_2',
      title: '3D Kinetic Motion Graphics & Product Explainer',
      category: 'Video Editing',
      rate: '$85/hr',
      rate_numeric: 85,
      description: 'High-octane 3D product reveals and kinetic typography in Cinema 4D and After Effects. Ideal for tech launches, SaaS demos, and high-impact social campaigns.',
      creator_id: 'creator_demo',
      creator_name: 'Alex Rivera (Demo Creator)',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera&backgroundColor=b6e3f4',
      responsiveness_rate: 0.95,
      completed_bookings: 22,
      composite_score: 91.5,
      created_at: '2026-09-03 14:30:00',
    },
    {
      id: 'gig_3',
      title: 'SaaS UX/UI Wireframing & Interactive Prototype',
      category: 'Design',
      rate: '$70/hr',
      rate_numeric: 70,
      description: 'End-to-end user experience flows, low-to-high fidelity wireframes, user testing prototypes, and clean developer handover in Figma.',
      creator_id: 'creator_marcus',
      creator_name: 'Marcus Webb',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcuswebb&backgroundColor=d1d4f9',
      responsiveness_rate: 0.94,
      completed_bookings: 31,
      composite_score: 92.8,
      created_at: '2026-09-05 09:15:00',
    },
    {
      id: 'gig_4',
      title: 'YouTube Longform & Viral Shorts Video Editing',
      category: 'Video Editing',
      rate: '$45/hr',
      rate_numeric: 45,
      description: 'Fast-paced storytelling cuts, kinetic subtitles, custom sound design, pacing optimization, and color grading tuned for maximum viewer retention and watch-time.',
      creator_id: 'creator_david',
      creator_name: 'David Kim',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=davidkim&backgroundColor=c0aede',
      responsiveness_rate: 0.99,
      completed_bookings: 48,
      composite_score: 97.4,
      created_at: '2026-09-07 11:20:00',
    },
    {
      id: 'gig_5',
      title: 'Direct Response Copywriting & Landing Pages',
      category: 'Writing',
      rate: '$55/hr',
      rate_numeric: 55,
      description: 'High-converting copy for product launch landing pages, onboarding email nurture sequences, and marketing funnels backed by deep consumer psychology.',
      creator_id: 'creator_elena',
      creator_name: 'Elena Rostova',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elenarostova&backgroundColor=ffd5dc',
      responsiveness_rate: 0.93,
      completed_bookings: 27,
      composite_score: 89.6,
      created_at: '2026-09-08 16:45:00',
    },
    {
      id: 'gig_6',
      title: 'Technical Blog Writing & Architecture Guides',
      category: 'Writing',
      rate: '$120 flat',
      rate_numeric: 120,
      description: 'Deeply researched, developer-focused technical articles, API breakdowns, and architecture deep dives with working code examples and diagrams.',
      creator_id: 'creator_elena',
      creator_name: 'Elena Rostova',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elenarostova&backgroundColor=ffd5dc',
      responsiveness_rate: 0.95,
      completed_bookings: 18,
      composite_score: 88.2,
      created_at: '2026-09-10 13:10:00',
    },
    {
      id: 'gig_7',
      title: 'Audio Mixing, Mastering & Podcast Clean-Up',
      category: 'Audio',
      rate: '$50/hr',
      rate_numeric: 50,
      description: 'Studio-grade audio engineering, dynamic EQ balancing, de-reverb, noise reduction, and streaming loudness mastering (LUFS compliant).',
      creator_id: 'creator_liam',
      creator_name: 'Liam Thorne',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liamthorne&backgroundColor=b6e3f4',
      responsiveness_rate: 0.97,
      completed_bookings: 39,
      composite_score: 95.1,
      created_at: '2026-09-11 08:30:00',
    },
    {
      id: 'gig_8',
      title: 'Original Game Soundtrack & Sonic Branding',
      category: 'Audio',
      rate: '$180 flat',
      rate_numeric: 180,
      description: 'Custom melodic hooks, ambient background game loops, and signature audio brand stamps crafted using modular synths and orchestral layers.',
      creator_id: 'creator_liam',
      creator_name: 'Liam Thorne',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liamthorne&backgroundColor=b6e3f4',
      responsiveness_rate: 0.91,
      completed_bookings: 15,
      composite_score: 86.7,
      created_at: '2026-09-12 15:00:00',
    },
    {
      id: 'gig_9',
      title: 'Full-Stack React & Next.js 1-on-1 Mentorship',
      category: 'Tutoring',
      rate: '$40/hr',
      rate_numeric: 40,
      description: 'Personalized code reviews, React Server Components architecture coaching, TypeScript type system mastering, and technical mock interview prep.',
      creator_id: 'creator_sofia',
      creator_name: 'Sofia Patel',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofiapatel&backgroundColor=d1d4f9',
      responsiveness_rate: 0.99,
      completed_bookings: 54,
      composite_score: 98.6,
      created_at: '2026-09-13 17:20:00',
    },
    {
      id: 'gig_10',
      title: 'Design Portfolio Audit & Career Strategy',
      category: 'Tutoring',
      rate: '$60/hr',
      rate_numeric: 60,
      description: '90-minute in-depth review of your design case studies, storytelling critique, resume positioning, and strategic outreach playbook.',
      creator_id: 'creator_marcus',
      creator_name: 'Marcus Webb',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcuswebb&backgroundColor=d1d4f9',
      responsiveness_rate: 0.92,
      completed_bookings: 24,
      composite_score: 89.0,
      created_at: '2026-09-14 10:40:00',
    },
    {
      id: 'gig_11',
      title: 'Minimalist Vector Illustration & Custom Icon Sets',
      category: 'Design',
      rate: '$35/hr',
      rate_numeric: 35,
      description: 'Sharp, scalable vector graphics, custom brand mascots, and UI icon packages optimized for modern dark and light mode applications.',
      creator_id: 'creator_aria',
      creator_name: 'Aria Tanaka',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ariatanaka&backgroundColor=ffd5dc',
      responsiveness_rate: 0.88,
      completed_bookings: 16,
      composite_score: 84.5,
      created_at: '2026-09-15 12:00:00',
    },
    {
      id: 'gig_12',
      title: 'Cinematic Color Grading & DaVinci Resolve Master',
      category: 'Video Editing',
      rate: '$150 flat',
      rate_numeric: 150,
      description: 'Film-grade color grading for commercials, music videos, and short films. Professional look design, shot matching, and deliverable exports.',
      creator_id: 'creator_david',
      creator_name: 'David Kim',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=davidkim&backgroundColor=c0aede',
      responsiveness_rate: 0.96,
      completed_bookings: 29,
      composite_score: 93.3,
      created_at: '2026-09-16 09:30:00',
    },
    {
      id: 'gig_13',
      title: 'Podcast Editing & Vocal Tuning Workshop',
      category: 'Tutoring',
      rate: '$45/hr',
      rate_numeric: 45,
      description: 'Hands-on training in DAW workflows, vocal compression, EQ sweetening, and automated leveling to launch your own studio-quality show.',
      creator_id: 'creator_liam',
      creator_name: 'Liam Thorne',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liamthorne&backgroundColor=b6e3f4',
      responsiveness_rate: 0.94,
      completed_bookings: 19,
      composite_score: 87.8,
      created_at: '2026-09-17 14:15:00',
    },
    {
      id: 'gig_14',
      title: 'SEO Content Strategy & Keyword Dominance Plan',
      category: 'Writing',
      rate: '$90 flat',
      rate_numeric: 90,
      description: 'Comprehensive keyword clustering, search intent analysis, and a structured 90-day publishing calendar designed to rank on page 1.',
      creator_id: 'creator_elena',
      creator_name: 'Elena Rostova',
      creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elenarostova&backgroundColor=ffd5dc',
      responsiveness_rate: 0.93,
      completed_bookings: 21,
      composite_score: 88.9,
      created_at: '2026-09-18 11:00:00',
    },
  ];

  const insertGig = db.prepare(`
    INSERT INTO gigs (id, title, category, rate, rate_numeric, description, creator_id, creator_name, creator_avatar, responsiveness_rate, completed_bookings, composite_score, created_at)
    VALUES (@id, @title, @category, @rate, @rate_numeric, @description, @creator_id, @creator_name, @creator_avatar, @responsiveness_rate, @completed_bookings, @composite_score, @created_at)
  `);

  const insertBooking = db.prepare(`
    INSERT INTO bookings (id, gig_id, gig_title, category, rate, client_id, client_name, creator_id, creator_name, notes, requested_date, status, decline_reason, created_at)
    VALUES (@id, @gig_id, @gig_title, @category, @rate, @client_id, @client_name, @creator_id, @creator_name, @notes, @requested_date, @status, @decline_reason, @created_at)
  `);

  const seedTx = db.transaction(() => {
    for (const gig of INITIAL_GIGS) {
      insertGig.run(gig);
    }

    const INITIAL_BOOKINGS = [
      {
        id: 'BK-2024-9102',
        gig_id: 'gig_1',
        gig_title: 'Brand Identity & Modern Design System',
        category: 'Design',
        rate: '$65/hr',
        client_id: 'client_demo',
        client_name: 'Demo Client',
        creator_id: 'creator_demo',
        creator_name: 'Alex Rivera (Demo Creator)',
        notes: 'Full brand refresh for an AI tutoring platform launching next month. We need primary logos, color tokens, and a Figma library.',
        requested_date: '2026-10-15',
        status: 'Pending',
        decline_reason: null,
        created_at: '2026-09-18 09:30:00',
      },
      {
        id: 'BK-2024-7841',
        gig_id: 'gig_4',
        gig_title: 'YouTube Longform & Viral Shorts Video Editing',
        category: 'Video Editing',
        rate: '$45/hr',
        client_id: 'client_demo',
        client_name: 'Demo Client',
        creator_id: 'creator_david',
        creator_name: 'David Kim',
        notes: 'Editing 3 tech tutorial episodes with animated motion callouts and kinetic captions.',
        requested_date: '2026-09-30',
        status: 'Accepted',
        decline_reason: null,
        created_at: '2026-09-17 11:15:00',
      },
      {
        id: 'BK-2024-5520',
        gig_id: 'gig_7',
        gig_title: 'Audio Mixing, Mastering & Podcast Clean-Up',
        category: 'Audio',
        rate: '$50/hr',
        client_id: 'client_demo',
        client_name: 'Demo Client',
        creator_id: 'creator_liam',
        creator_name: 'Liam Thorne',
        notes: 'Need spatial audio cleanup and loudness balancing for our 12-episode audio drama.',
        requested_date: '2026-09-25',
        status: 'Declined',
        decline_reason: 'Schedule Conflict',
        created_at: '2026-09-16 14:00:00',
      },
      {
        id: 'BK-2024-6631',
        gig_id: 'gig_2',
        gig_title: '3D Kinetic Motion Graphics & Product Explainer',
        category: 'Video Editing',
        rate: '$85/hr',
        client_id: 'client_nova',
        client_name: 'Nova Labs Tech',
        creator_id: 'creator_demo',
        creator_name: 'Alex Rivera (Demo Creator)',
        notes: 'Need a 20-second 3D teaser video for our developer hardware launch.',
        requested_date: '2026-10-05',
        status: 'Pending',
        decline_reason: null,
        created_at: '2026-09-18 16:20:00',
      },
    ];

    for (const b of INITIAL_BOOKINGS) {
      insertBooking.run(b);
    }
  });

  seedTx();
}

export default getDb;
