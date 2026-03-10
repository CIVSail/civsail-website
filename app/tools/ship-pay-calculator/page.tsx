// app/tools/ship-pay-calculator/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calculator,
  Clock,
  Ship,
  Info,
  ChevronDown,
  TrendingUp,
  Minus,
} from 'lucide-react';
import { createPayClient } from '@/lib/supabase/pay-client';

// ============================================================================
// TYPES
// ============================================================================

interface ShipOption {
  name: string;
  type: string;
}

interface CalculatorState {
  // Selections
  ship: string;
  shipType: string;
  position: string;
  permCoast: 'EAST' | 'WEST';
  
  // Rate info (from Supabase)
  salary: number;
  overtimeRate: number;
  penaltyRate: number;
  
  // Variable inputs
  overtimeHours: number;
  penaltyHours: number;
  
  // Toggles
  srsSwimmer: boolean;
  ammoPay: boolean;
  retentionPay: boolean;
  berthingPay: boolean;
  
  // Computed earnings
  basePay: number;
  overtimeEarnings: number;
  penaltyEarnings: number;
  srsEarnings: number;
  ammoEarnings: number;
  retentionEarnings: number;
  berthingEarnings: number;
  grossPay: number;
  
  // Deductions
  benefitsCost: number;
  stateTaxRate: number;
  tspContribution: number;
  socialSecurityTax: number;
  stateTax: number;
  federalTax: number;
  fersWithholding: number;
  totalDeductions: number;
  netPay: number;
  
  // UI state
  ammoEnabled: boolean;
  berthingEnabled: boolean;
  retentionEnabled: boolean;
  retentionNote: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STATE_TAX_OPTIONS = [
  { value: 0, label: '0% - No State Tax' },
  { value: 3, label: '3% - Low Tax State' },
  { value: 8, label: '8% - Medium Tax State' },
  { value: 12, label: '12% - High Tax State' },
];

const BENEFITS_OPTIONS = [100, 150, 200, 250, 300];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ShipPayCalculatorPage() {
  // Data from Supabase
  const [ships, setShips] = useState<ShipOption[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createPayClient(), []);
  // Calculator state
  const [state, setState] = useState<CalculatorState>({
    ship: '',
    shipType: '',
    position: '',
    permCoast: 'EAST',
    salary: 0,
    overtimeRate: 0,
    penaltyRate: 0,
    overtimeHours: 0,
    penaltyHours: 0,
    srsSwimmer: false,
    ammoPay: false,
    retentionPay: false,
    berthingPay: false,
    basePay: 0,
    overtimeEarnings: 0,
    penaltyEarnings: 0,
    srsEarnings: 0,
    ammoEarnings: 0,
    retentionEarnings: 0,
    berthingEarnings: 0,
    grossPay: 0,
    benefitsCost: 100,
    stateTaxRate: 0,
    tspContribution: 0,
    socialSecurityTax: 0,
    stateTax: 0,
    federalTax: 0,
    fersWithholding: 0,
    totalDeductions: 0,
    netPay: 0,
    ammoEnabled: false,
    berthingEnabled: false,
    retentionEnabled: false,
    retentionNote: '',
  });

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data: shipsData } = await supabase
          .from('ships')
          .select('"Ship Name", "Ship Type"');
        
        if (shipsData) {
          setShips(shipsData.map(s => ({ 
            name: s['Ship Name'], 
            type: s['Ship Type'] 
          })));
        }

        const { data: jobsData } = await supabase
          .from('jobs')
          .select('"Position Title"');
        
