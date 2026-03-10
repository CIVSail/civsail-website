import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function GET() {
  try {
    // Search for ANY recent emails (no filters)
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
      q: 'newer_than:1d' // Just emails from last 24 hours
    });

    const messages = response.data.messages || [];
    
    // Get details for each email
    const emailDetails = await Promise.all(
      messages.map(async (msg) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'metadata',
          metadataHeaders: ['From', 'Subject', 'Date']
        });
        
        const headers = details.data.payload?.headers || [];
        return {
          id: msg.id,
          from: headers.find(h => h.name === 'From')?.value,
          subject: headers.find(h => h.name === 'Subject')?.value,
          date: headers.find(h => h.name === 'Date')?.value,
          labelIds: details.data.labelIds
        };
      })
    );

    return NextResponse.json({
      success: true,
      totalEmails: messages.length,
      emails: emailDetails
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}