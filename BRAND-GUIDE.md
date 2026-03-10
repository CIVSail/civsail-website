# CIVSail Brand & Style Guide for Developers

> **Purpose:** This document captures every visual pattern, color, font, spacing convention, and component style used across CIVSail so that any developer can build new pages (onboarding, dashboard, etc.) that look and feel native to the existing site.

---

## 1. Color System

### Primary Brand Colors

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| **CIV Yellow** | `#facc15` | `yellow-400` | Brand accent, gradient text, section labels, CTA highlights |
| **Sail Blue** | `#2563eb` | `blue-600` | Primary buttons, links, focus rings, interactive elements |
| **Deep Navy (background)** | `#0a0f1a` | custom | Homepage / dark-section background |

### Logo Treatment
The CIVSail wordmark in the footer uses:
```
"CIV" → text-yellow-400
"Sail" → text-blue-400
```

### UI Blues (buttons, links, interactive)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Primary Button | `#2563eb` | `blue-600` | All primary CTAs |
| Primary Hover | `#3b82f6` | `blue-500` | Button hover states |
| Disabled | `#60a5fa` | `blue-400` | `disabled:bg-blue-400` |
| Link Text | `#2563eb` | `blue-600` | Inline links on light backgrounds |
| Link Hover | `#1d4ed8` | `blue-700` | Link hover on light backgrounds |
| Focus Ring | `#3b82f6` | `blue-500` | `focus:ring-blue-500` on form inputs |

### Status / Semantic Colors

| Status | Hex | Tailwind | Usage |
|--------|-----|----------|-------|
| Success / Valid | `#22c55e` | `green-500` | Success badges, file upload confirmation, verified states |
| Warning | `#eab308` | `yellow-500` | Expiring-soon badges, attention callouts |
| Error / Destructive | `#ef4444` | `red-500` | Error alerts, remove buttons, error text |
| Error Background | — | `bg-red-50 border-red-200` | Error alert containers (light mode) |
| Success Background | — | `bg-green-50 border-green-200` | File uploaded confirmation cards |

### Light Mode Surfaces (auth pages, onboarding, dashboard, nav)

| Element | Classes |
|---------|---------|
| Page background | `bg-gray-50` |
| Card / form container | `bg-white rounded-2xl shadow-lg` |
| Nav bar | `bg-white shadow-md border-b border-gray-200` |
| Input borders | `border-gray-300` |
| Subtle dividers | `border-gray-100` or `border-gray-200` |
| Muted text | `text-gray-500` or `text-gray-600` |
| Heading text | `text-gray-900` |
| Body text | `text-gray-700` |

### Dark Mode Surfaces (homepage, editorial-style sections)

| Element | Classes / Values |
|---------|-----------------|
| Page background | `bg-[#0a0f1a]` |
| Card background | `bg-white/[0.02]` or `bg-white/[0.025]` |
| Card border | `border-white/[0.07]` |
| Card hover border | `border-yellow-400/25` or `border-blue-400/25` |
| Primary text | `text-slate-100` |
| Secondary text | `text-white/50` or `text-white/45` |
| Muted text | `text-white/[0.38]` or `text-white/[0.28]` |
| Section label (uppercase) | `text-green-500`, `text-yellow-400`, or `text-blue-400` |

---

## 2. Typography

### Font Stack

| Font | CSS Variable | Tailwind Class | Usage |
|------|-------------|----------------|-------|
| **Sora** | `--font-sora` | `font-heading` | All headings, card titles, section headers |
| **DM Sans** | `--font-dm-sans` | `font-body` | Body text, descriptions, labels, buttons |
| **DM Serif Display** | `--font-serif` | `font-serif` | Editorial prose (article body text) |
| **Geist Sans** | `--font-geist-sans` | `font-sans` | System fallback / default sans |

### Heading Scale (dark sections)

| Level | Classes |
|-------|---------|
| H1 (hero) | `font-heading font-extrabold text-[clamp(2.6rem,5.5vw,4rem)] leading-[1.08] tracking-[-0.03em]` |
| H2 (section) | `font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em]` |
| H3 (card title) | `font-heading font-bold text-[1.2rem] text-slate-100 tracking-[-0.01em]` |
| H3 (small card) | `font-heading font-semibold text-[0.95rem] text-slate-100 tracking-[-0.01em]` |

### Heading Scale (light sections — auth, onboarding, dashboard)