        if (jobsData) {
          setPositions(jobsData.map(j => j['Position Title']));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  // ============================================================================
  // SALARY CALCULATION
  // ============================================================================

  const fetchSalary = useCallback(async () => {
    if (!state.ship || !state.position) {
      setState(prev => ({
        ...prev,
        salary: 0,
        overtimeRate: 0,
        penaltyRate: 0,
        basePay: 0,
        ammoEnabled: false,
        berthingEnabled: false,
      }));
      return;
    }

    try {
      const selectedShip = ships.find(s => s.name === state.ship);
      let shipType = selectedShip?.type || '';

      if (shipType === 'TBD') {
        shipType = state.permCoast;
      }

      const ammoEnabled = shipType === 'West Coast T-AKE' || shipType === 'East Coast T-AKE, T-AOE';
      
      const berthingEnabled = [
        'West ESB,PrePo T-AKE,T-EPF,T-AH',
        'East Coast ESB,T-AH,T-EPF',
        'East Coast T-AKE, T-AOE',
        'T-AS'
      ].includes(shipType);

      const { data: coastData } = await supabase
        .from(state.permCoast)
        .select('Salary')
        .eq('"Position Title"', state.position);

      const { data: shipData } = await supabase
        .from(shipType)
        .select('Salary')
        .eq('"Position Title"', state.position);

      const coastSalary = coastData?.[0]?.Salary || 0;
      const shipSalary = shipData?.[0]?.Salary || 0;
      
      const effectiveShipType = coastSalary > shipSalary ? state.permCoast : shipType;

      const { data: salaryData } = await supabase
        .from(effectiveShipType)
        .select('Salary, OverTime, Penalty')
        .eq('"Position Title"', state.position);

      if (salaryData?.[0]) {
        const salary = salaryData[0].Salary || 0;
        const basePay = salary / 26;
        const overtimeRate = salaryData[0].OverTime || 0;
        const penaltyRate = salaryData[0].Penalty || 0;

        setState(prev => ({
          ...prev,
          shipType: effectiveShipType,
          salary,
          overtimeRate,
          penaltyRate,
          basePay,
          ammoEnabled,
          berthingEnabled,
          ammoPay: ammoEnabled ? prev.ammoPay : false,
          berthingPay: berthingEnabled ? prev.berthingPay : false,
        }));
      }

      // Check retention eligibility
      const { data: retentionData } = await supabase
        .from('retention_rates')
        .select('*')
        .ilike('position_title', state.position);

      if (retentionData && retentionData.length > 0) {
        setState(prev => ({ ...prev, retentionEnabled: true }));
      } else {
        setState(prev => ({ 
          ...prev, 
          retentionEnabled: false, 
          retentionPay: false,
          retentionEarnings: 0,
          retentionNote: '' 
        }));
      }

    } catch (error) {
      console.error('Error fetching salary:', error);
    }
  }, [state.ship, state.position, state.permCoast, ships]);

  useEffect(() => {
    fetchSalary();
  }, [fetchSalary]);

  // ============================================================================
  // EARNINGS CALCULATIONS
  // ============================================================================

  useEffect(() => {
    const calculateEarnings = async () => {
      let overtimeEarnings = state.overtimeHours * state.overtimeRate;
      let penaltyEarnings = state.penaltyHours * state.penaltyRate;
      let srsEarnings = 0;
      let ammoEarnings = 0;
      let retentionEarnings = 0;
      let berthingEarnings = 0;
      let retentionNote = '';

      // SRS Earnings
      if (state.srsSwimmer && state.overtimeRate > 0) {
        const { data: hardcodeData } = await supabase
          .from('hardcode')
          .select('*');

        if (hardcodeData) {
          let baseOvertimeHours = 0;
          let basePenaltyHours = 0;
          let srsPenaltyRate = 0;
          let srsRetentionHours = 0;

          hardcodeData.forEach((item) => {
            switch (item.name) {
              case 'Base SRS Overtime Hours':
                baseOvertimeHours = item.value;
                break;
              case 'Base SRS Penalty Hours':
                basePenaltyHours = item.value;
                break;
              case 'SRS Penalty Rate':
                srsPenaltyRate = item.value;
                break;
              case 'SRS Retention Hours':
                srsRetentionHours = item.value;
                break;
            }
          });

          const srsRetentionPay = srsRetentionHours * srsPenaltyRate;
          srsEarnings = srsRetentionPay + (baseOvertimeHours * state.overtimeRate) + (basePenaltyHours * srsPenaltyRate);
        }
      }

      // Ammo Earnings (10% of base pay)
      if (state.ammoPay && state.basePay > 0) {
        ammoEarnings = state.basePay * 0.1;
      }

      // Retention Earnings
      if (state.retentionPay && state.basePay > 0) {
        const { data: retentionData } = await supabase
          .from('retention_rates')
          .select('*')
          .ilike('position_title', state.position);

        if (retentionData && retentionData.length > 0) {
          const retentionPercent = parseFloat(retentionData[0].retention_percent);
          retentionEarnings = state.basePay * retentionPercent;
          
          if (retentionData[0].service_agreement) {
            retentionNote = '* 2-Year Service Agreement required';
          }
        }
      }

      // Berthing Earnings
      if (state.berthingPay) {
        const { data: berthingData } = await supabase
          .from('hardcode')
          .select('value')
          .eq('name', 'Berthing Pay');

        if (berthingData?.[0]) {
          berthingEarnings = berthingData[0].value;
        }
      }

      const grossPay = state.basePay + overtimeEarnings + penaltyEarnings + 
                       srsEarnings + ammoEarnings + retentionEarnings + berthingEarnings;

      setState(prev => ({
        ...prev,
        overtimeEarnings,
        penaltyEarnings,
        srsEarnings,
        ammoEarnings,
        retentionEarnings,
        berthingEarnings,
        retentionNote,
        grossPay,
      }));
    };

    calculateEarnings();
  }, [
    state.basePay,
    state.overtimeHours,
    state.penaltyHours,
    state.overtimeRate,
    state.penaltyRate,
    state.srsSwimmer,
    state.ammoPay,
    state.retentionPay,
    state.berthingPay,
    state.position,
  ]);

  // ============================================================================
  // TAX CALCULATIONS
  // ============================================================================

  useEffect(() => {
    const calculateTaxes = async () => {
      if (state.grossPay <= 0) {
        setState(prev => ({
          ...prev,
          socialSecurityTax: 0,
          stateTax: 0,
          federalTax: 0,
          fersWithholding: 0,
          totalDeductions: prev.benefitsCost + prev.tspContribution,
          netPay: 0,
        }));
        return;
      }

      try {
        const { data: hardcodeData } = await supabase
          .from('hardcode')
          .select('*');

        let socialSecurityRate = 0.062;
        let fersRate = 0.008;
        let standardDeduction = 14600;

        hardcodeData?.forEach((item) => {
          switch (item.name) {
            case 'Social Security Tax':
              socialSecurityRate = item.value;
              break;
            case 'FERs Withholding':
              fersRate = item.value;
              break;
            case 'Standard Deduction 2024':
              standardDeduction = item.value;
              break;
          }
        });

        const socialSecurityTax = state.grossPay * socialSecurityRate;
        const stateTax = state.grossPay * (state.stateTaxRate / 100);
        const fersWithholding = state.grossPay * fersRate;

        const grossIncome = state.grossPay * 26;
        const taxableIncome = grossIncome - standardDeduction;

        const { data: taxData } = await supabase
          .from('taxes')
          .select('*');

        let federalTax = 0;

        if (taxData && taxableIncome > 0) {
          const taxBrackets = taxData.map(t => t['Top End Tax Brackets Filing Single 2024']);
          const baseTaxes = taxData.map(t => t['Base Tax Paid']);
          const taxRates = taxData.map(t => t['Tax Rate']);

          let closestIndex = 0;
          let minDistance = Math.abs(taxableIncome - taxBrackets[0]);

          for (let i = 1; i < taxBrackets.length; i++) {
            const distance = Math.abs(taxableIncome - taxBrackets[i]);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = i;
            }
          }

          const baseTaxOwed = baseTaxes[closestIndex];
          const minBracket = taxBrackets[closestIndex];
          const rate = taxRates[closestIndex];

          federalTax = (baseTaxOwed + ((taxableIncome - minBracket) * rate)) / 26;
        }

        const totalDeductions = federalTax + stateTax + socialSecurityTax + 
                               state.tspContribution + fersWithholding + state.benefitsCost;

        const netPay = state.grossPay - totalDeductions;

        setState(prev => ({
          ...prev,
          socialSecurityTax,
          stateTax,
          federalTax: Math.max(0, federalTax),
          fersWithholding,
          totalDeductions,
          netPay,
        }));

      } catch (error) {
        console.error('Error calculating taxes:', error);
      }
    };

    calculateTaxes();
  }, [state.grossPay, state.stateTaxRate, state.benefitsCost, state.tspContribution]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calculator data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Ship Pay Calculator</h1>
              <p className="text-blue-100 text-sm">Estimate your MSC compensation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Info Panel */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                CIVMAR pay depends on your position, coast assignment, ship, overtime, and various incentive pays. 
                This calculator provides an estimate based on the scenario you configure.
              </p>
              <p className="text-gray-500">
                <strong>Tip:</strong> Select &quot;Pool Pay East&quot; or &quot;Pool Pay West&quot; as your ship to see base (non-ship) pay rates.
              </p>
            </div>
          </div>
        </div>

        {/* Selection Section */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Ship className="w-5 h-5 text-blue-600" />
              Assignment Details
            </h2>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Ship
                </label>
                <div className="relative">
                  <select
                    value={state.ship}
                    onChange={(e) => setState(prev => ({ ...prev, ship: e.target.value }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Choose Ship</option>
                    {ships.map((ship) => (
                      <option key={ship.name} value={ship.name}>
                        {ship.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Position
                </label>
                <div className="relative">
                  <select
                    value={state.position}
                    onChange={(e) => setState(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Choose Position</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Permanent Coast
                </label>
                <div className="relative">
                  <select
                    value={state.permCoast}
                    onChange={(e) => setState(prev => ({ ...prev, permCoast: e.target.value as 'EAST' | 'WEST' }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="EAST">EAST</option>
                    <option value="WEST">WEST</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Rate Display */}
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Annual Salary</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(state.salary)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Overtime Rate</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(state.overtimeRate)}<span className="text-sm font-normal text-gray-500">/hr</span></div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Penalty Rate</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(state.penaltyRate)}<span className="text-sm font-normal text-gray-500">/hr</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Variables Section */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Pay Variables
            </h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Overtime Hours <span className="text-gray-400 font-normal">(per pay period)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={state.overtimeHours}
                  onChange={(e) => setState(prev => ({ ...prev, overtimeHours: Number(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Typical range: 40-110 hours</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Penalty Hours <span className="text-gray-400 font-normal">(per pay period)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={state.penaltyHours}
                  onChange={(e) => setState(prev => ({ ...prev, penaltyHours: Number(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ToggleCard
                label="SRS Swimmer"
                checked={state.srsSwimmer}
                onChange={(checked) => setState(prev => ({ ...prev, srsSwimmer: checked }))}
                disabled={false}
              />
              <ToggleCard
                label="Ammo Pay"
                checked={state.ammoPay}
                onChange={(checked) => setState(prev => ({ ...prev, ammoPay: checked }))}
                disabled={!state.ammoEnabled}
                tooltip="Only available on T-AKE and T-AOE ships"
              />
              <ToggleCard
                label="Retention Pay"
                checked={state.retentionPay}
                onChange={(checked) => setState(prev => ({ ...prev, retentionPay: checked }))}
                disabled={!state.retentionEnabled}
                tooltip="Only available for certain positions"
              />
              <ToggleCard
                label="Berthing Pay"
                checked={state.berthingPay}
                onChange={(checked) => setState(prev => ({ ...prev, berthingPay: checked }))}
                disabled={!state.berthingEnabled}
                tooltip="Requires 3+ people in berthing area"
              />
            </div>
          </div>
        </section>

        {/* Gross Pay Section */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Gross Pay Per Pay Period
            </h2>
          </div>

          <div className="p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <EarningsCard label="Base Pay" value={state.basePay} />
              <EarningsCard label="Overtime" value={state.overtimeEarnings} />
              <EarningsCard label="Penalty Pay" value={state.penaltyEarnings} />
              <EarningsCard label="SRS Pay" value={state.srsEarnings} />
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <EarningsCard label="Ammo Pay" value={state.ammoEarnings} />
              <EarningsCard 
                label="Retention Pay" 
                value={state.retentionEarnings} 
                note={state.retentionNote}
              />
              <EarningsCard label="Berthing Pay" value={state.berthingEarnings} />
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 text-white h-full flex flex-col justify-center">
                  <div className="text-xs font-medium text-emerald-100 uppercase tracking-wide mb-1">Gross Pay</div>
                  <div className="text-2xl font-bold">{formatCurrency(state.grossPay)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deductions Section */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-500" />
              Deductions
            </h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Benefits Cost
                </label>
                <div className="relative">
                  <select
                    value={state.benefitsCost}
                    onChange={(e) => setState(prev => ({ ...prev, benefitsCost: Number(e.target.value) }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {BENEFITS_OPTIONS.map((val) => (
                      <option key={val} value={val}>${val}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State Tax Rate
                </label>
                <div className="relative">
                  <select
                    value={state.stateTaxRate}
                    onChange={(e) => setState(prev => ({ ...prev, stateTaxRate: Number(e.target.value) }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {STATE_TAX_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  TSP Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={state.tspContribution}
                    onChange={(e) => setState(prev => ({ ...prev, tspContribution: Number(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Social Security</div>
                <div className="text-lg font-semibold text-gray-900">{formatCurrency(state.socialSecurityTax)}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <DeductionCard label="State Tax" value={state.stateTax} />
              <DeductionCard label="Federal Tax" value={state.federalTax} />
              <DeductionCard label="FERS Withholding" value={state.fersWithholding} />
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Total Deductions</div>
                <div className="text-xl font-bold text-red-700">{formatCurrency(state.totalDeductions)}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Net Pay Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 text-center">
            <div className="text-blue-200 text-sm font-medium uppercase tracking-wide mb-2">
              Estimated Net Pay Per Pay Period
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {formatCurrency(state.netPay)}
            </div>
            <div className="text-blue-200 text-sm">
              ≈ {formatCurrency(state.netPay * 26)} annually (26 pay periods)
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-center text-sm text-gray-500 mt-6 px-4">
          This calculator provides estimates only. Actual pay may vary based on your specific situation, 
          tax filing status, and other factors. Consult with MSC HR for official compensation information.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ToggleCard({ 
  label, 
  checked, 
  onChange, 
  disabled,
  tooltip 
}: { 
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  disabled: boolean;
  tooltip?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative p-3 rounded-xl border-2 transition-all text-left ${
        disabled 
          ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' 
          : checked 
            ? 'bg-blue-50 border-blue-500 shadow-sm' 
            : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${checked ? 'text-blue-700' : 'text-gray-700'}`}>
          {label}
        </span>
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      {tooltip && disabled && (
        <p className="text-xs text-gray-400 mt-1">{tooltip}</p>
      )}
    </button>
  );
}

function EarningsCard({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{formatCurrency(value)}</div>
      {note && <p className="text-xs text-amber-600 mt-1">{note}</p>}
    </div>
  );
}

function DeductionCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{formatCurrency(value)}</div>
    </div>
  );
}