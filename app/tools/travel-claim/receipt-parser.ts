// app/tools/travel-claim/receipt-parser.ts
/**
 * Parse OCR text from travel receipts into structured suggestions.
 */

import { AdditionalExpense, ItineraryLeg } from './types';
import { parseItineraryFromOcrText } from './itinerary-parser';

export interface ReceiptParseResult {
  expenses: AdditionalExpense[];
  itineraryLegs: ItineraryLeg[];
  flightInfo?: string;
  merchant?: string;
  notes: string[];
  confidence: number;
}

const TOTAL_KEYWORDS = [
  'total',
  'amount due',
  'balance due',
  'grand total',
  'amount',
];

const DATE_PATTERNS: RegExp[] = [
  /\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\b/, // MM/DD/YYYY
  /\b(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})\b/, // YYYY-MM-DD
];

function normalizeAmount(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const amount = Number.parseFloat(cleaned);
  if (Number.isNaN(amount)) return null;
  return Math.round(amount * 100) / 100;
}

function parseDate(text: string): string | null {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (!match) continue;

    if (pattern === DATE_PATTERNS[0]) {
      const month = Number.parseInt(match[1], 10);
      const day = Number.parseInt(match[2], 10);
      const year = Number.parseInt(match[3].length === 2 ? `20${match[3]}` : match[3], 10);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return `${year.toString().padStart(4, '0')}-${month
          .toString()
          .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    }

    if (pattern === DATE_PATTERNS[1]) {
      const year = Number.parseInt(match[1], 10);
      const month = Number.parseInt(match[2], 10);
      const day = Number.parseInt(match[3], 10);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return `${year.toString().padStart(4, '0')}-${month
          .toString()
          .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    }
  }
  return null;
}

function guessMerchant(lines: string[]): string | undefined {
  const candidates = lines
    .map((line) => line.trim())
    .filter((line) => line.length >= 3 && line.length <= 50)
    .filter((line) => /[A-Za-z]/.test(line))
    .filter((line) => !/invoice|receipt|total|tax|amount due|balance due/i.test(line));

  return candidates[0];
}

function extractTotal(text: string): number | null {
  const lower = text.toLowerCase();
  for (const keyword of TOTAL_KEYWORDS) {
    const index = lower.indexOf(keyword);
    if (index === -1) continue;
    const slice = text.slice(index, index + 80);
    const amountMatch = slice.match(/\$?\s*([0-9]+[.,][0-9]{2})/);
    if (amountMatch) {
      return normalizeAmount(amountMatch[1]);
    }
  }

  const fallback = text.match(/\$\s*([0-9]+[.,][0-9]{2})/g);
  if (!fallback || fallback.length === 0) return null;
  const last = fallback[fallback.length - 1];
  const amountMatch = last.match(/([0-9]+[.,][0-9]{2})/);
  if (!amountMatch) return null;
  return normalizeAmount(amountMatch[1]);
}

export function parseReceiptText(
  text: string,
  receiptIndex: number,
  confidence: number
): ReceiptParseResult {
  const cleanedText = text.replace(/\r/g, '\n');
  const lines = cleanedText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const merchant = guessMerchant(lines);
  const date = parseDate(cleanedText);
  const total = extractTotal(cleanedText);

  const notes: string[] = [];
  if (!date) notes.push('Could not find date');
  if (!total) notes.push('Could not find amount');
  if (!merchant) notes.push('Could not find description');

  const expenses: AdditionalExpense[] = [];
  const hasAnyDetails = Boolean(merchant || date || total !== null);
  if (hasAnyDetails) {
    expenses.push({
      id: `exp-ocr-${Date.now()}-${receiptIndex}`,
      date: date || '',
      description: merchant ? `${merchant} receipt` : 'Receipt expense',
      amount: total ?? 0,
      paidWithGTCC: false,
    });
  }

  const itineraryParse = parseItineraryFromOcrText(text, receiptIndex);
  const itineraryLegs = itineraryParse.legs;
  const flightInfo = itineraryParse.flightInfo;
  notes.push(...itineraryParse.notes);


  return {
    expenses,
    itineraryLegs,
    flightInfo,
    merchant,
    notes,
    confidence,
  };
}
