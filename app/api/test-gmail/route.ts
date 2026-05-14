import { NextResponse } from 'next/server';
import { searchNMCEmails } from '@/lib/gmail/client';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messageIds = await searchNMCEmails();

    return NextResponse.json({
      success: true,
      message: 'Gmail API connected successfully',
      emailCount: messageIds.length,
      messageIds
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
