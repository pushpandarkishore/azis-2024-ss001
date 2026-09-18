import { NextResponse } from 'next/server';
import getDb from '@/lib/db/client';

export async function GET() {
  try {
    const db = getDb();
    // Test DB connection
    db.prepare('SELECT 1').get();

    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      features: ['creator-profiles', 'semantic-matching', 'trade-evaluation', 'brief-generation', 'escrow-reviews'],
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', db: 'disconnected', error: String(error), timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
