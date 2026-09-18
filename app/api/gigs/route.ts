import { NextRequest, NextResponse } from 'next/server';
import { getGigs, createGig } from '@/lib/db/gigs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || searchParams.get('q');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    const gigs = getGigs({ search, category, sort });
    return NextResponse.json(gigs);
  } catch (err: any) {
    console.error('Error fetching gigs:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch gigs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, rate, description, creatorName, creatorId } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!category || !category.trim()) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }
    if (!rate || !rate.trim()) {
      return NextResponse.json({ error: 'Rate is required' }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const newGig = createGig({
      title: title.trim(),
      category: category.trim(),
      rate: rate.trim(),
      description: description.trim(),
      creatorName: creatorName ? creatorName.trim() : undefined,
      creatorId: creatorId ? creatorId.trim() : undefined,
    });

    return NextResponse.json(newGig, { status: 201 });
  } catch (err: any) {
    console.error('Error creating gig:', err);
    return NextResponse.json({ error: err.message || 'Failed to create gig' }, { status: 500 });
  }
}
