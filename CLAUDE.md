# CLAUDE.md – CIVSail Project Context, Vision & Engineering Standards

> **Read this first.** This document gives Claude Code (or any AI assistant) complete context on CIVSail: what it is, why it exists, how to think about it, and the technical standards to follow.

---

## 🤖 How an LLM Should Behave in This Repo

When assisting with CIVSail, follow these principles:

| Principle | What It Means in Practice |
|-----------|---------------------------|
| **Favor clarity over cleverness** |
| **Prefer modular, documented solutions** | features should be extractable. functions should explain its purpose. |
| **Assume domain-expert but engineering-novice** | Alec knows maritime careers deeply but is learning to code. Explain technical concepts; don't explain what a TWIC card is. |
| **Optimize for long-term maintainability** | This platform will grow for years. Write code that future-Alec (or future-contributors) can extend without rewriting. |
| **Align with mariner autonomy and neutrality** | CIVSail empowers individuals to make their own choices. Never build features that manipulate, coerce, or favor one employer/union over another. |

### Specific Guidance

**When proposing solutions:**
- Explain the "why" before the "how"
- Offer 2-3 options when tradeoffs exist (with clear pros/cons)
- Default to simpler approaches; only add complexity when justified
- Flag any security, privacy, or neutrality concerns immediately

**When writing code:**
- Comments explain business logic and maritime context, not syntax
- Error messages should help users fix problems, not blame them
- UI copy should be respectful of mariner intelligence and autonomy

**When in doubt:**
- Ask clarifying questions rather than assume
- Err on the side of user privacy and data minimization
- Remember: this platform serves individuals

---

## 🤖 AI Service (Python) — Critical Context

This repo contains TWO runtimes. Never mix them.

| Service | Language | Deploys To | Port |
|---|---|---|---|
| Next.js app | TypeScript | Vercel | 3000 |
| Python AI service | Python | Railway | 8000 |

Both share the same Supabase database.
Next.js uses anon key + RLS.
Python uses service_role key (server-side only, never expose).

### The ai-service/ Folder
All Python code lives in `ai-service/` in this repo.
Read `ai-service/CLAUDE.md` when working in that folder —
it contains full architecture context for the LangGraph agents,
RAG pipeline, rules engine, and NMC monitor.

### Three Agents Being Built
1. **AI Career Advisor** — LangGraph agent, answers credential/career
   questions using RAG + rules engine + user profile
2. **NMC Monitor** — Scheduled pipeline, watches NMC website for
   changes, sends personalized alerts to affected mariners
3. **Course Enrollment Sub-agent** — Fills and submits training
   enrollment forms (Phase 5, not yet started)

### How Next.js and Python Talk
Next.js calls Python via HTTP POST to `/advisor/chat`.
Auth: shared secret in `Authorization: Bearer` header.
Never call Supabase directly from Python with the anon key.

### Model Agnosticism
LLM is selected via `MODEL_PROVIDER` env var.
Options: `anthropic` | `openai` | `huggingface`
Never hardcode model names in agent files — always use `get_llm()`.

### What NOT To Do (Python Service)
- Do not add LLM calls inside `rules/` — must stay deterministic
- Do not hardcode model names
- Do not use synchronous HTTP (`requests`) — use `httpx` async
- Do not commit `.env` — only `.env.example`
- Do not skip the `AI_SERVICE_SECRET` check on any endpoint

---

## 🗄️ Database Schema (Current — 20 Tables)

### User-Specific Tables
| Table | Purpose |
|-------|---------|
| **profiles** | Core user data — name, contact, credential expirations, NMC ref number, sector, department, onboarding status |
| **credentials** | Individual NMC endorsements per user (national, STCW, license) |
| **nmc_verifications** | NMC verification request tracking & parsed email results |
| **credential_reminders** | Expiration alert history & delivery status |
| **sea_service** | Sea time logs by vessel, position, route, dates, tonnage |
| **training_certificates** | Safety/operational/management course completions |
| **career_goals** | Current credential → target credential, primary/secondary goals |
| **documents** | User document storage (file name, type, storage path) |
| **leave_chits** | Saved leave chit PDF paths per user |

