/**
 * @file PortSubmissionForm.tsx
 * @description Community submission form for port knowledge
 *
 * @purpose Let mariners share firsthand port intel — restaurants, bars,
 * transportation, safety tips, etc. Designed for progressive disclosure:
 * minimum friction for a quick tip, optional accordion sections for
 * structured details. Always dark-themed.
 *
 * @example
 * // Embedded on a port page (port name locked)
 * <PortSubmissionForm portName="Guam" />
 *
 * // Standalone page (user types port name, gets autocomplete)
 * <PortSubmissionForm portSuggestions={['Guam', 'Sasebo', ...]} />
 */

'use client';

import { useState } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  Car,
  Anchor,
  Shield,
  Map,
  Plus,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

// --- Types ---

interface PlaceEntry {
  name: string;
  type: string;
  priceRange: string;
  tips: string;
}

interface PortSubmissionFormProps {
  /** Pre-fills and locks the port name field */
  portName?: string;
  /** Region context for email (e.g., "Far East") */
  portRegion?: string;
  /** Port names for datalist autocomplete (standalone page) */
  portSuggestions?: string[];
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

// --- Constants ---

const PLACE_TYPES = [
  'Local Restaurant',
  'American Food',
  'Bar/Lounge',
  'Nightlife',
  'Activity/Sightseeing',
  'Shopping',
  'Services',
];

const PRICE_RANGES = ['$', '$$', '$$$'];

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/25';

const TEXTAREA_CLASS =
  'w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/25 resize-none';

// --- Component ---

export default function PortSubmissionForm({
  portName,
  portRegion,
  portSuggestions,
}: PortSubmissionFormProps) {
  // Form state
  const [portNameValue, setPortNameValue] = useState(portName || '');
  const [mainContent, setMainContent] = useState('');
  const [suggestedPort, setSuggestedPort] = useState('');

  // Places & Venues (repeatable)
  const [places, setPlaces] = useState<PlaceEntry[]>([
    { name: '', type: '', priceRange: '', tips: '' },
  ]);

  // Optional detail sections
  const [gettingAround, setGettingAround] = useState('');
  const [operationsBaseInfo, setOperationsBaseInfo] = useState('');
  const [safetyTips, setSafetyTips] = useState('');
  const [regionalTravel, setRegionalTravel] = useState('');

  // About You
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [shipName, setShipName] = useState('');
  const [recency, setRecency] = useState('');

  // Honeypot
  const [website, setWebsite] = useState('');

  // Submit state
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Inline validation
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // --- Place helpers ---

  const addPlace = () => {
    if (places.length < 20) {
      setPlaces([...places, { name: '', type: '', priceRange: '', tips: '' }]);
    }
  };

  const removePlace = (index: number) => {
    setPlaces(places.filter((_, i) => i !== index));
  };

  const updatePlace = (index: number, field: keyof PlaceEntry, value: string) => {
    const updated = [...places];
    updated[index] = { ...updated[index], [field]: value };
    setPlaces(updated);
  };

  // --- Submit ---

  const resetForm = () => {
    setPortNameValue(portName || '');
    setMainContent('');
    setSuggestedPort('');
    setPlaces([{ name: '', type: '', priceRange: '', tips: '' }]);
    setGettingAround('');
    setOperationsBaseInfo('');
    setSafetyTips('');
    setRegionalTravel('');
    setSubmitterName('');
    setSubmitterEmail('');
    setShipName('');
    setRecency('');
    setWebsite('');
    setState('idle');
    setErrorMessage('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors: Record<string, string> = {};
    if (!portNameValue.trim() || portNameValue.trim().length < 2) {
      errors.portName = 'Please enter a port name (at least 2 characters)';
    }
    if (!mainContent.trim() || mainContent.trim().length < 10) {
      errors.mainContent = 'Please share at least a short tip (10+ characters)';
    }
    if (submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)) {
      errors.submitterEmail = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setState('error');
      return;
    }

    setFieldErrors({});
    setState('loading');

    try {
      // Filter out empty places
      const filledPlaces = places.filter((p) => p.name || p.tips);

      const res = await fetch('/api/port-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portName: portNameValue.trim(),
          mainContent: mainContent.trim(),
          suggestedPort: suggestedPort.trim() || undefined,
          places: filledPlaces.length > 0 ? filledPlaces : undefined,
          gettingAround: gettingAround.trim() || undefined,
          operationsBaseInfo: operationsBaseInfo.trim() || undefined,
          safetyTips: safetyTips.trim() || undefined,
          regionalTravel: regionalTravel.trim() || undefined,
          submitterName: submitterName.trim() || undefined,
          submitterEmail: submitterEmail.trim() || undefined,
          shipName: shipName.trim() || undefined,
          recency: recency || undefined,
          portRegion: portRegion || undefined,
          website,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMessage(
          data.message || 'Something went wrong. Please try again.'
        );
        setState('error');
        return;
      }

      setState('success');
    } catch {
      setErrorMessage(
        'Something went wrong sending your submission. Please try again, or email us directly at support@civsail.com'
      );
      setState('error');
    }
  };

  // --- Success State ---

  if (state === 'success') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
        <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-emerald-300 mb-2">
          Thanks for contributing!
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Your submission helps fellow mariners navigate{' '}
          {portNameValue || 'ports'} with confidence. We&apos;ll review this and
          add it to the port page.
        </p>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-white/10"
        >
          Submit another
        </button>
      </div>
    );
  }

  // --- Form ---

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative">
      {/* ── Section 1: Port Identification ── */}
      <div>
        <label
          htmlFor="port-name"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Which port is this about? *
        </label>
        {portName ? (
          <div className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 text-slate-200 text-sm">
            {portName}
          </div>
        ) : (
          <>
            <input
              id="port-name"
              type="text"
              list="port-suggestions"
              value={portNameValue}
              onChange={(e) => {
                setPortNameValue(e.target.value);
                if (fieldErrors.portName)
                  setFieldErrors((prev) => ({ ...prev, portName: '' }));
              }}
              placeholder="e.g., Rota, Spain or Subic Bay, Philippines"
              maxLength={200}
              className={INPUT_CLASS}
            />
            {portSuggestions && portSuggestions.length > 0 && (
              <datalist id="port-suggestions">
                {portSuggestions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            )}
          </>
        )}
        {fieldErrors.portName && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.portName}</p>
        )}
        {!portName && (
          <p className="text-white/25 text-xs mt-2">
            Don&apos;t see a page for this port yet? Submit what you know — once
            we get enough info from the community, we&apos;ll create the page.
          </p>
        )}
      </div>

      {/* ── Section 2: Main Content (required) ── */}
      <div>
        <label
          htmlFor="main-content"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          What should other mariners know about this port? *
        </label>
        <textarea
          id="main-content"
          value={mainContent}
          onChange={(e) => {
            setMainContent(e.target.value);
            if (fieldErrors.mainContent)
              setFieldErrors((prev) => ({ ...prev, mainContent: '' }));
          }}
          placeholder="A great restaurant, a tip for getting around, something you wish you knew before your first visit..."
          rows={5}
          maxLength={5000}
          className={TEXTAREA_CLASS}
        />
        <div className="flex justify-between mt-1">
          {fieldErrors.mainContent ? (
            <p className="text-red-400 text-xs">{fieldErrors.mainContent}</p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs ${mainContent.length > 4000 ? 'text-yellow-400/60' : 'text-white/20'}`}
          >
            {mainContent.length.toLocaleString()}/5,000
          </span>
        </div>
      </div>

      {/* ── Section 3: Port Suggestion ── */}
      <div>
        <label
          htmlFor="suggested-port"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          What port page should we create next?
        </label>
        <input
          id="suggested-port"
          type="text"
          value={suggestedPort}
          onChange={(e) => setSuggestedPort(e.target.value)}
          placeholder="e.g., Yokosuka, Japan"
          maxLength={200}
          className={INPUT_CLASS}
        />
        <p className="text-white/25 text-xs mt-1">
          Optional — suggest a port you&apos;d like to see on CIVSail
        </p>
      </div>

      {/* ── Section 4: Optional Detail Sections ── */}
      <div>
        <p className="text-sm text-slate-400 mb-3">
          Want to add more detail? These help us build better port pages.
        </p>

        <Accordion type="multiple" className="w-full">
          {/* Places & Venues */}
          <AccordionItem value="places" className="border-white/10">
            <AccordionTrigger className="text-slate-200 hover:no-underline hover:text-white [&>svg]:text-white/40">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                Places & Venues
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {places.map((place, index) => (
                  <div
                    key={index}
                    className="bg-white/[0.03] border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-slate-400 font-medium">
                        Place {index + 1}
                      </span>
                      {places.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlace(index)}
                          className="text-red-400/60 hover:text-red-400 transition-colors"
                          aria-label={`Remove place ${index + 1}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={place.name}
                      onChange={(e) =>
                        updatePlace(index, 'name', e.target.value)
                      }
                      placeholder="Place name"
                      maxLength={200}
                      className={`${INPUT_CLASS} mb-3`}
                    />

                    {/* Type chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {PLACE_TYPES.map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() =>
                            updatePlace(
                              index,
                              'type',
                              place.type === type ? '' : type
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                            place.type === type
                              ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Price range */}
                    <div className="flex gap-2 mb-3">
                      {PRICE_RANGES.map((range) => (
                        <button
                          type="button"
                          key={range}
                          onClick={() =>
                            updatePlace(
                              index,
                              'priceRange',
                              place.priceRange === range ? '' : range
                            )
                          }
                          className={`px-4 py-1 rounded-lg text-xs border transition-colors ${
                            place.priceRange === range
                              ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300'
                              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                          }`}
                        >
                          {range}{' '}
                          {range === '$'
                            ? 'Cheap'
                            : range === '$$'
                              ? 'Moderate'
                              : 'Pricey'}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={place.tips}
                      onChange={(e) =>
                        updatePlace(index, 'tips', e.target.value)
                      }
                      placeholder="Any tips for this place? Cash only, closed Sundays, best dish to order..."
                      rows={2}
                      maxLength={2000}
                      className={TEXTAREA_CLASS}
                    />
                  </div>
                ))}

                {places.length < 20 && (
                  <button
                    type="button"
                    onClick={addPlace}
                    className="w-full py-2.5 border border-dashed border-white/20 rounded-lg text-sm text-white/40 hover:text-white/60 hover:border-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add another place
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Getting Around */}
          <AccordionItem value="getting-around" className="border-white/10">
            <AccordionTrigger className="text-slate-200 hover:no-underline hover:text-white [&>svg]:text-white/40">
              <span className="flex items-center gap-2">
                <Car className="h-4 w-4 text-green-400" />
                Getting Around
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <textarea
                value={gettingAround}
                onChange={(e) => setGettingAround(e.target.value)}
                placeholder="How do you get from the ship/base to town? Taxis, buses, rental options? Typical taxi cost? Any apps or ride services that work well here?"
                rows={4}
                maxLength={2000}
                className={TEXTAREA_CLASS}
              />
              <CharCount value={gettingAround} max={2000} />
            </AccordionContent>
          </AccordionItem>

          {/* Operations & Base Info */}
          <AccordionItem value="operations" className="border-white/10">
            <AccordionTrigger className="text-slate-200 hover:no-underline hover:text-white [&>svg]:text-white/40">
              <span className="flex items-center gap-2">
                <Anchor className="h-4 w-4 text-purple-400" />
                Operations & Base Info
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <textarea
                value={operationsBaseInfo}
                onChange={(e) => setOperationsBaseInfo(e.target.value)}
                placeholder="What's the base/port like? NEX/commissary quality? WiFi availability? Liberty boat schedule? Anything about loading ops or port workers that future mariners should know?"
                rows={4}
                maxLength={2000}
                className={TEXTAREA_CLASS}
              />
              <CharCount value={operationsBaseInfo} max={2000} />
            </AccordionContent>
          </AccordionItem>

          {/* Safety & Practical Tips */}
          <AccordionItem value="safety" className="border-white/10">
            <AccordionTrigger className="text-slate-200 hover:no-underline hover:text-white [&>svg]:text-white/40">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-yellow-400" />
                Safety & Practical Tips
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <textarea
                value={safetyTips}
                onChange={(e) => setSafetyTips(e.target.value)}
                placeholder="Currency tips? Phone/SIM situation? Areas to avoid? Medical facilities? Local customs or etiquette to be aware of?"
                rows={4}
                maxLength={2000}
                className={TEXTAREA_CLASS}
              />
              <CharCount value={safetyTips} max={2000} />
            </AccordionContent>
          </AccordionItem>

          {/* Regional Travel */}
          <AccordionItem value="regional-travel" className="border-white/10">
            <AccordionTrigger className="text-slate-200 hover:no-underline hover:text-white [&>svg]:text-white/40">
              <span className="flex items-center gap-2">
                <Map className="h-4 w-4 text-cyan-400" />
                Regional Travel
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <textarea
                value={regionalTravel}
                onChange={(e) => setRegionalTravel(e.target.value)}
                placeholder="Any day trips or weekend trips worth taking? How did you get there — train, bus, rental car? How long did it take?"
                rows={4}
                maxLength={2000}
                className={TEXTAREA_CLASS}
              />
              <CharCount value={regionalTravel} max={2000} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ── Section 5: About You ── */}
      <div>
        <p className="text-sm font-medium text-slate-300 mb-3">About You</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder="Name or handle (optional)"
              maxLength={200}
              className={INPUT_CLASS}
            />
            <p className="text-white/20 text-xs mt-1">
              We credit contributors on port pages. Leave blank to stay
              anonymous.
            </p>
          </div>
          <div>
            <input
              type="email"
              value={submitterEmail}
              onChange={(e) => {
                setSubmitterEmail(e.target.value);
                if (fieldErrors.submitterEmail)
                  setFieldErrors((prev) => ({ ...prev, submitterEmail: '' }));
              }}
              placeholder="Email (optional)"
              maxLength={200}
              className={INPUT_CLASS}
            />
            {fieldErrors.submitterEmail ? (
              <p className="text-red-400 text-xs mt-1">
                {fieldErrors.submitterEmail}
              </p>
            ) : (
              <p className="text-white/20 text-xs mt-1">
                Only if you&apos;d like us to follow up. We won&apos;t share or
                spam you.
              </p>
            )}
          </div>
          <input
            type="text"
            value={shipName}
            onChange={(e) => setShipName(e.target.value)}
            placeholder="Ship or vessel you were on (optional)"
            maxLength={200}
            className={INPUT_CLASS}
          />
          <select
            value={recency}
            onChange={(e) => setRecency(e.target.value)}
            className={`${INPUT_CLASS} ${!recency ? 'text-white/25' : ''}`}
          >
            <option value="">How recently were you here?</option>
            <option value="current">Currently there</option>
            <option value="last-6-months">Within 6 months</option>
            <option value="1-2-years">1–2 years ago</option>
            <option value="3-plus-years">3+ years ago</option>
            <option value="heard">
              Haven&apos;t been yet (sharing what I&apos;ve heard)
            </option>
          </select>
        </div>
      </div>

      {/* ── Honeypot (hidden from real users) ── */}
      <div
        className="absolute opacity-0 top-0 left-0 h-0 w-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* ── Error Message ── */}
      {state === 'error' && errorMessage && (
        <div className="flex items-start gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Submit Button ── */}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
        {state === 'loading' ? 'Submitting...' : 'Submit Port Intel'}
      </button>
    </form>
  );
}

// --- Helper Components ---

function CharCount({ value, max }: { value: string; max: number }) {
  if (value.length === 0) return null;
  return (
    <p
      className={`text-xs mt-1 text-right ${value.length > max * 0.8 ? 'text-yellow-400/60' : 'text-white/20'}`}
    >
      {value.length.toLocaleString()}/{max.toLocaleString()}
    </p>
  );
}
