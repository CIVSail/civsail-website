// lib/supabase/pay-client.ts
import { createClient } from '@supabase/supabase-js';

export function createPayClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PAY_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PAY_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase Pay environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
}