### Public/Admin Data Tables
| Table | Purpose |
|-------|---------|
| **ports** | Port locations, regions, coordinates, emission regulation zones |
| **ships** | Ship names, classes, operators, specs, home port, slug |
| **retirement_reviews** | User-submitted reviews with approval flag and rating |
| **newsletter_subscribers** | Email signups with confirmation & unsubscribe tracking |

### NMC Exam & Course Reference Tables
| Table | Purpose |
|-------|---------|
| **nmc_exams** | NMC exam catalog (exam code, endorsement, department, waterway type) |
| **nmc_exam_modules** | Exam module definitions (module code, topics, question count, passing score) |
| **nmc_courses** | NMC course catalog (provider, satisfies modules/endorsements, validity) |
| **credential_checklists** | Credential requirement checklists by department/role |
| **checklist_exams** | Links checklists to required exams |
| **course_exam_alternatives** | Links courses to exams they can substitute for |
| **exam_module_assignments** | Links exams to their component modules |

### New Tables (AI Service — migrations not yet written)
- **document_chunks** — RAG knowledge base with pgvector embeddings
- **nmc_updates** — classified NMC website changes
- **nmc_page_snapshots** — raw page snapshots for diff detection
- **nmc_update_alerts** — alert history per user

### RLS Rule
Every table has RLS enabled. Always write RLS policies with migrations.
Never suggest disabling RLS. Never create tables in the Supabase
dashboard — always write a migration file and push from VS Code.

---

## 🔌 Environment Variables

### Next.js (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
RESEND_API_KEY=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
DVIDS_API_KEY=
OPENWEATHER_API_KEY=
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_SECRET=
```

### Python (ai-service/.env — gitignored)
```
MODEL_PROVIDER=anthropic
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
AI_SERVICE_SECRET=
ENVIRONMENT=development
```

---

## 🧭 Domain Knowledge — Critical Corrections

Alec is a working mariner. Defer to him on all maritime specifics.
Common areas where AI training data is wrong:

- **CIVMAR vs CONMAR** — direct-hire federal civilians vs contracted
  mariners. Different pay, different rules, not interchangeable.
- **MMC structure** — the credential contains multiple endorsements.
  "License" and "MMC" are not the same thing.
- **Travel mode codes** — two-letter combinations. First letter =
  payment/ownership, second = transport mode. e.g. "TP" =
  government-ticketed plane. Not single letters.
- **Sea time credit** — rules are vessel-type-specific. Always refer
  to 46 CFR, not general knowledge.
- **NMC processing** — takes weeks to months. Timing matters.

---

## 🎯 What CIVSail Is

**CIVSail.com** is a modern, mariner-first software and information platform designed to support U.S. merchant mariners across their entire career lifecycle.

**Initial Focus:** MSC CIVMARs (Military Sealift Command civilian mariners)
**Expanding To:** All U.S. mariners (commercial, NOAA, tugs, offshore, yachts)

### What CIVSail Is NOT

| CIVSail is NOT... | Because... |
|-------------------|------------|
| A recruiting tool | We don't steer people toward specific employers |
| A union tool | We don't advocate for or against organized labor |
| An employer sales channel | We don't sell mariner data or attention to companies |
| A government mouthpiece | We present facts, not propaganda |

### What CIVSail IS

**A neutral career infrastructure layer** that helps individuals:

- **Understand their options** – Career paths, credential requirements, pay structures, lifestyle tradeoffs
- **Reduce friction** – Automate paperwork, track credentials, simplify bureaucracy
- **Make informed decisions** – Data and tools, not sales pitches
- **Maintain leverage and autonomy** – Knowledge is power; CIVSail democratizes industry knowledge

> **CIVSail serves individuals first.** Employers, unions, agencies, and institutions benefit indirectly through better-prepared, better-matched mariners – but they are never the primary customer.

---

## 🧭 Core Design Philosophy

### 1. Choice Architecture, Not Persuasion

CIVSail does not "sell" career paths. It lays out tradeoffs clearly and lets the individual decide.

```
❌ WRONG: "MSC is the best choice for new mariners!"
✅ RIGHT: "Here's how MSC compares to commercial shipping on pay,
          time home, credential requirements, and job security.
          Your priorities determine the best fit."
