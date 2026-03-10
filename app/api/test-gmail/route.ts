import { NextResponse } from 'next/server';
import { searchNMCEmails } from '@/lib/gmail/client';

export async function GET() {
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
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}