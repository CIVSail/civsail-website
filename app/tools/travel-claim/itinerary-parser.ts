// app/tools/travel-claim/itinerary-parser.ts
/**
 * Parse itinerary legs from OCR text.
 */

import { ItineraryLeg, LocationType, StopReason, TransportType } from './types';

interface ParsedPoint {
  city: string;
  state?: string;
  date?: string;
  time?: string;
}

export interface ParsedItineraryResult {
  legs: ItineraryLeg[];
  notes: string[];
  flightInfo?: string;
}

const MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function toDateString(raw: string): string | undefined {
  const match = raw.match(/([A-Za-z]{3,9})\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return undefined;
  const day = Number.parseInt(match[2], 10);
  const year = Number.parseInt(match[3], 10);
  if (!day || !year) return undefined;
  return `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
}

function toTimeString(raw: string): string | undefined {
  const match = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return undefined;
  let hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
}

function parseDateTimeLine(line: string): { date?: string; time?: string } {
  const date = toDateString(line);
  const time = toTimeString(line);
  return { date, time };
}

function extractTripDate(lines: string[]): string | undefined {
  for (const line of lines) {
    if (line.toLowerCase().includes('trip on')) {
      const date = toDateString(line);
      if (date) return date;
    }
  }
  return undefined;
}

function parseLocationLine(line: string): ParsedPoint | null {
  const match = line.match(/([A-Z][A-Z\s]+),\s*([A-Z]{2})/);
  if (!match) return null;
  const city = match[1].trim();
  const state = match[2].trim();
  return { city, state };
}

function inferTimezoneOffset(state?: string): number {
  const stateOffsetMap: Record<string, number> = {
    AL: -6,
    AK: -9,
    AZ: -7,
    AR: -6,
    CA: -8,
    CO: -7,
    CT: -5,
    DC: -5,
    DE: -5,
    FL: -5,
    GA: -5,
    HI: -10,
    IA: -6,
    ID: -7,
    IL: -6,
    IN: -5,
    KS: -6,
    KY: -5,
    LA: -6,
    MA: -5,
    MD: -5,
    ME: -5,
    MI: -5,
    MN: -6,
    MO: -6,
    MS: -6,
    MT: -7,
    NC: -5,
    ND: -6,
    NE: -6,
    NH: -5,
    NJ: -5,
    NM: -7,
    NV: -8,
    NY: -5,
    OH: -5,
    OK: -6,
    OR: -8,
    PA: -5,
    RI: -5,
    SC: -5,
    SD: -6,
    TN: -6,
    TX: -6,
    UT: -7,
    VA: -5,
    VT: -5,
    WA: -8,
    WI: -6,
    WV: -5,
    WY: -7,
  };

  return state ? stateOffsetMap[state] ?? -5 : -5;
}

function inferTransportType(text: string): TransportType {
  const normalized = text.toLowerCase();
  if (normalized.includes('centrally billed') || normalized.includes('government')) {
    return 'govt-ticket-flight';
  }
  return 'commercial-flight-reimburse';
}

function extractFlightInfo(text: string): string | undefined {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const match = line.match(/Flight\s+([A-Za-z\s]+)\s+(\d{2,5})/i);
    if (match) {
      const airline = match[1].trim().replace(/\s+/g, ' ');
      const number = match[2].trim();
      return `${airline} ${number}`;
    }
  }

  return undefined;
}

function buildLeg(
  from: ParsedPoint,
  to: ParsedPoint,
  receiptIndex: number,
  legIndex: number,
  isLastLeg: boolean,
  transportType: TransportType,
  flightInfo?: string
): ItineraryLeg {
  const fromDetails = from.state ? `${from.city}, ${from.state}` : from.city;
  const toDetails = to.state ? `${to.city}, ${to.state}` : to.city;
  const reason: StopReason = isLastLeg ? 'TDY_STATION' : 'LAYOVER';
  const departureTimezone = inferTimezoneOffset(from.state);
  const arrivalTimezone = inferTimezoneOffset(to.state);

  return {
    id: `leg-ocr-${Date.now()}-${receiptIndex}-${legIndex}`,
    from: { type: 'Airport' as LocationType, details: fromDetails },
    to: { type: 'Airport' as LocationType, details: toDetails },
    departureDate: from.date || '',
    departureTime: from.time || '',
    arrivalDate: to.date || '',
    arrivalTime: to.time || '',
    departureTimezone,
    arrivalTimezone,
    transport: { type: transportType },
    reason,
    isFlight: true,
    isInternational: false,
    flightInfo,
  };
}

export function parseItineraryFromOcrText(
  text: string,
  receiptIndex: number
): ParsedItineraryResult {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const points: ParsedPoint[] = [];
  const notes: string[] = [];
  let mode: 'departure' | 'arrival' | null = null;
  const tripDate = extractTripDate(lines);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.toUpperCase() === 'DEPARTURE') {
      mode = 'departure';
      continue;
    }
    if (line.toUpperCase() === 'ARRIVAL') {
      mode = 'arrival';
      continue;
    }

    if (mode) {
      const location = parseLocationLine(line);
      if (location) {
        const dateTimeLine = lines[i + 1] || '';
        const dateTime = parseDateTimeLine(dateTimeLine);
        if (!dateTime.date) {
          notes.push('Could not find departure/arrival date');
        }
        if (!dateTime.time) {
          notes.push('Could not find departure/arrival time');
        }
        points.push({
          ...location,
          date: dateTime.date,
          time: dateTime.time,
        });
        mode = null;
      }
    }
  }

  const transportType = inferTransportType(text);
  const flightInfo = extractFlightInfo(text);
  const legs: ItineraryLeg[] = [];
  for (let i = 0; i < points.length - 1; i += 2) {
    const from = { ...points[i] };
    const to = { ...points[i + 1] };
    if (!from || !to) continue;
    if (!from.date && tripDate && i === 0) {
      from.date = tripDate;
    }
    legs.push(
      buildLeg(
        from,
        to,
        receiptIndex,
        i / 2,
        i + 2 >= points.length,
        transportType,
        flightInfo
      )
    );
  }

  return { legs, notes, flightInfo };
}