```

### 2. People Are Built to Work Hard, Not Navigate Complexity

Mariners are capable, hardworking professionals. They shouldn't need to be bureaucracy experts to manage their careers.

**CIVSail absorbs complexity so users can focus on execution.**

- Credential tracking – automated, not manual spreadsheets
- Pay calculations – instant, not "ask around"
- Career planning – structured, not tribal knowledge

### 3. Career Governance Over Job Placement

CIVSail is not a job board. It's a **career governance platform**.

| Job Board | Career Governance |
|-----------|-------------------|
| "Here's a job opening" | "Here's where you are in your career" |
| Transactional | Long-term relationship |
| Employer-driven | Mariner-driven |
| Reactive | Proactive |

Mariners are responsible for their careers. CIVSail provides structure, visibility, and tooling.

### 4. Modular, Composable, Future-Proof

Every feature is built as an independent module that can:
- Scale independently
- Recombine with other features
- Potentially be sold or licensed separately
- Be maintained without breaking other features

```typescript
// GOOD: Modular design
// /lib/credentials/       – Credential tracking module
// /lib/pay-calculator/    – Pay calculation module
// /lib/career-paths/      – Career mapping module
// Each can evolve independently

// BAD: Monolithic design
// /lib/everything.ts      – One giant file that does it all
```

---

## 🗺️ Platform Scope

### Current Features (Built)

| Feature | Description | Status |
|---------|-------------|--------|
| **Credential Dashboard** | Track MMC, medical, TWIC, STCW with expiration warnings | semi built but not live
| **NMC Verification** | Automated credential verification via NMC emails | semi built but not live
| **Port Guides** | Interactive guides with maps, venues, local tips | some build, need place holder / input pages
| **Ship Information** | Ship class pages with specs, pay, life aboard, news | some build, need place holder / input pages
| **Document Storage** | Secure upload/download of MMC scans, sea service letters | semi built not live

### Tools (In Progress)

| Tool | Purpose | Status |
|------|---------|--------|
| **Pay Calculator** | Compare earnings across ships, routes, employers | live
| **Leave Chit Generator** | Auto-fill leave request forms, calculate balances | live
| **Travel Voucher (DD 1351-2)** | Generate travel claims for faster reimbursement | live
| **Sea Service Calculator** | Track time toward license upgrades | in progress

### Career Mapping & Decision Support (In Progress / future)

**Purpose:** Make implicit industry knowledge explicit and navigable.

| Component | Description |
|-----------|-------------|
| **Career Path Explorer** | Visual maps of career progression across MSC, commercial, NOAA, tugs, offshore, yachts, shore-side |
| **Tradeoff Analysis** | Compare paths on: pay, time home, lifestyle, credential burden, job security, advancement speed |
| **Audience-Specific Views** | Tailored for: prospective mariners, parents, guidance counselors, mid-career mariners planning exits/pivots |
| **Credential Roadmaps** | "To get from AB to Chief Mate, you need X sea time, Y courses, Z endorsements" |

### Strategic Expansion (Planned)

#### Career Governance Layer
A persistent career "control panel" including:

| Feature | Description |
|---------|-------------|
| **Sea Time Tracking** | Log by year, vessel, employer – exportable for license applications |
| **Credential Progress** | Visual progress toward next upgrade (e.g., "127 of 360 days toward Chief Mate") |
| **Education Planning** | schedules at various maritime schools, maritime academy pathways, grad school timing, where and when to take other classes, one click preparation |

#### Retention & Workforce Intelligence
Aggregated, **non-PII** insights for the industry:

| Insight | Purpose |
|---------|---------|
| **Attrition Risk Indicators** | Help institutions understand why mariners leave (without identifying individuals) |
| **Credential Bottlenecks** | Identify where the licensing pipeline is broken and where and when people change companies|
| **Sea Time Gaps** | Understand workforce availability patterns |
** help mariners get placed in positions most fitting for them.

> **Privacy Principle:** Individual data is private. Aggregate insights help the industry without compromising anyone's autonomy.

---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Framework** | Next.js 14 (App Router) | Server components by default, `'use client'` only for interactivity |
| **Language** | TypeScript (strict mode) | All files `.ts`/`.tsx` – no `any` types allowed |
| **Styling** | Tailwind CSS | Utility-first, no separate CSS files |
| **Components** | shadcn/ui + Lucide icons | Use when they simplify; don't over-engineer |
| **Database** | Supabase (PostgreSQL) | Auth, DB, Storage – RLS enabled on ALL tables |
| **Maps** | Mapbox GL JS | Satellite imagery for port pages |
| **PDF** | pdf-lib | Client-side generation (no server costs) |
| **Validation** | Zod | Runtime validation for all user inputs |
| **APIs** | Gmail, OpenWeather, DVIDS | See integrations section |
| **Hosting** | Vercel | Auto-deploy from `main` branch |

**Developer:** Alec (intermediate beginner in web development – domain expert in maritime careers)

**Project Root:** `~/dev/civsail-fresh`

---

## 🏗️ Architecture Principles

### Build for the Future

This codebase is **infrastructure**, not a throwaway project:

1. **Data Pipeline Ready** – Structure data to support future analytics, ETL, real-time features, mobile apps
2. **Modular Design** – Every feature extractable into its own module
3. **API-First** – All data through API routes (enables future mobile app, third-party integrations)
4. **Event-Driven Hooks** – Analytics/tracking hooks ready (connect later to PostHog, Mixpanel, etc.)

### Code Quality Priorities (in order)

1. **Security** – Never compromise on auth, validation, secrets, privacy
2. **Correctness** – Code does what it claims
3. **Readability** – Future developers can understand it (including future-Alec)
4. **Performance** – Fast for users on ship WiFi
5. **Features** – Only after the above are satisfied

---

## 🔒 Security Standards

### Authentication & Authorization
```typescript
// ALWAYS check auth in protected API routes
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { ok: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
      { status: 401 }
    );
  }
  // Proceed with authenticated user...
}
```

### Input Validation
```typescript
// ALWAYS validate inputs with Zod
import { z } from 'zod';

const ProfileSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  refNumber: z.string().regex(/^\d{7}$/, 'Must be 7-digit NMC reference'),
});

const parsed = ProfileSchema.safeParse(body);
if (!parsed.success) {
  return Response.json(
    { ok: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues } },
    { status: 400 }
  );
}
```

### Secrets Management
```typescript
// ✅ Server-side only (no NEXT_PUBLIC_ prefix)
const apiKey = process.env.DVIDS_API_KEY;

// ❌ NEVER expose secrets to client
const apiKey = process.env.NEXT_PUBLIC_SECRET_KEY; // WRONG!
```

### Security Checklist (Every Feature)
- [ ] Auth check on protected routes
- [ ] Input validation with Zod
- [ ] RLS policies on new tables
- [ ] No secrets in client code
- [ ] Rate limiting on public endpoints
- [ ] Privacy-preserving by default

---

## 📝 Documentation Standards

### File Headers
```typescript
/**
 * @file PayCalculator.tsx
 * @description Calculate and compare mariner pay across ship classes
 *
 * @purpose Help mariners make informed decisions about ship assignments
 *          by showing real earnings potential, not just base wages.
 *
 * @example
 * <PayCalculator shipClass="t-ake" daysDeployed={120} />
 */
```

### Function Documentation
```typescript
/**
 * Calculate total annual earnings for a mariner on a specific ship class
 *
 * Includes: base wage, overtime, premium pay, retention bonus, benefits value
 * Does NOT include: per diem (variable), travel reimbursement
 *
 * @param shipClass - The ship class (e.g., 't-ake', 't-ao')
 * @param position - Mariner's position (e.g., 'AB', 'OS', '3M')
 * @param daysDeployed - Expected deployment days per year
 * @returns Estimated annual earnings breakdown
 *
 * @note Wages based on 2024 MEBA/SIU contracts; update annually
 */
```

### Comments – Explain WHY and Maritime Context
```typescript
// ❌ BAD: States the obvious
const isExpired = date < today; // Check if expired