| Level | Classes |
|-------|---------|
| H1 | `text-2xl font-bold text-gray-900` or `text-3xl font-bold text-gray-900` |
| H2 | `text-xl font-semibold text-gray-900` |
| Section subheader | `text-xs uppercase tracking-wide font-semibold text-gray-500` |

### Body Text

| Context | Classes |
|---------|---------|
| Dark bg — primary | `font-body text-[0.95rem] text-white/45 leading-[1.7]` |
| Dark bg — secondary | `font-body text-[0.84rem] text-white/45 leading-[1.7]` |
| Dark bg — fine print | `font-body text-[0.76rem] text-white/25` |
| Light bg — paragraph | `text-gray-600` (typically no explicit size, defaults to base) |
| Light bg — helper text | `text-sm text-gray-500` |
| Light bg — labels | `text-sm font-medium text-gray-700` |

### Section Labels (uppercase pill/tag)

```
font-body font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-green-500
```
Used above section headings to provide context (e.g., "Live now", "Help us get there").

---

## 3. Spacing & Layout

### Page-Level

| Pattern | Value |
|---------|-------|
| Max content width | `max-w-[1000px]` to `max-w-[1200px]` for full sections |
| Form max width | `max-w-md` (auth) or `max-w-2xl` (onboarding) |
| Section vertical padding | `py-[5.5rem]` (dark), `py-12` (light) |
| Section horizontal padding | `px-8` (dark sections), `px-4` (light/auth) |
| Container | `container mx-auto px-4` (nav, light sections) |

### Card Padding

| Context | Value |
|---------|-------|
| Auth cards | `p-8` |
| Homepage cards | `p-[22px]` or `p-[26px]` |
| Alert/error banners | `p-4` |
| Form field spacing | `space-y-6` |

### Common Gaps

| Between | Value |
|---------|-------|
| Grid cards | `gap-4` or `gap-5` |
| Two-column layout | `gap-7` |
| Button groups | `gap-4` |
| Label to input | `mb-2` |
| Section heading to content | `mb-8` to `mb-12` |

---

## 4. Component Patterns

### Primary Button

```tsx
// Standard primary button (auth pages, forms)
<button className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors">
  Sign Up
</button>

// Hero-style primary button (dark backgrounds)
<Link className="font-body bg-blue-600 text-white px-12 py-[13px] rounded-[9px] text-[0.92rem] font-semibold shadow-[0_2px_12px_rgba(37,99,235,0.35)] hover:bg-blue-500 transition-all duration-300">
  Ships
</Link>
```

### Secondary / Outline Button

```tsx
<button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
  Back
</button>
```

### Ghost / Skip Button

```tsx
<button className="text-sm text-gray-500 hover:text-gray-700">
  Skip for now →
</button>
```

### Text Input

```tsx
<input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
```

- Always paired with a `<label className="block text-sm font-medium text-gray-700 mb-2">`
- Required fields marked with `*` in label text
- Helper text below input: `<p className="text-sm text-gray-500 mt-1">`

### Error Alert

```tsx
<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
  <p className="text-sm text-red-600">{error}</p>
</div>
```

### Success Confirmation (file uploads, verified states)

```tsx
<div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
  <div className="flex items-center space-x-2">
    <span className="text-green-600">✓</span>
    <span className="text-sm font-medium text-gray-900">{fileName}</span>
  </div>
  <button className="text-red-600 hover:text-red-800 transition-colors px-2 py-1">Remove</button>
</div>
```

### Card (light mode)

```tsx
<div className="bg-white rounded-2xl shadow-lg p-8">
  {/* content */}
</div>
```

### Card (dark mode — homepage)

```tsx
<div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-[22px] transition-all duration-300 hover:border-yellow-400/25 hover:-translate-y-[3px]">
  {/* content */}
</div>
```

### Progress Indicator (onboarding stepper)

```tsx
<div className="flex items-center justify-center space-x-4">
  {[1, 2, 3].map((step) => (
    <div key={step} className="flex items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
        currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {step}
      </div>
      {step < 3 && (
        <div className={`w-16 h-1 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
      )}
    </div>
  ))}
</div>
```

### Navigation Link (light mode nav bar)

```tsx
<Link className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
  About Us
</Link>
```

### Dropdown Menu

```tsx
<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
  <div className="px-6">
    <h3 className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3">Section Title</h3>
    <Link className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
      Menu Item
    </Link>
  </div>
</div>
```

### Status Badge / Pill

```tsx
// Light bg pill
<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Category</span>

// Dark bg pill
<span className="font-body text-[0.6rem] font-semibold tracking-[0.05em] uppercase px-[6px] py-[2px] rounded bg-green-500/10 text-green-400">
  Growing
