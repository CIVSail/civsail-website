/**
 * Date utility functions for credential expiration calculations
 */

import { differenceInDays, parseISO, format } from 'date-fns';
import type { ExpirationInfo, ExpirationStatus } from '@/types/database';

/**
 * Calculate expiration status and days remaining for a credential
 */
export function calculateExpiration(expirationDate: string | null): ExpirationInfo {
  if (!expirationDate) {
    return {
      status: 'valid',
      daysRemaining: Infinity,
      message: 'No expiration date set',
    };
  }

  const today = new Date();
  const expDate = parseISO(expirationDate);
  const daysRemaining = differenceInDays(expDate, today);

  let status: ExpirationStatus;
  let message: string;

  if (daysRemaining < 0) {
    status = 'expired';
    message = `Expired ${Math.abs(daysRemaining)} days ago`;
  } else if (daysRemaining <= 120) {
    status = 'urgent';
    message = `Expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
  } else if (daysRemaining <= 547) {
    status = 'warning';
    message = `Expires in ${daysRemaining} days`;
  } else {
    status = 'valid';
    message = `Valid until ${format(expDate, 'MMM d, yyyy')}`;
  }

  return {
    status,
    daysRemaining,
    message,
  };
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not set';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Get CSS classes for expiration status badge
 */
export function getExpirationClasses(status: ExpirationStatus): string {
  const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
  
  switch (status) {
    case 'expired':
      return `${baseClasses} bg-red-100 text-red-800 border-2 border-red-300`;
    case 'urgent':
      return `${baseClasses} bg-red-50 text-red-700 border-2 border-red-200`;
    case 'warning':
      return `${baseClasses} bg-yellow-50 text-yellow-700 border-2 border-yellow-200`;
    case 'valid':
      return `${baseClasses} bg-green-50 text-green-700 border-2 border-green-200`;
    default:
      return `${baseClasses} bg-gray-50 text-gray-700 border-2 border-gray-200`;
  }
}

/**
 * Get input field classes for expiration status
 */
export function getExpirationInputClasses(status: ExpirationStatus): string {
  switch (status) {
    case 'expired':
    case 'urgent':
      return 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500';
    case 'warning':
      return 'border-yellow-300 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-500';
    case 'valid':
      return 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500';
    default:
      return 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500';
  }
}