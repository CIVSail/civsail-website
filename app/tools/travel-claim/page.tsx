'use client';

/**
 * Travel Claim Generator - Main Page Component
 *
 * A step-by-step wizard for creating DD 1351-2 travel vouchers
 * and Comp Time for Travel request forms.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plane,
  MapPin,
  Clock,
  FileText,
  User,
  Building2,
  Ship,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Info,
  DollarSign,
  Calendar,
  Edit3,
  Car,
  Train,
  Bus,
  Home,
  Hotel,
  GraduationCap,
  Users,
  Navigation,
  CircleDot,
  ArrowRight,
} from 'lucide-react';

import {
  TravelClaimForm,
  ItineraryLeg,
  AdditionalExpense,
  TravelerInfo,
  WizardStep,
  LocationType,
  TransportType,
  StopReason,
  Location,
  LOCATION_OPTIONS,
  TRANSPORT_OPTIONS,
  STOP_REASON_OPTIONS,
  PURPOSE_OPTIONS,
  TIMEZONE_OPTIONS,
  getLocationLabel,
  getLocationPlaceholder,
  getDepartureDateTime,
  getArrivalDateTime,
} from './types';

import {
  calculateAllCompTime,
  formatHoursDisplay,
  formatDecimalHours,
  isTravelEligibleForCompTime,
} from './comp-time-utils';

import { generateAndDownloadPDFs } from './pdf-generator';
import { createPayClient } from '@/lib/supabase/pay-client';
// ============================================
// WIZARD STEPS CONFIGURATION
// ============================================

const WIZARD_STEPS: {
  key: WizardStep;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: 'overview', label: 'Trip Info', icon: <User className="w-4 h-4" /> },
  {
    key: 'itinerary',
    label: 'Itinerary',
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    key: 'expenses',
    label: 'Expenses',
    icon: <DollarSign className="w-4 h-4" />,
  },
  { key: 'comptime', label: 'Comp Time', icon: <Clock className="w-4 h-4" /> },
  { key: 'review', label: 'Review', icon: <FileText className="w-4 h-4" /> },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/** Progress indicator showing current step */
function StepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  onStepClick: (step: WizardStep) => void;
}) {
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-between mb-8">
      {WIZARD_STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.key);
        const isCurrent = step.key === currentStep;
        const isPast = index < currentIndex;
        const isClickable = isCompleted || isPast || isCurrent;

        return (
          <React.Fragment key={step.key}>
            <button
              onClick={() => isClickable && onStepClick(step.key)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-1 transition-all ${
                isClickable
                  ? 'cursor-pointer hover:scale-105'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                    : isCompleted || isPast
                    ? 'bg-violet-100 text-violet-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
              </div>
              <span
                className={`text-xs font-medium ${
                  isCurrent
                    ? 'text-violet-600'
                    : isPast || isCompleted
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </button>

            {index < WIZARD_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentIndex ? 'bg-violet-300' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/** Card wrapper with optional gradient header */
function SectionCard({
  title,
  icon,
  children,
  className = '',
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {icon}
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

/** Styled select dropdown */
function Select({
  id,
  value,
  onChange,
  options,
  className = '',
  placeholder = 'Select...',
}: {
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  className?: string;
  placeholder?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white 
        focus:ring-2 focus:ring-violet-500 focus:border-violet-500 
        transition-all text-gray-900 ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/** Styled text input */
function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  min,
  max,
  step,
}: {
  id: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      step={step}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white 
        focus:ring-2 focus:ring-violet-500 focus:border-violet-500 
        transition-all text-gray-900 placeholder:text-gray-400 ${className}`}
    />
  );
}

/** Info/Warning/Success box */
function InfoBox({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'success';
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  const icons = {
    info: <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
    success: <Check className="w-4 h-4 text-green-500" />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${styles[type]}`}
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

/** Get icon for location type */
function getLocationIcon(type: LocationType): React.ReactNode {
  const iconClass = 'w-4 h-4';
  switch (type) {
    case 'HOR':
      return <Home className={iconClass} />;
    case 'Ship':
      return <Ship className={iconClass} />;
    case 'Airport':
      return <Plane className={iconClass} />;
    case 'Training':
      return <GraduationCap className={iconClass} />;
    case 'Hotel':
      return <Hotel className={iconClass} />;
    case 'ContractHotel':
      return <Hotel className={iconClass} />;
    case 'Conference':
      return <Users className={iconClass} />;
    default:
      return <MapPin className={iconClass} />;
  }
}

/** Get icon for transport type */
function getTransportIcon(type: TransportType): React.ReactNode {
  const iconClass = 'w-4 h-4';
  switch (type) {
    case 'govt-ticket-flight':
    case 'commercial-flight-reimburse':
    case 'govt-aircraft':
      return <Plane className={iconClass} />;
    case 'taxi-uber':
    case 'rental-car':
    case 'pov-auto':
    case 'pov-motorcycle':
    case 'govt-vehicle':
      return <Car className={iconClass} />;
    case 'commercial-train-reimburse':
      return <Train className={iconClass} />;
    case 'commercial-bus-reimburse':
    case 'govt-bus':
      return <Bus className={iconClass} />;
    case 'ferry':
    case 'msc-navy-ship':
      return <Ship className={iconClass} />;
    default:
      return <Navigation className={iconClass} />;
  }
}

// ============================================
// DATE/TIME PICKER COMPONENT
// ============================================

interface DateTimePickerProps {
  dateValue: string;
  timeValue: string;
  timezoneValue: number;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onTimezoneChange: (tz: number) => void;
  dateLabel: string;
  timeLabel: string;
  id: string;
}

function DateTimePicker({
  dateValue,
  timeValue,
  timezoneValue,
  onDateChange,
  onTimeChange,
  onTimezoneChange,
  dateLabel,
  timeLabel,
  id,
}: DateTimePickerProps) {
  return (
    <div className="space-y-3">
      {/* Date Input */}
      <div>
        <label
          htmlFor={`${id}-date`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {dateLabel}
        </label>
        <input
          id={`${id}-date`}
          type="date"
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white 
            focus:ring-2 focus:ring-violet-500 focus:border-violet-500 
            transition-all text-gray-900"
        />
      </div>

      {/* Time Input */}
      <div>
        <label
          htmlFor={`${id}-time`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {timeLabel}
        </label>
        <input
          id={`${id}-time`}
          type="time"
          value={timeValue}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white 
            focus:ring-2 focus:ring-violet-500 focus:border-violet-500 
            transition-all text-gray-900"
        />
      </div>

      {/* Timezone Select */}
      <div>
        <label
          htmlFor={`${id}-tz`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Time Zone
        </label>
        <Select
          id={`${id}-tz`}
          value={timezoneValue}
          onChange={(v) => onTimezoneChange(parseFloat(v))}
          options={TIMEZONE_OPTIONS.map((tz) => ({
            value: tz.value,
            label: `${tz.label} (UTC${tz.value >= 0 ? '+' : ''}${tz.value})`,
          }))}
        />
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function TravelClaimGenerator() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('overview');
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Leg editing state
  const [editingLegId, setEditingLegId] = useState<string | null>(null);
  const [editingLegFromSummary, setEditingLegFromSummary] = useState<
    string | null
  >(null);

  // Form data
  const [formData, setFormData] = useState<TravelClaimForm>({
    traveler: {
      firstName: '',
      middleInitial: '',
      lastName: '',
      grade: 7,
      position: '',
      ssnLast4: '',
      dodId: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      isMasterOrChiefEngineer: false,
      workSchedule: '0800-1630',
      normalCommuteMinutes: 30,
    },
    authorizationNumber: '',
    travelOrdersIssued: true,
    purpose: '',
    customPurpose: '',
    travelType: 'CONUS',
    receivedAdvance: false,
    advanceAmount: 0,
    itinerary: [],
    additionalExpenses: [],
  });

  // Positions from Supabase
const [positions, setPositions] = useState<string[]>([]);
const [positionsLoading, setPositionsLoading] = useState(true);

// Fetch positions on mount
useEffect(() => {
  async function loadPositions() {
    try {
      const client = createPayClient();
      const { data: jobsData } = await client
        .from('jobs')
        .select('"Position Title"');
      
      if (jobsData) {
        setPositions(jobsData.map((j: { 'Position Title': string }) => j['Position Title']));
      }
    } catch (e) {
      console.warn('Could not load positions:', e);
      // Fallback
      setPositions([
        'Able Seaman', 'Boatswain', 'Chief Engineer', 'Chief Mate',
        'Chief Steward', 'Electrician', 'Master', 'Oiler', 'Other'
      ]);
    } finally {
      setPositionsLoading(false);
    }
  }
  
  loadPositions();
}, []);

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================

  const goToStep = (step: WizardStep) => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(step);
    setEditingLegFromSummary(null);
  };

  const goNext = () => {
    const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);
    if (currentIndex < WIZARD_STEPS.length - 1) {
      goToStep(WIZARD_STEPS[currentIndex + 1].key);
    }
  };

  const goBack = () => {
    const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(WIZARD_STEPS[currentIndex - 1].key);
    }
  };

  // ============================================
  // FORM UPDATE HANDLERS
  // ============================================

  const updateTraveler = (updates: Partial<TravelerInfo>) => {
    setFormData({
      ...formData,
      traveler: { ...formData.traveler, ...updates },
    });

    // Auto-detect Master/Chief Engineer
    if (updates.position) {
      const isMasterOrChief =
        updates.position.toLowerCase().includes('master') ||
        updates.position.toLowerCase().includes('chief engineer');
      setFormData((prev) => ({
        ...prev,
        traveler: {
          ...prev.traveler,
          ...updates,
          isMasterOrChiefEngineer: isMasterOrChief,
        },
      }));
    }
  };

  // ============================================
  // ITINERARY HANDLERS
  // ============================================

  const addLeg = () => {
    const newLeg: ItineraryLeg = {
      id: `leg-${Date.now()}`,
      from: { type: 'HOR', details: '' },
      to: { type: 'Airport', details: '' },
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      departureTimezone: -5,
      arrivalTimezone: -5,
      transport: { type: 'govt-ticket-flight' },
      reason: 'TDY_STATION',
      isFlight: true,
      isInternational: false,
    };

    // Copy previous leg's destination as this leg's origin
    if (formData.itinerary.length > 0) {
      const lastLeg = formData.itinerary[formData.itinerary.length - 1];
      newLeg.from = { ...lastLeg.to };
      newLeg.departureTimezone = lastLeg.arrivalTimezone;
      newLeg.arrivalTimezone = lastLeg.arrivalTimezone;

      // Smart defaults for "to" based on "from"
      if (lastLeg.to.type === 'Airport') {
        newLeg.to = { type: 'ContractHotel', details: '' };
      } else if (lastLeg.to.type === 'ContractHotel') {
        newLeg.to = { type: 'Ship', details: '' };
      } else if (lastLeg.to.type === 'Ship') {
        newLeg.to = { type: 'Airport', details: '' };
      }
    }

    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, newLeg],
    });
    setEditingLegId(newLeg.id);
  };

  const updateLeg = (legId: string, updates: Partial<ItineraryLeg>) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.map((leg) =>
        leg.id === legId ? { ...leg, ...updates } : leg
      ),
    });
  };

  const deleteLeg = (legId: string) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((leg) => leg.id !== legId),
    });
    if (editingLegId === legId) {
      setEditingLegId(null);
    }
  };

  const editLegFromSummary = (legId: string) => {
    setEditingLegFromSummary(legId);
    setEditingLegId(legId);
    setCurrentStep('itinerary');
  };

  // ============================================
  // EXPENSE HANDLERS
  // ============================================

  const addExpense = () => {
    const newExpense: AdditionalExpense = {
      id: `exp-${Date.now()}`,
      date: '',
      description: '',
      amount: 0,
      paidWithGTCC: false,
    };

    setFormData({
      ...formData,
      additionalExpenses: [...formData.additionalExpenses, newExpense],
    });
  };

  const updateExpense = (
    expId: string,
    updates: Partial<AdditionalExpense>
  ) => {
    setFormData({
      ...formData,
      additionalExpenses: formData.additionalExpenses.map((exp) =>
        exp.id === expId ? { ...exp, ...updates } : exp
      ),
    });
  };

  const deleteExpense = (expId: string) => {
    setFormData({
      ...formData,
      additionalExpenses: formData.additionalExpenses.filter(
        (exp) => exp.id !== expId
      ),
    });
  };

  // ============================================
  // PDF GENERATION
  // ============================================

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      await generateAndDownloadPDFs(formData);
    } catch (e) {
      console.error('Error generating PDFs:', e);
      setError('Failed to generate PDFs. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ============================================
  // CALCULATE GTCC TOTAL
  // ============================================

  const calculateGTCCTotal = useCallback(() => {
    let total = 0;

    formData.itinerary.forEach((leg) => {
      if (leg.transport.paidWithGTCC && leg.transport.cost) {
        total += leg.transport.cost;
      }
      if (leg.transport.baggagePaidWithGTCC && leg.transport.baggageCost) {
        total += leg.transport.baggageCost;
      }
      if (leg.delayHotelPaidWithGTCC && leg.delayHotelCost) {
        total += leg.delayHotelCost;
      }
    });

    formData.additionalExpenses.forEach((exp) => {
      if (exp.paidWithGTCC) {
        total += exp.amount;
      }
    });

    return total;
  }, [formData.itinerary, formData.additionalExpenses]);

  // ============================================
  // RENDER STEP CONTENT
  // ============================================

  const renderStepContent = () => {
    switch (currentStep) {
      case 'overview':
        return renderOverviewStep();
      case 'itinerary':
        return renderItineraryStep();
      case 'expenses':
        return renderExpensesStep();
      case 'comptime':
        return renderCompTimeStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  // ============================================
  // STEP 1: OVERVIEW
  // ============================================

  const renderOverviewStep = () => (
    <div className="space-y-6">
      {/* Traveler Info */}
      <SectionCard
        title="Traveler Information"
        icon={<User className="w-5 h-5 text-violet-600" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name *
            </label>
            <Input
              id="firstName"
              value={formData.traveler.firstName}
              onChange={(v) => updateTraveler({ firstName: v })}
              placeholder="John"
              required
            />
          </div>
          <div>
            <label
              htmlFor="middleInitial"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              MI
            </label>
            <Input
              id="middleInitial"
              value={formData.traveler.middleInitial}
              onChange={(v) =>
                updateTraveler({ middleInitial: v.slice(0, 1).toUpperCase() })
              }
              placeholder="A"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name *
            </label>
            <Input
              id="lastName"
              value={formData.traveler.lastName}
              onChange={(v) => updateTraveler({ lastName: v })}
              placeholder="Smith"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Position *
            </label>
            <Select
              id="position"
              value={formData.traveler.position}
              onChange={(v) => updateTraveler({ position: v })}
              options={positions.map((p) => ({ value: p, label: p }))}
              placeholder="Select position..."
            />
          </div>
          <div>
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              GS Grade *
            </label>
            <Select
              id="grade"
              value={formData.traveler.grade}
              onChange={(v) => updateTraveler({ grade: parseInt(v) })}
              options={Array.from({ length: 15 }, (_, i) => ({
                value: i + 1,
                label: `GS-${i + 1}`,
              }))}
            />
          </div>
          <div>
            <label
              htmlFor="ssnLast4"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last 4 of SSN *
            </label>
            <Input
              id="ssnLast4"
              value={formData.traveler.ssnLast4}
              onChange={(v) =>
                updateTraveler({ ssnLast4: v.replace(/\D/g, '').slice(0, 4) })
              }
              placeholder="1234"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="dodId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              DoD ID Number *
            </label>
            <Input
              id="dodId"
              value={formData.traveler.dodId}
              onChange={(v) =>
                updateTraveler({ dodId: v.replace(/\D/g, '').slice(0, 10) })
              }
              placeholder="1234567890"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.traveler.email}
              onChange={(v) => updateTraveler({ email: v })}
              placeholder="john.smith@navy.mil"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.traveler.phone}
              onChange={(v) => updateTraveler({ phone: v })}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label
              htmlFor="workSchedule"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Normal Work Schedule
            </label>
            <Input
              id="workSchedule"
              value={formData.traveler.workSchedule}
              onChange={(v) => updateTraveler({ workSchedule: v })}
              placeholder="0800-1630"
            />
          </div>
        </div>
      </SectionCard>

      {/* Address */}
      <SectionCard
        title="Home Address"
        icon={<Home className="w-5 h-5 text-violet-600" />}
      >
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Street Address *
          </label>
          <Input
            id="street"
            value={formData.traveler.street}
            onChange={(v) => updateTraveler({ street: v })}
            placeholder="123 Ocean View Dr"
            required
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="col-span-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City *
            </label>
            <Input
              id="city"
              value={formData.traveler.city}
              onChange={(v) => updateTraveler({ city: v })}
              placeholder="Norfolk"
              required
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State *
            </label>
            <Input
              id="state"
              value={formData.traveler.state}
              onChange={(v) =>
                updateTraveler({ state: v.toUpperCase().slice(0, 2) })
              }
              placeholder="VA"
              required
            />
          </div>
          <div>
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ZIP *
            </label>
            <Input
              id="zip"
              value={formData.traveler.zip}
              onChange={(v) =>
                updateTraveler({ zip: v.replace(/\D/g, '').slice(0, 5) })
              }
              placeholder="23510"
              required
            />
          </div>
        </div>
      </SectionCard>

      {/* Trip Details */}
      <SectionCard
        title="Trip Details"
        icon={<Plane className="w-5 h-5 text-violet-600" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="purpose"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Purpose of Travel *
            </label>
            <Select
              id="purpose"
              value={formData.purpose}
              onChange={(v) => setFormData({ ...formData, purpose: v })}
              options={PURPOSE_OPTIONS.map((p) => ({ value: p, label: p }))}
              placeholder="Select purpose..."
            />
            {formData.purpose === 'Other' && (
              <Input
                id="customPurpose"
                value={formData.customPurpose || ''}
                onChange={(v) => setFormData({ ...formData, customPurpose: v })}
                placeholder="Describe purpose..."
                className="mt-2"
              />
            )}
          </div>
          <div>
            <label
              htmlFor="authNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Travel Authorization Number
            </label>
            <Input
              id="authNumber"
              value={formData.authorizationNumber}
              onChange={(v) =>
                setFormData({ ...formData, authorizationNumber: v })
              }
              placeholder="N842-2024-12345"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="travelType"
                  value="CONUS"
                  checked={formData.travelType === 'CONUS'}
                  onChange={() =>
                    setFormData({ ...formData, travelType: 'CONUS' })
                  }
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">CONUS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="travelType"
                  value="OCONUS"
                  checked={formData.travelType === 'OCONUS'}
                  onChange={() =>
                    setFormData({ ...formData, travelType: 'OCONUS' })
                  }
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">OCONUS</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Orders Issued?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="travelOrders"
                  value="yes"
                  checked={formData.travelOrdersIssued}
                  onChange={() =>
                    setFormData({ ...formData, travelOrdersIssued: true })
                  }
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="travelOrders"
                  value="no"
                  checked={!formData.travelOrdersIssued}
                  onChange={() =>
                    setFormData({ ...formData, travelOrdersIssued: false })
                  }
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.receivedAdvance}
              onChange={(e) =>
                setFormData({ ...formData, receivedAdvance: e.target.checked })
              }
              className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
            />
            <span className="text-sm text-gray-700">
              I received a travel advance
            </span>
          </label>
          {formData.receivedAdvance && (
            <div className="mt-2 w-48">
              <label
                htmlFor="advanceAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Advance Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="advanceAmount"
                  type="number"
                  value={formData.advanceAmount || ''}
                  onChange={(v) =>
                    setFormData({
                      ...formData,
                      advanceAmount: parseFloat(v) || 0,
                    })
                  }
                  className="pl-7"
                />
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );

  // ============================================
  // STEP 2: ITINERARY
  // ============================================

  const renderItineraryStep = () => (
    <div className="space-y-6">
      <InfoBox type="info">
        <p>
          Build your travel itinerary leg by leg. Start from your Home of Record
          and add each segment of your journey.
        </p>
      </InfoBox>

      {/* Existing Legs */}
      {formData.itinerary.map((leg, index) => (
        <SectionCard
          key={leg.id}
          className={editingLegId === leg.id ? 'ring-2 ring-violet-500' : ''}
        >
          {/* Leg Header */}
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() =>
              setEditingLegId(editingLegId === leg.id ? null : leg.id)
            }
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex items-center gap-2 text-gray-900">
                {getLocationIcon(leg.from.type)}
                <span className="font-medium">
                  {leg.from.details || getLocationLabel(leg.from.type)}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                {getLocationIcon(leg.to.type)}
                <span className="font-medium">
                  {leg.to.details || getLocationLabel(leg.to.type)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {leg.departureDate && leg.departureTime && (
                <span className="text-sm text-gray-500">
                  {new Date(leg.departureDate).toLocaleDateString()}{' '}
                  {leg.departureTime}
                </span>
              )}
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  editingLegId === leg.id ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>

          {/* Leg Edit Form */}
          {editingLegId === leg.id && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
              {/* From Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From (Location Type)
                  </label>
                  <Select
                    id={`from-type-${leg.id}`}
                    value={leg.from.type}
                    onChange={(v) =>
                      updateLeg(leg.id, {
                        from: { ...leg.from, type: v as LocationType },
                      })
                    }
                    options={LOCATION_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From (Details)
                  </label>
                  <Input
                    id={`from-details-${leg.id}`}
                    value={leg.from.details}
                    onChange={(v) =>
                      updateLeg(leg.id, {
                        from: { ...leg.from, details: v },
                      })
                    }
                    placeholder={getLocationPlaceholder(leg.from.type)}
                  />
                </div>
              </div>

              {/* To Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To (Location Type)
                  </label>
                  <Select
                    id={`to-type-${leg.id}`}
                    value={leg.to.type}
                    onChange={(v) =>
                      updateLeg(leg.id, {
                        to: { ...leg.to, type: v as LocationType },
                      })
                    }
                    options={LOCATION_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To (Details)
                  </label>
                  <Input
                    id={`to-details-${leg.id}`}
                    value={leg.to.details}
                    onChange={(v) =>
                      updateLeg(leg.id, {
                        to: { ...leg.to, details: v },
                      })
                    }
                    placeholder={getLocationPlaceholder(leg.to.type)}
                  />
                </div>
              </div>

              {/* Departure Date/Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-violet-600" />
                    Departure
                  </h4>
                  <DateTimePicker
                    dateValue={leg.departureDate}
                    timeValue={leg.departureTime}
                    timezoneValue={leg.departureTimezone}
                    onDateChange={(v) =>
                      updateLeg(leg.id, { departureDate: v })
                    }
                    onTimeChange={(v) =>
                      updateLeg(leg.id, { departureTime: v })
                    }
                    onTimezoneChange={(v) =>
                      updateLeg(leg.id, { departureTimezone: v })
                    }
                    dateLabel="Date"
                    timeLabel="Time"
                    id={`dep-${leg.id}`}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-violet-600" />
                    Arrival
                  </h4>
                  <DateTimePicker
                    dateValue={leg.arrivalDate}
                    timeValue={leg.arrivalTime}
                    timezoneValue={leg.arrivalTimezone}
                    onDateChange={(v) => updateLeg(leg.id, { arrivalDate: v })}
                    onTimeChange={(v) => updateLeg(leg.id, { arrivalTime: v })}
                    onTimezoneChange={(v) =>
                      updateLeg(leg.id, { arrivalTimezone: v })
                    }
                    dateLabel="Date"
                    timeLabel="Time"
                    id={`arr-${leg.id}`}
                  />
                </div>
              </div>

              {/* Transport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode of Transportation
                </label>
                <Select
                  id={`transport-${leg.id}`}
                  value={leg.transport.type}
                  onChange={(v) => {
                    const transportType = v as TransportType;
                    const isFlight = transportType === 'govt-ticket-flight' || 
                 transportType === 'commercial-flight-reimburse' || 
                 transportType === 'govt-aircraft';
                    updateLeg(leg.id, {
                      transport: { ...leg.transport, type: transportType },
                      isFlight,
                    });
                  }}
                  options={TRANSPORT_OPTIONS.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
                />

                {/* Transport-specific fields */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cost field for paid transport */}
                  {TRANSPORT_OPTIONS.find((o) => o.value === leg.transport.type)
                    ?.hasCost && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost ($)
                      </label>
                      <Input
                        id={`transport-cost-${leg.id}`}
                        type="number"
                        value={leg.transport.cost || ''}
                        onChange={(v) =>
                          updateLeg(leg.id, {
                            transport: {
                              ...leg.transport,
                              cost: parseFloat(v) || 0,
                            },
                          })
                        }
                        placeholder="0.00"
                        step="0.01"
                      />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={leg.transport.paidWithGTCC || false}
                          onChange={(e) =>
                            updateLeg(leg.id, {
                              transport: {
                                ...leg.transport,
                                paidWithGTCC: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-violet-600 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          Paid with GTCC
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Miles field for POV */}
                  {TRANSPORT_OPTIONS.find((o) => o.value === leg.transport.type)
                    ?.hasMiles && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miles Driven
                      </label>
                      <Input
                        id={`transport-miles-${leg.id}`}
                        type="number"
                        value={leg.transport.miles || ''}
                        onChange={(v) =>
                          updateLeg(leg.id, {
                            transport: {
                              ...leg.transport,
                              miles: parseInt(v) || 0,
                            },
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  )}

                  {/* Baggage for flights */}
                  {leg.isFlight && (
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={leg.transport.hasCheckedBags || false}
                          onChange={(e) =>
                            updateLeg(leg.id, {
                              transport: {
                                ...leg.transport,
                                hasCheckedBags: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-violet-600 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          Had checked baggage
                        </span>
                      </label>

                      {leg.transport.hasCheckedBags && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Baggage Fee ($)
                          </label>
                          <Input
                            id={`baggage-cost-${leg.id}`}
                            type="number"
                            value={leg.transport.baggageCost || ''}
                            onChange={(v) =>
                              updateLeg(leg.id, {
                                transport: {
                                  ...leg.transport,
                                  baggageCost: parseFloat(v) || 0,
                                },
                              })
                            }
                            placeholder="0.00"
                            step="0.01"
                          />
                          <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                leg.transport.baggagePaidWithGTCC || false
                              }
                              onChange={(e) =>
                                updateLeg(leg.id, {
                                  transport: {
                                    ...leg.transport,
                                    baggagePaidWithGTCC: e.target.checked,
                                  },
                                })
                              }
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            <span className="text-sm text-gray-600">
                              Baggage paid with GTCC
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* International flight checkbox */}
                {leg.isFlight && (
                  <label className="flex items-center gap-2 mt-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leg.isInternational || false}
                      onChange={(e) =>
                        updateLeg(leg.id, { isInternational: e.target.checked })
                      }
                      className="w-4 h-4 text-violet-600 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      International flight
                    </span>
                  </label>
                )}
              </div>

             {/* Reason for Stop */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Reason for Stop
  </label>
  <Select
    id={`reason-${leg.id}`}
    value={leg.reason}
    onChange={(v) => updateLeg(leg.id, { reason: v as StopReason })}
    options={STOP_REASON_OPTIONS.map((o) => ({
      value: o.value,
      label: o.label,
    }))}
  />
</div>

              {/* Extended Delay */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={leg.hadExtendedDelay || false}
                    onChange={(e) =>
                      updateLeg(leg.id, { hadExtendedDelay: e.target.checked })
                    }
                    className="w-4 h-4 text-violet-600 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    Had extended delay (13+ hours) requiring lodging
                  </span>
                </label>

                {leg.hadExtendedDelay && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hotel Cost ($)
                      </label>
                      <Input
                        id={`delay-hotel-${leg.id}`}
                        type="number"
                        value={leg.delayHotelCost || ''}
                        onChange={(v) =>
                          updateLeg(leg.id, {
                            delayHotelCost: parseFloat(v) || 0,
                          })
                        }
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={leg.delayHotelPaidWithGTCC || false}
                          onChange={(e) =>
                            updateLeg(leg.id, {
                              delayHotelPaidWithGTCC: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-violet-600 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          Paid with GTCC
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  onClick={() => deleteLeg(leg.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Leg
                </button>
                <button
                  onClick={() => setEditingLegId(null)}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Done Editing
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      ))}

      {/* Add Leg Button */}
      <button
        onClick={addLeg}
        className="w-full py-4 border-2 border-dashed border-violet-300 rounded-xl text-violet-600 hover:bg-violet-50 hover:border-violet-400 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        {formData.itinerary.length === 0
          ? 'Add First Leg (Start from Home)'
          : `Add Next Leg (From ${
              formData.itinerary[formData.itinerary.length - 1].to.details ||
              getLocationLabel(
                formData.itinerary[formData.itinerary.length - 1].to.type
              )
            })`}
      </button>

      {/* Return from summary edit */}
      {editingLegFromSummary && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setEditingLegFromSummary(null);
              setEditingLegId(null);
              setCurrentStep('review');
            }}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Return to Summary
          </button>
        </div>
      )}
    </div>
  );

  // ============================================
  // STEP 3: EXPENSES
  // ============================================

  const renderExpensesStep = () => {
    const gtccTotal = calculateGTCCTotal();

    return (
      <div className="space-y-6">
        <InfoBox type="info">
          Add any additional reimbursable expenses not already captured in your
          itinerary (per diem is handled separately).
        </InfoBox>

        {/* GTCC Summary */}
        {gtccTotal > 0 && (
          <SectionCard
            title="GTCC Split Disbursement"
            icon={<DollarSign className="w-5 h-5 text-violet-600" />}
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Total GTCC charges to be reimbursed directly:
              </p>
              <p className="text-2xl font-bold text-violet-600">
                ${gtccTotal.toFixed(2)}
              </p>
            </div>
          </SectionCard>
        )}

        {/* Additional Expenses */}
        <SectionCard
          title="Additional Expenses"
          icon={<DollarSign className="w-5 h-5 text-violet-600" />}
        >
          {formData.additionalExpenses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No additional expenses added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.additionalExpenses.map((expense, index) => (
                <div key={expense.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={expense.date}
                        onChange={(e) =>
                          updateExpense(expense.id, { date: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Input
                        id={`exp-desc-${expense.id}`}
                        value={expense.description}
                        onChange={(v) =>
                          updateExpense(expense.id, { description: v })
                        }
                        placeholder="Parking, tolls, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($)
                      </label>
                      <Input
                        id={`exp-amt-${expense.id}`}
                        type="number"
                        value={expense.amount || ''}
                        onChange={(v) =>
                          updateExpense(expense.id, {
                            amount: parseFloat(v) || 0,
                          })
                        }
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expense.paidWithGTCC}
                        onChange={(e) =>
                          updateExpense(expense.id, {
                            paidWithGTCC: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-violet-600 rounded"
                      />
                      <span className="text-sm text-gray-600">
                        Paid with GTCC
                      </span>
                    </label>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {expense.amount > 75 && (
                    <InfoBox type="warning">
                      Expenses over $75 require a receipt.
                    </InfoBox>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={addExpense}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </SectionCard>
      </div>
    );
  };

  // ============================================
  // STEP 4: COMP TIME
  // ============================================

  const renderCompTimeStep = () => {
    if (formData.itinerary.length === 0) {
      return (
        <InfoBox type="warning">
          Add itinerary legs first to calculate comp time.
        </InfoBox>
      );
    }

    const { calculations, totals } = calculateAllCompTime(
      formData.itinerary,
      formData.traveler
    );

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Travel</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatHoursDisplay(totals.actualTravelTime)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Duty Hours</p>
            <p className="text-2xl font-bold text-gray-500">
              {formatHoursDisplay(totals.dutyHours)}
            </p>
            <p className="text-xs text-gray-400">Not creditable</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Non-Duty Hours</p>
            <p className="text-2xl font-bold text-violet-600">
              {formatHoursDisplay(totals.nonDutyHours)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-sm text-violet-100">Comp Time Earned</p>
            <p className="text-2xl font-bold">
              {formatHoursDisplay(totals.compTimeRequested)}
            </p>
          </div>
        </div>

        {/* Per-Leg Breakdown */}
        <SectionCard
          title="Breakdown by Leg"
          icon={<Clock className="w-5 h-5 text-violet-600" />}
        >
          <div className="space-y-4">
            {formData.itinerary.map((leg, index) => {
              const calc = calculations[index];
              if (!calc) return null;

              return (
                <div key={leg.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">
                      {leg.from.details || leg.from.type} →{' '}
                      {leg.to.details || leg.to.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Travel Time</p>
                      <p className="font-semibold">
                        {formatHoursDisplay(calc.actualTravelTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duty Hours</p>
                      <p className="font-semibold text-gray-400">
                        {formatHoursDisplay(calc.dutyHours)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Non-Duty</p>
                      <p className="font-semibold">
                        {formatHoursDisplay(calc.nonDutyHours)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Deductions</p>
                      <p className="font-semibold text-red-500">
                        -{formatHoursDisplay(calc.nonCreditableTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Comp Time</p>
                      <p className="font-semibold text-violet-600">
                        {formatHoursDisplay(calc.compTimeRequested)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Rules Reference */}
        <SectionCard
          title="Comp Time Rules (MSC HR Advisory 2014-1)"
          icon={<Info className="w-5 h-5 text-violet-600" />}
        >
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              • <strong>Creditable time:</strong> Travel outside normal duty
              hours (0800-1630)
            </p>
            <p>
              • <strong>Waiting time:</strong> Train/Bus: 60 min, Domestic
              flight (no bags): 90 min, With bags: 2 hrs, International: 3 hrs
            </p>
            <p>
              • <strong>Meal deduction:</strong> 30 minutes per 6 hours of
              travel
            </p>
            <p>
              • <strong>Masters/Chief Engineers:</strong> Deduct 1 hour per
              travel day
            </p>
            <p>
              • <strong>Rounding:</strong> Fractions rounded down to nearest 6
              minutes (0.1 hour)
            </p>
          </div>
        </SectionCard>
      </div>
    );
  };

  // ============================================
  // STEP 5: REVIEW
  // ============================================

  const renderReviewStep = () => {
    const { totals } =
      formData.itinerary.length > 0
        ? calculateAllCompTime(formData.itinerary, formData.traveler)
        : { totals: { compTimeRequested: 0 } };
    const gtccTotal = calculateGTCCTotal();

    return (
      <div className="space-y-6">
        {/* Traveler Summary */}
        <SectionCard
          title="Traveler Information"
          icon={<User className="w-5 h-5 text-violet-600" />}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">
                {formData.traveler.firstName} {formData.traveler.middleInitial}{' '}
                {formData.traveler.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Position</p>
              <p className="font-medium">{formData.traveler.position}</p>
            </div>
            <div>
              <p className="text-gray-500">Grade</p>
              <p className="font-medium">GS-{formData.traveler.grade}</p>
            </div>
            <div>
              <p className="text-gray-500">DoD ID</p>
              <p className="font-medium">{formData.traveler.dodId}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{formData.traveler.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">
                {formData.traveler.phone || 'Not provided'}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Trip Summary */}
        <SectionCard
          title="Trip Details"
          icon={<Plane className="w-5 h-5 text-violet-600" />}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Purpose</p>
              <p className="font-medium">
                {formData.purpose === 'Other'
                  ? formData.customPurpose
                  : formData.purpose}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Authorization #</p>
              <p className="font-medium">
                {formData.authorizationNumber || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Travel Type</p>
              <p className="font-medium">{formData.travelType}</p>
            </div>
            <div>
              <p className="text-gray-500">GTCC Split</p>
              <p className="font-medium">${gtccTotal.toFixed(2)}</p>
            </div>
          </div>
        </SectionCard>

        {/* Itinerary Summary with Edit Buttons */}
        <SectionCard
          title="Itinerary"
          icon={<MapPin className="w-5 h-5 text-violet-600" />}
        >
          {formData.itinerary.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No legs added.</p>
          ) : (
            <div className="space-y-3">
              {formData.itinerary.map((leg, index) => (
                <div
                  key={leg.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        {getLocationIcon(leg.from.type)}
                        <span>
                          {leg.from.details || getLocationLabel(leg.from.type)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        {getLocationIcon(leg.to.type)}
                        <span>
                          {leg.to.details || getLocationLabel(leg.to.type)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {leg.departureDate && leg.departureTime && (
                          <>
                            {new Date(leg.departureDate).toLocaleDateString()}{' '}
                            {leg.departureTime}
                            {' → '}
                          </>
                        )}
                        {leg.arrivalDate && leg.arrivalTime && (
                          <>
                            {new Date(leg.arrivalDate).toLocaleDateString()}{' '}
                            {leg.arrivalTime}
                          </>
                        )}
                        <span className="mx-2">•</span>
                        {
                          TRANSPORT_OPTIONS.find(
                            (o) => o.value === leg.transport.type
                          )?.label
                        }
                        <span className="mx-2">•</span>
                        {
                          STOP_REASON_OPTIONS.find(
                            (o) => o.value === leg.reason
                          )?.label
                        }
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => editLegFromSummary(leg.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-violet-600 hover:bg-violet-100 rounded-lg transition-colors text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Comp Time Summary */}
        <SectionCard
          title="Comp Time Summary"
          icon={<Clock className="w-5 h-5 text-violet-600" />}
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Total Comp Time to be Requested:</p>
            <p className="text-3xl font-bold text-violet-600">
              {formatHoursDisplay(totals.compTimeRequested)}
            </p>
          </div>
        </SectionCard>

        {/* Generate Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          {error && <InfoBox type="warning">{error}</InfoBox>}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating PDFs...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Generate DD 1351-2 & Comp Time Forms
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 text-center">
            Both forms will be downloaded to your device.
            <br />
            Submit to MSC Travel (N842) with required receipts.
          </p>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-violet-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Plane className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Travel Claim Generator
              </h1>
              <p className="text-violet-100">
                DD 1351-2 & Comp Time for Travel Forms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />

        {renderStepContent()}

        {/* Navigation Buttons */}
        {!editingLegFromSummary && (
          <div className="flex justify-between mt-8">
            <button
              onClick={goBack}
              disabled={currentStep === 'overview'}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            {currentStep !== 'review' && (
              <button
                onClick={goNext}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