</span>
```

### Section Divider

```tsx
// Light mode
<div className="border-t border-gray-200 mt-4 pt-4" />

// Dark mode
<div className="w-7 h-[2px] mb-[10px] rounded-sm" style={{ background: 'linear-gradient(90deg, #facc15, transparent)' }} />
```

---

## 5. Animation Patterns

### FadeIn Component
Used extensively on the homepage. Elements fade up into view when they enter the viewport.

```tsx
import { FadeIn } from '@/components/FadeIn';

// Stagger children with delay prop (in ms)
<FadeIn>           {/* Immediate */}
<FadeIn delay={120}> {/* Slight delay */}
<FadeIn delay={240}> {/* More delay */}
```

- Slides up 24px while fading from 0 to 1 opacity
- Duration: `0.6s ease`
- Trigger: IntersectionObserver at 15% threshold (fires once)

### Hover Transitions

| Element | Effect |
|---------|--------|
| Homepage cards | `hover:-translate-y-[3px]` + border color change |
| Buttons | `transition-colors` (color swap only) |
| Links | `transition-colors` |
| Nav dropdowns | `transition-colors` on items |

---

## 6. Gradients & Decorative Elements

### Page-Level Background Gradients (dark)

```css
/* Hero section radial glows */
background: radial-gradient(ellipse 70% 55% at 45% 35%, rgba(37,99,235,0.1) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 65%, rgba(250,204,21,0.04) 0%, transparent 60%);

/* Subtle grid overlay */
background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
background-size: 72px 72px;
opacity: 0.02;
```

### Onboarding Page Background (light)

```tsx
<div className="bg-gradient-to-br from-blue-50 via-white to-gray-50">
```

### Featured Card Gradients (dark bg)

```css
/* Blue-tinted card */
background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.03));
border-color: border-blue-500/[0.12];

/* Green-tinted card */
background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.03));
border-color: border-green-500/[0.12];

/* Yellow-tinted section */
background: linear-gradient(135deg, rgba(250,204,21,0.04), rgba(245,158,11,0.015));
border-color: border-yellow-400/10;
```

### Hero Text Gradient

```tsx
<span className="bg-gradient-to-br from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
  life as a mariner.
</span>
```

---

## 7. Border Radius Scale

| Element | Radius |
|---------|--------|
| Buttons (primary) | `rounded-lg` (0.5rem) or `rounded-[9px]` |
| Form inputs | `rounded-lg` |
| Auth/onboarding cards | `rounded-2xl` (1rem) |
| Homepage cards | `rounded-xl` (0.75rem) or `rounded-2xl` |
| Dropdown menus | `rounded-lg` |
| Badges/pills | `rounded-full` or `rounded-md` |
| Progress step circles | `rounded-full` |
| Featured callout boxes | `rounded-[20px]` |
| Icon containers | `rounded-[9px]` |

---

## 8. Shadows

| Element | Shadow |
|---------|--------|
| Auth/form cards | `shadow-lg` |
| Navigation | `shadow-md` |
| Dropdown menus | `shadow-xl` |
| Hero buttons (dark bg) | `shadow-[0_2px_12px_rgba(37,99,235,0.35),0_0px_30px_rgba(37,99,235,0.1)]` |
| Hero buttons hover | `shadow-[0_2px_16px_rgba(37,99,235,0.5),0_0px_40px_rgba(37,99,235,0.15)]` |

---

## 9. Icons

- **Icon library:** Inline SVGs (no external icon library for most of the site)
- **Navigation icons:** Hand-coded SVG paths (chevrons, search, hamburger)
- **Content icons:** Emoji used for card identifiers (e.g., ship pages, tools list)
- **Icon sizing in nav:** `h-4 w-4` (chevrons), `h-5 w-5` (social, search), `h-7 w-7` (mobile hamburger)
- **Icon containers (dark bg):** `w-9 h-9 rounded-[9px] bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center`
- **Note:** The project lists `lucide-react` as available in CLAUDE.md — use Lucide icons for any new UI if SVGs become unwieldy

---

## 10. Logo

- **File:** `/public/CIVSail-Logo-Crop.png`
- **Display:** Always rendered with `next/image`
- **Sizes used:**
  - Nav bar: `width={180} height={40} className="h-8 w-auto"`
  - Auth/onboarding pages: `width={200} height={50} className="mx-auto mb-4"`
- **Text wordmark (footer):** `font-heading font-extrabold text-[1.2rem]` with yellow/blue split

---

## 11. Form Pattern Summary

All forms across the site follow this structure:

```tsx
<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">

    {/* Logo */}
    <div className="text-center mb-8">
      <Image src="/CIVSail-Logo-Crop.png" ... />
      <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
      <p className="text-gray-600 mt-2">Subtitle text</p>
    </div>

    {/* Error (conditional) */}
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600">{error}</p>
    </div>

    {/* Form */}
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Label *</label>
        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
      </div>
      <button className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors">
        Submit
      </button>
    </form>

    {/* Footer link */}
    <p className="text-center text-sm text-gray-600 mt-6">
      Already have an account? <Link className="text-blue-600 hover:text-blue-700 font-medium">Log In</Link>
    </p>
  </div>