// ✅ GOOD: Explains business logic
// NMC allows a 1-year grace period for renewal, but most employers
// won't let you sail with expired credentials. We warn at 90 days
// to give mariners time to schedule the physical and paperwork.
const isExpiringSoon = daysBetween(today, date) <= 90;
```

### TODO Format
```typescript
// TODO(alec): Add loading skeleton
// TODO(security): Rate limit before launch
// TODO(career-paths): Integrate with credential roadmap
// FIXME: Breaks when ship name has apostrophe (O'Brien)
```

---

## 🔍 SEO Standards

### Every Page Needs
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T-AKE Ship Class Guide | CIVSail',
  description: 'Complete guide to MSC T-AKE dry cargo ships: pay rates, life aboard, deployment patterns, and career advice from experienced mariners.',

  openGraph: {
    title: 'T-AKE Ship Class Guide | CIVSail',
    description: 'Everything you need to know about sailing T-AKE',
    url: 'https://civsail.com/ships/msc/t-ake',
    images: [{ url: 'https://civsail.com/og/t-ake.jpg', width: 1200, height: 630 }],
  },

  alternates: {
    canonical: 'https://civsail.com/ships/msc/t-ake',
  },
};
```

### SEO Checklist
- [ ] Unique title (50-60 chars) with primary keyword
- [ ] Meta description (150-160 chars)
- [ ] Canonical URL
- [ ] Open Graph image (1200x630)
- [ ] One H1 per page matching topic
- [ ] Internal links to related content
- [ ] Descriptive image alt text
- [ ] Clean URLs (`/ships/t-ake` not `/ships?id=123`)

---

## 🔗 Internal Linking

### Route Constants (Single Source of Truth)
```typescript
// lib/utils/routes.ts
export const ROUTES = {
  home: '/',
  about: '/about',
  tools: '/tools',
  payCalculator: '/tools/pay-calculator',
  leaveChit: '/tools/leave-chit',
  ships: '/ships',
  tAke: '/ships/msc/t-ake',
  tAo: '/ships/msc/t-ao',
  ports: '/ports',
  guam: '/ports/far-east/guam',
  dashboard: '/dashboard',
  careerPaths: '/careers', // Future
} as const;
```

### Breadcrumb Pattern
Every page should show: Home → Parent → Current Page

---

## ♿ Accessibility Standards

```typescript
// All buttons need labels
<button aria-label="Close modal" onClick={onClose}>
  <X className="w-6 h-6" />
</button>

// All images need alt text
<img
  src="/ships/t-ake.jpg"
  alt="T-AKE class dry cargo ship underway, showing crane configuration"
/>

// Forms need labels
<label htmlFor="ref-number">NMC Reference Number</label>
<input id="ref-number" type="text" />
```

### a11y Checklist
- [ ] Images have descriptive alt text
- [ ] Form inputs have labels
- [ ] Color isn't the only indicator (add icons/text)
- [ ] Focus states visible
- [ ] Modals trap focus, close on Escape
- [ ] Logical heading hierarchy (H1→H2→H3)

---

## ⚡ Performance Standards

### Targets (Ship WiFi is Slow!)
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

### Patterns
```typescript
// Use Next.js Image
import Image from 'next/image';
<Image src="/hero.jpg" width={1200} height={600} priority alt="..." />

// Lazy load heavy components
const MapboxMap = dynamic(() => import('@/components/MapboxMap'), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse" />,
  ssr: false,
});

// Select only needed columns
const { data } = await supabase
  .from('profiles')
  .select('first_name, last_name') // Not select('*')
  .eq('user_id', userId);
```

---

## 📊 Data & Analytics Foundation

### Event Tracking (Ready for Analytics)
```typescript
// lib/analytics.ts
type EventName =
  | 'page_view'
  | 'tool_used'
  | 'credential_verified'
  | 'career_path_explored'
  | 'pay_calculated'
  | 'port_guide_viewed';

export function trackEvent(name: EventName, properties?: Record<string, unknown>) {
  // TODO: Connect to PostHog/Mixpanel
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', name, properties);
  }
}
```

