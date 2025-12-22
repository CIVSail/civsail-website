// app/tools/pay-comparison/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GitCompare,
  Ship,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Equal,
  Info,
  ArrowRight,
  Anchor,
} from 'lucide-react';
import { createPayClient } from '@/lib/supabase/pay-client';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

interface ShipOption {
  name: string;
  type: string;
}

interface ShipState {
  ship: string;
  shipType: string;
  position: string;
  permCoast: 'EAST' | 'WEST';
  salary: number;
  overtimeRate: number;
  penaltyRate: number;
  overtimeHours: number;
  penaltyHours: number;
  ammoPay: boolean;
  ammoEnabled: boolean;
  basePay: number;
  overtimeEarnings: number;
  penaltyEarnings: number;
  ammoEarnings: number;
  grossPay: number;
}

const initialShipState: ShipState = {
  ship: '',
  shipType: '',
  position: '',
  permCoast: 'EAST',
  salary: 0,
  overtimeRate: 0,
  penaltyRate: 0,
  overtimeHours: 0,
  penaltyHours: 0,
  ammoPay: false,
  ammoEnabled: false,
  basePay: 0,
  overtimeEarnings: 0,
  penaltyEarnings: 0,
  ammoEarnings: 0,
  grossPay: 0,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatCurrencyWithSign = (value: number): string => {
  const formatted = formatCurrency(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PayComparisonPage() {
  const supabase = useMemo(() => createPayClient(), []);
  
  // Data from Supabase
  const [ships, setShips] = useState<ShipOption[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Ship states
  const [ship1, setShip1] = useState<ShipState>(initialShipState);
  const [ship2, setShip2] = useState<ShipState>(initialShipState);

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
  }, [supabase]);

  // ============================================================================
  // SALARY FETCHING
  // ============================================================================

  const fetchSalaryForShip = useCallback(async (
    shipState: ShipState,
    setShipState: React.Dispatch<React.SetStateAction<ShipState>>
  ) => {
    if (!shipState.ship || !shipState.position) {
      setShipState(prev => ({
        ...prev,
        salary: 0,
        overtimeRate: 0,
        penaltyRate: 0,
        basePay: 0,
        ammoEnabled: false,
        ammoPay: false,
      }));
      return;
    }

    try {
      const selectedShip = ships.find(s => s.name === shipState.ship);
      let shipType = selectedShip?.type || '';

      if (shipType === 'TBD') {
        shipType = shipState.permCoast;
      }

      const ammoEnabled = shipType === 'West Coast T-AKE' || shipType === 'East Coast T-AKE, T-AOE';

      const { data: coastData } = await supabase
        .from(shipState.permCoast)
        .select('Salary')
        .eq('"Position Title"', shipState.position);

      const { data: shipData } = await supabase
        .from(shipType)
        .select('Salary')
        .eq('"Position Title"', shipState.position);

      const coastSalary = coastData?.[0]?.Salary || 0;
      const shipSalary = shipData?.[0]?.Salary || 0;
      
      const effectiveShipType = coastSalary > shipSalary ? shipState.permCoast : shipType;

      const { data: salaryData } = await supabase
        .from(effectiveShipType)
        .select('Salary, OverTime, Penalty')
        .eq('"Position Title"', shipState.position);

      if (salaryData?.[0]) {
        const salary = salaryData[0].Salary || 0;
        const basePay = salary / 26;
        const overtimeRate = salaryData[0].OverTime || 0;
        const penaltyRate = salaryData[0].Penalty || 0;

        setShipState(prev => ({
          ...prev,
          shipType: effectiveShipType,
          salary,
          overtimeRate,
          penaltyRate,
          basePay,
          ammoEnabled,
          ammoPay: ammoEnabled ? prev.ammoPay : false,
        }));
      }
    } catch (error) {
      console.error('Error fetching salary:', error);
    }
  }, [ships, supabase]);

  // Fetch salary when ship 1 changes
  useEffect(() => {
    fetchSalaryForShip(ship1, setShip1);
  }, [ship1.ship, ship1.position, ship1.permCoast, fetchSalaryForShip]);

  // Fetch salary when ship 2 changes
  useEffect(() => {
    fetchSalaryForShip(ship2, setShip2);
  }, [ship2.ship, ship2.position, ship2.permCoast, fetchSalaryForShip]);

  // ============================================================================
  // EARNINGS CALCULATIONS
  // ============================================================================

  // Calculate earnings for ship 1
  useEffect(() => {
    const overtimeEarnings = ship1.overtimeHours * ship1.overtimeRate;
    const penaltyEarnings = ship1.penaltyHours * ship1.penaltyRate;
    const ammoEarnings = ship1.ammoPay ? ship1.basePay * 0.1 : 0;
    const grossPay = ship1.basePay + overtimeEarnings + penaltyEarnings + ammoEarnings;

    setShip1(prev => ({
      ...prev,
      overtimeEarnings,
      penaltyEarnings,
      ammoEarnings,
      grossPay,
    }));
  }, [ship1.basePay, ship1.overtimeHours, ship1.penaltyHours, ship1.overtimeRate, ship1.penaltyRate, ship1.ammoPay]);

  // Calculate earnings for ship 2
  useEffect(() => {
    const overtimeEarnings = ship2.overtimeHours * ship2.overtimeRate;
    const penaltyEarnings = ship2.penaltyHours * ship2.penaltyRate;
    const ammoEarnings = ship2.ammoPay ? ship2.basePay * 0.1 : 0;
    const grossPay = ship2.basePay + overtimeEarnings + penaltyEarnings + ammoEarnings;

    setShip2(prev => ({
      ...prev,
      overtimeEarnings,
      penaltyEarnings,
      ammoEarnings,
      grossPay,
    }));
  }, [ship2.basePay, ship2.overtimeHours, ship2.penaltyHours, ship2.overtimeRate, ship2.penaltyRate, ship2.ammoPay]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const payDifference = ship1.grossPay - ship2.grossPay;
  const annualDifference = payDifference * 26;

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <GitCompare className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Pay Comparison Calculator</h1>
              <p className="text-emerald-100 text-sm">Compare compensation between ships</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Info Panel */}
        <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-5 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p>
                Compare gross pay between two different ships or positions. Configure overtime and penalty hours 
                for each scenario to see the difference in compensation.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links to Ships */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Anchor className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">Quick Compare by Ship Class</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['T-AKE', 'T-AO', 'T-ESB', 'T-EPF', 'T-AH', 'T-AS'].map((shipClass) => (
              <Link
                key={shipClass}
                href={`/ships/msc?class=${shipClass}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"
              >
                {shipClass}
                <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Ship 1 */}
          <ShipCard
            title="Ship 1"
            shipState={ship1}
            setShipState={setShip1}
            ships={ships}
            positions={positions}
            colorScheme="blue"
          />

          {/* Ship 2 */}
          <ShipCard
            title="Ship 2"
            shipState={ship2}
            setShipState={setShip2}
            ships={ships}
            positions={positions}
            colorScheme="purple"
          />
        </div>

        {/* Difference Summary */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <GitCompare className="w-5 h-5" />
              Comparison Result
            </h2>
          </div>

          <div className="p-6">
            {/* Visual Comparison Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600">Ship 1: {formatCurrency(ship1.grossPay)}</span>
                <span className="text-sm font-medium text-purple-600">Ship 2: {formatCurrency(ship2.grossPay)}</span>
              </div>
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                {ship1.grossPay > 0 || ship2.grossPay > 0 ? (
                  <>
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                      style={{ 
                        width: `${Math.max(ship1.grossPay, ship2.grossPay) > 0 
                          ? (ship1.grossPay / Math.max(ship1.grossPay, ship2.grossPay)) * 50 
                          : 0}%` 
                      }}
                    />
                    <div 
                      className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-500 to-purple-600 transition-all duration-500"
                      style={{ 
                        width: `${Math.max(ship1.grossPay, ship2.grossPay) > 0 
                          ? (ship2.grossPay / Math.max(ship1.grossPay, ship2.grossPay)) * 50 
                          : 0}%` 
                      }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                    Select ships to compare
                  </div>
                )}
              </div>
            </div>

            {/* Difference Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={`rounded-xl p-6 ${
                payDifference > 0 
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200' 
                  : payDifference < 0 
                    ? 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'
                    : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {payDifference > 0 ? (
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  ) : payDifference < 0 ? (
                    <TrendingDown className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Equal className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-600">Per Pay Period</span>
                </div>
                <div className={`text-3xl font-bold ${
                  payDifference > 0 ? 'text-blue-700' : payDifference < 0 ? 'text-purple-700' : 'text-gray-700'
                }`}>
                  {formatCurrencyWithSign(payDifference)}
                </div>
                {payDifference !== 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Ship {payDifference > 0 ? '1' : '2'} pays more
                  </p>
                )}
              </div>

              <div className={`rounded-xl p-6 ${
                annualDifference > 0 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : annualDifference < 0 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                    : 'bg-gray-700'
              } text-white`}>
                <div className="flex items-center gap-2 mb-2">
                  {annualDifference > 0 ? (
                    <TrendingUp className="w-5 h-5 text-blue-200" />
                  ) : annualDifference < 0 ? (
                    <TrendingDown className="w-5 h-5 text-purple-200" />
                  ) : (
                    <Equal className="w-5 h-5 text-gray-300" />
                  )}
                  <span className="text-sm font-medium text-white/80">Annual Difference</span>
                </div>
                <div className="text-3xl font-bold">
                  {formatCurrencyWithSign(annualDifference)}
                </div>
                {annualDifference !== 0 && (
                  <p className="text-sm text-white/70 mt-1">
                    Over 26 pay periods
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-center text-sm text-gray-500 mt-6 px-4">
          This comparison shows gross pay estimates only. Actual compensation may vary based on 
          additional factors not included in this calculator.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// SHIP CARD COMPONENT
// ============================================================================

function ShipCard({
  title,
  shipState,
  setShipState,
  ships,
  positions,
  colorScheme,
}: {
  title: string;
  shipState: ShipState;
  setShipState: React.Dispatch<React.SetStateAction<ShipState>>;
  ships: ShipOption[];
  positions: string[];
  colorScheme: 'blue' | 'purple';
}) {
  const isBlue = colorScheme === 'blue';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${isBlue ? 'from-blue-600 to-blue-700' : 'from-purple-600 to-purple-700'} px-6 py-4`}>
        <div className="flex items-center gap-3">
          <Ship className="w-5 h-5 text-white" />
          <h2 className="font-semibold text-white">{title}</h2>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ship</label>
            <div className="relative">
              <select
                value={shipState.ship}
                onChange={(e) => setShipState(prev => ({ ...prev, ship: e.target.value }))}
                className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 ${isBlue ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-purple-500 focus:border-purple-500'} transition-colors`}
              >
                <option value="">Select a ship</option>
                {ships.map((ship) => (
                  <option key={ship.name} value={ship.name}>{ship.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
            <div className="relative">
              <select
                value={shipState.position}
                onChange={(e) => setShipState(prev => ({ ...prev, position: e.target.value }))}
                className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 ${isBlue ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-purple-500 focus:border-purple-500'} transition-colors`}
              >
                <option value="">Select a position</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Permanent Coast</label>
            <div className="relative">
              <select
                value={shipState.permCoast}
                onChange={(e) => setShipState(prev => ({ ...prev, permCoast: e.target.value as 'EAST' | 'WEST' }))}
                className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 ${isBlue ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-purple-500 focus:border-purple-500'} transition-colors`}
              >
                <option value="EAST">EAST</option>
                <option value="WEST">WEST</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Rates Display */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Salary</div>
            <div className="text-sm font-semibold text-gray-900">{formatCurrency(shipState.salary)}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">OT Rate</div>
            <div className="text-sm font-semibold text-gray-900">{formatCurrency(shipState.overtimeRate)}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Penalty</div>
            <div className="text-sm font-semibold text-gray-900">{formatCurrency(shipState.penaltyRate)}</div>
          </div>
        </div>

        {/* Variables */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Variables</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">OT Hours</label>
              <input
                type="number"
                min="0"
                value={shipState.overtimeHours}
                onChange={(e) => setShipState(prev => ({ ...prev, overtimeHours: Number(e.target.value) || 0 }))}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 ${isBlue ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-purple-500 focus:border-purple-500'}`}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Penalty Hours</label>
              <input
                type="number"
                min="0"
                value={shipState.penaltyHours}
                onChange={(e) => setShipState(prev => ({ ...prev, penaltyHours: Number(e.target.value) || 0 }))}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 ${isBlue ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-purple-500 focus:border-purple-500'}`}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShipState(prev => ({ ...prev, ammoPay: !prev.ammoPay }))}
              disabled={!shipState.ammoEnabled}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left text-sm ${
                !shipState.ammoEnabled
                  ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                  : shipState.ammoPay
                    ? isBlue 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-purple-50 border-purple-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={shipState.ammoPay ? (isBlue ? 'text-blue-700' : 'text-purple-700') : 'text-gray-700'}>
                  Ammo Pay (+10%)
                </span>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  shipState.ammoPay 
                    ? isBlue 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-purple-600 border-purple-600'
                    : 'border-gray-300'
                }`}>
                  {shipState.ammoPay && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              {!shipState.ammoEnabled && (
                <p className="text-xs text-gray-400 mt-1">Only T-AKE/T-AOE ships</p>
              )}
            </button>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Earnings Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Base Pay</span>
              <span className="font-medium text-gray-900">{formatCurrency(shipState.basePay)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Overtime</span>
              <span className="font-medium text-gray-900">{formatCurrency(shipState.overtimeEarnings)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Penalty</span>
              <span className="font-medium text-gray-900">{formatCurrency(shipState.penaltyEarnings)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ammo</span>
              <span className="font-medium text-gray-900">{formatCurrency(shipState.ammoEarnings)}</span>
            </div>
          </div>
        </div>

        {/* Gross Pay */}
        <div className={`bg-gradient-to-r ${isBlue ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'} rounded-xl p-4 text-white`}>
          <div className="text-sm text-white/80 mb-1">Gross Pay / Period</div>
          <div className="text-2xl font-bold">{formatCurrency(shipState.grossPay)}</div>
        </div>
      </div>
    </div>
  );
}