</div>
```

---

## 12. Sector Color Map

Each sector has a dedicated color scheme for cards and badges:

| Sector | Border | Background | Accent | Pill |
|--------|--------|------------|--------|------|
| Government | `border-red-300` | `from-red-50` | `text-red-700` | `bg-red-100 text-red-800` |
| Commercial Deep Sea | `border-blue-400` | `from-blue-50` | `text-blue-700` | `bg-blue-100 text-blue-800` |
| Offshore Oil Rigs | `border-amber-400` | `from-amber-50` | `text-amber-700` | `bg-amber-100 text-amber-800` |
| Offshore Supply | `border-emerald-300` | `from-emerald-50` | `text-emerald-700` | `bg-emerald-100 text-emerald-800` |
| Tug Boats | `border-purple-300` | `from-purple-50` | `text-purple-700` | `bg-purple-100 text-purple-800` |
| Barges | `border-slate-300` | `from-slate-50` | `text-slate-700` | `bg-slate-100 text-slate-700` |
| Ferries | `border-cyan-300` | `from-cyan-50` | `text-cyan-700` | `bg-cyan-100 text-cyan-800` |
| Cruise Ships | `border-pink-300` | `from-pink-50` | `text-pink-700` | `bg-pink-100 text-pink-800` |
| Yachts | `border-yellow-300` | `from-yellow-50` | `text-yellow-700` | `bg-yellow-100 text-yellow-800` |
| Fishing Boats | `border-orange-400` | `from-orange-50` | `text-orange-700` | `bg-orange-100 text-orange-800` |
| Pilots | `border-indigo-400` | `from-indigo-50` | `text-indigo-700` | `bg-indigo-100 text-indigo-800` |

---

## 13. Key Do's and Don'ts

### DO

- Use `font-heading` (Sora) for all headings and card titles
- Use `font-body` (DM Sans) for body text, labels, buttons
- Use `blue-600` for all primary CTAs — never deviate
- Use `rounded-lg` for buttons/inputs and `rounded-2xl` for cards
- Use `focus:ring-2 focus:ring-blue-500` on all focusable form elements
- Use `transition-colors` on interactive elements
- Keep auth/form pages on `bg-gray-50` with white card containers
- Match the onboarding gradient: `bg-gradient-to-br from-blue-50 via-white to-gray-50`
- Use the existing error/success alert patterns exactly

### DON'T

- Don't use arbitrary colors — stick to the Tailwind palette above
- Don't use `font-sans` or system fonts for headings — always `font-heading`
- Don't use `shadow-sm` or `shadow-md` on form cards — use `shadow-lg`
- Don't add new border radius values — use the existing scale
- Don't use dark mode (dark bg `#0a0f1a`) for dashboard/onboarding — those are light mode
- Don't install new font packages — the fonts are already loaded in the root layout
- Don't use Tailwind `prose` classes — use the existing `.editorial-prose` or `.neo-prose` custom classes instead

---

## 14. Prompts for Your Developer

Copy-paste these prompts to help your developer build consistent UI.

---

### Prompt: General Context

> You are building pages for CIVSail, a Next.js 14 App Router project using TypeScript, Tailwind CSS, and Supabase. The project uses these custom fonts loaded via `next/font/google` in the root layout:
> - `font-heading` (Sora) — all headings, card titles, nav items
> - `font-body` (DM Sans) — body text, labels, buttons, descriptions
> - `font-serif` (DM Serif Display) — editorial article body only
>
> The site has two visual modes:
> 1. **Dark mode** (homepage, editorials): bg `#0a0f1a`, text `slate-100`/`white/45`, cards with `bg-white/[0.025]` and `border-white/[0.07]`
> 2. **Light mode** (auth, onboarding, dashboard, tools): bg `gray-50`, white cards with `shadow-lg` and `rounded-2xl`, text `gray-900`/`gray-700`/`gray-600`
>
> The onboarding and dashboard pages are **light mode**. Primary action color is `blue-600` everywhere.