### Privacy Principles
- Individual data is **private by default**
- Aggregate insights only (non-PII)
- Users can export their own data (GDPR-ready)
- No selling user data or attention

---

## 🚨 Error Handling

### Consistent Response Format
```typescript
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string; // User-friendly
  };
}
```

### User-Friendly Messages
```typescript
const ERROR_MESSAGES = {
  'UNAUTHORIZED': 'Please log in to continue.',
  'NOT_FOUND': "We couldn't find what you're looking for.",
  'VALIDATION_ERROR': 'Please check your input and try again.',
  'INTERNAL_ERROR': 'Something went wrong. Please try again.',
};
```

---

## 🌿 Git Workflow

### Branches
```
feature/pay-calculator-logic
fix/ship-popup-apostrophe
docs/career-path-documentation
```

### Commits
```
feat(tools): add pay calculation for T-AKE class
fix(auth): handle expired session gracefully
docs(career): add career path decision tree
```

---

## 📂 Project Structure

```
civsail-fresh/
├── app/
│   ├── (auth)/                 # Login, signup
│   ├── (dashboard)/            # Protected user pages
│   ├── api/                    # API routes
│   ├── ports/                  # Port guides
│   ├── ships/                  # Ship class pages
│   ├── tools/                  # Calculator tools
│   ├── careers/                # Career paths (future)
│   └── page.tsx                # Homepage
├── components/
│   ├── Navigation.tsx
│   ├── Breadcrumb.tsx
│   ├── ShipPopup.tsx
│   └── career/                 # Career mapping components (future)
├── lib/
│   ├── supabase/
│   ├── analytics.ts
│   ├── audit.ts
│   └── utils/
│       ├── routes.ts           # Route constants
│       ├── pay-calculator.ts   # Pay calculation logic
│       └── career-paths.ts     # Career mapping logic (future)
├── types/
└── supabase/
    └── migrations/
```

---

## 🗄️ Database Schema

### Current Tables
- **profiles** – User data, credentials, verification status
- **credentials** – NMC endorsements per user
- **nmc_verifications** – Verification request tracking

### Planned Tables
- **sea_time_logs** – Track sea time by vessel, employer, year
- **career_goals** – User's target credentials/positions
- **credential_requirements** – What's needed for each upgrade

### RLS (All Tables)
```sql
-- Users can only access their own data
CREATE POLICY "Users view own data"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🔌 Integrations

| Service | Purpose | Env Var |
|---------|---------|---------|
| Supabase | Auth, DB, Storage | `NEXT_PUBLIC_SUPABASE_URL`, etc. |
| Mapbox | Maps | `NEXT_PUBLIC_MAPBOX_TOKEN` |
| Gmail API | NMC email monitoring | `GMAIL_*` |
| OpenWeather | Port weather | `OPENWEATHER_API_KEY` |
| DVIDS | Ship news | `DVIDS_API_KEY` |

---

## ✅ Completed

- [x] Auth system with Supabase
- [x] Port pages (Guam complete, template ready)
- [x] Ship class pages (T-AKE, T-AO, T-AOE)
- [x] ShipPopup with DVIDS news
- [x] Navigation with mega menus

## 🚧 In Progress

Career mapping
- [ ] Tradeoff Analysis Tool

## 🔮 Future

- [ ] Sea Time Tracking
- [ ] Credential Progress Visualization
- [ ] Loan Forgiveness Calculator
- [ ] More ports (Norfolk, San Diego, Yokosuka)
- [ ] Mobile app
- [ ] Workforce intelligence dashboard

---

## 🎨 Design System

### Colors
```css
--blue-600: #2563eb   /* Primary */
--yellow-400: #facc15 /* Brand accent */
--green-500: #22c55e  /* Valid */
--yellow-500: #eab308 /* Warning */
--red-500: #ef4444    /* Error */
```

### Map Markers
🔵 Port facilities | 🟢 Base gates | 🔴 Local restaurants | 🟠 American food | 🟡 Bars | 🟣 Nightlife

---

## 📅 Last Updated
April 2025

---

*CIVSail: Neutral. Mariner-first. Built for autonomy.*
