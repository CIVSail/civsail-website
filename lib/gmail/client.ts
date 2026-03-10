import { google } from 'googleapis';

/**
 * Gmail API client for monitoring credentials@civsail.com
 * Uses OAuth2 with refresh token
 */

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID!;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET!;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN!;

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Redirect URI used during setup
);

oauth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

/**
 * Search for unread emails from NMC
 * Returns array of message IDs
 */
export async function searchNMCEmails(): Promise<string[]> {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:SMB-NationalMaritimeCenter-DoNotReply@uscg.mil newer_than:30d',
      maxResults: 50
    });
    
    return response.data.messages?.map(m => m.id!) || [];
  } catch (error) {
    console.error('Error searching Gmail:', error);
    throw error;
  }
}

/**
 * Get full email content by message ID
 */
export async function getEmailContent(messageId: string): Promise<{
  body: string;
  subject: string;
  from: string;
  date: string;
}> {
  try {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    });
    
    const headers = response.data.payload?.headers || [];
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value || '';
    
    // Extract body (handle both plain text and base64 encoded)
    let body = '';
    const parts = response.data.payload?.parts;
    
    if (parts) {
      const textPart = parts.find(p => p.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    } else if (response.data.payload?.body?.data) {
      body = Buffer.from(response.data.payload.body.data, 'base64').toString('utf-8');
    }
    
    return { body, subject, from, date };
  } catch (error) {
    console.error('Error fetching email:', error);
    throw error;
  }
}

/**
 * Mark email as read
 */
export async function markEmailAsRead(messageId: string): Promise<void> {
  try {
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });
  } catch (error) {
    console.error('Error marking email as read:', error);
    throw error;
  }
}