---

### Prompt: Build a New Onboarding Step

> Build a new onboarding step component for CIVSail that matches the existing visual style.
>
> **Design specs:**
> - Page background: `bg-gradient-to-br from-blue-50 via-white to-gray-50`
> - Card: `bg-white rounded-2xl shadow-lg p-8` inside a `max-w-2xl mx-auto`
> - Step title: `text-xl font-semibold text-gray-900 mb-4`
> - Form labels: `block text-sm font-medium text-gray-700 mb-2`
> - Inputs: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`
> - Required fields: append ` *` to label text
> - Helper text below inputs: `text-sm text-gray-500 mt-1`
> - Errors: `<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>`
> - Primary button: `bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors`
> - Secondary/back button: `px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors`
> - Navigation between steps: `flex justify-between mt-8 pt-6 border-t border-gray-200`
> - Progress stepper: circles `w-10 h-10 rounded-full` — active: `bg-blue-600 text-white`, inactive: `bg-gray-200 text-gray-500` — connected by `w-16 h-1` bars

---

### Prompt: Build a Dashboard Section/Tab

> Build a dashboard tab/section for CIVSail.
>
> **Design specs:**
> - Dashboard is light mode: `bg-gray-50` page background
> - Content cards: `bg-white rounded-2xl shadow-lg p-8`
> - Section headings: `text-xl font-semibold text-gray-900`
> - Sub-section labels: `text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3`
> - Data display labels: `text-sm font-medium text-gray-700`
> - Data values: `text-gray-900`
> - Status badges:
>   - Valid/active: `bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full`
>   - Warning/expiring: `bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full`
>   - Expired/error: `bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full`
> - Action buttons: `bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium`
> - Dividers between sections: `border-t border-gray-200 mt-6 pt-6`
> - Empty states: centered text with `text-gray-500` and a subtle icon

---

### Prompt: Build a Modal/Dialog

> Build a modal dialog for CIVSail.
>
> **Design specs:**
> - Backdrop: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center`
> - Modal container: `bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8`
> - Title: `text-xl font-semibold text-gray-900 mb-4`
> - Close button: top-right corner with `text-gray-400 hover:text-gray-600`
> - Form elements: same as onboarding (see above)
> - Primary action: `bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg`
> - Cancel/secondary: `border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50`
> - Button row: `flex gap-3 mt-6`

---

### Prompt: Style a Data Table

> Build a data table for CIVSail dashboard.
>
> **Design specs:**
> - Container: `bg-white rounded-2xl shadow-lg overflow-hidden`
> - Table header: `bg-gray-50`
> - Header cells: `text-xs uppercase tracking-wide font-semibold text-gray-500 px-6 py-3 text-left`
> - Body cells: `px-6 py-4 text-sm text-gray-700`
> - Row dividers: `border-b border-gray-100`
> - Row hover: `hover:bg-gray-50 transition-colors`
> - Empty state: `text-center py-12 text-gray-500`

---

### Prompt: Match the Existing Auth Pages

> I need to build a new auth-related page (e.g., reset password, email verification). Match the existing CIVSail login/signup page style exactly:
>
> - Outer container: `min-h-screen flex items-center justify-center bg-gray-50 px-4`
> - Card: `max-w-md w-full bg-white rounded-2xl shadow-lg p-8`
> - Logo: `<Image src="/CIVSail-Logo-Crop.png" width={200} height={50} className="mx-auto mb-4" />`
> - Page title: `text-2xl font-bold text-gray-900` centered
> - Subtitle: `text-gray-600 mt-2` centered
> - Use `space-y-6` between form fields
> - Input style: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`
> - Submit button: `w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors`
> - Footer link: `text-center text-sm text-gray-600 mt-6` with `text-blue-600 hover:text-blue-700 font-medium` link

---

## 15. Tech Stack Quick Reference

| What | How |
|------|-----|
| Framework | Next.js 14, App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS (utility-first, no separate CSS files) |
| Fonts | `next/font/google` — Sora, DM Sans, DM Serif Display, Geist |
| Auth | Supabase Auth (email/password) |
| Database | Supabase (PostgreSQL with RLS) |
| Images | `next/image` always |
| PDF generation | `pdf-lib` (client-side) |
| Animations | Custom `<FadeIn>` component using IntersectionObserver |
| Deploy | Vercel, auto-deploy from `main` |
