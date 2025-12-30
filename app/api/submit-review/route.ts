
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for inserting (bypasses RLS for the insert)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { name, review, rating } = await request.json();

    // Validate inputs
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { ok: false, code: 'MISSING_NAME', message: 'Name is required' },
        { status: 400 }
      );
    }

    if (!review || review.trim().length === 0) {
      return NextResponse.json(
        { ok: false, code: 'MISSING_REVIEW', message: 'Review is required' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { ok: false, code: 'INVALID_RATING', message: 'Rating must be 1-5' },
        { status: 400 }
      );
    }

    // Insert review (approved = false by default, needs admin approval)
    const { error } = await supabase.from('retirement_reviews').insert({
      name: name.trim(),
      review: review.trim(),
      rating,
      approved: false,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { ok: false, code: 'DB_ERROR', message: 'Failed to save review' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { ok: false, code: 'SERVER_ERROR', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}