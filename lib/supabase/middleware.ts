/**
 * Supabase client for middleware
 * Refreshes auth sessions on every request and enforces the two-phase access model:
 *
 * Phase 1 — Onboarding: Authenticated users with no completed profile must complete
 *            onboarding before accessing the dashboard.
 * Phase 2 — Dashboard: Accessible only once onboarding_completed_at is set on the profile.
 *
 * Route rules:
 *   /login, /signup     → redirect to /dashboard if authed + onboarded, else /onboarding if authed + not onboarded
 *   /onboarding         → redirect to /login if not authed, /dashboard if already onboarded
 *   /dashboard/*        → redirect to /login if not authed, /onboarding if authed but not onboarded
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
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options?: any }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isDashboard = pathname.startsWith('/dashboard');
  const isOnboarding = pathname.startsWith('/onboarding');
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!user) {
    if (isDashboard || isOnboarding) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // ── Authenticated — check onboarding completion status ────────────────────
  // Only query the DB on routes where we need to make a decision.
  // Selecting just one column keeps this fast.
  if (isDashboard || isOnboarding || isAuthPage) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('onboarding_completed_at')
      .eq('user_id', user.id)
      .maybeSingle();

    const onboardingComplete =
      profileData != null && profileData.onboarding_completed_at != null;

    if (isDashboard && !onboardingComplete) {
      // Authed but hasn't finished onboarding → send to /onboarding
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }

    if (isOnboarding && onboardingComplete) {
      // Already finished onboarding → send to /dashboard
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (isAuthPage) {
      // Logged-in users visiting login/signup get routed to the right place
      if (onboardingComplete) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      } else {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
