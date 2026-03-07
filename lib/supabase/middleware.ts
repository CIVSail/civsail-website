/**
 * Supabase client for middleware
 * Refreshes auth sessions on every request
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired — keep for when portal goes live
  const {
    data: { user: _user },
  } = await supabase.auth.getUser();

  // Portal lockdown: redirect all auth-related routes to the portal coming-soon page
  const lockedPaths = ['/dashboard', '/onboarding', '/login', '/signup', '/reset-password'];
  const isLocked = lockedPaths.some((p) =>
    request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + '/')
  );

  if (isLocked) {
    const url = request.nextUrl.clone();
    url.pathname = '/portal';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}