/**
 * Currency Utility
 * Centralized currency formatting for the entire application
 */

// Currency symbol for the application (UK Pound)
export const CURRENCY_SYMBOL = '£';

// Currency code
export const CURRENCY_CODE = 'GBP';

/**
 * Formats a number as currency with pound symbol
 * @param amount - The amount to format
 * @param showDecimals - Whether to show decimal places (default: true)
 * @returns Formatted currency string (e.g., "£120.00")
 */
export function formatCurrency(amount: number, showDecimals: boolean = true): string {
  if (amount === 0) return 'Free';
  
  if (showDecimals) {
    return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
  }
  
  return `${CURRENCY_SYMBOL}${Math.round(amount)}`;
}

/**
 * Formats a price as currency (alias for formatCurrency)
 * @param price - The price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return formatCurrency(price);
}

/**
 * Formats currency without decimal places
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "£120")
 */
export function formatCurrencyShort(amount: number): string {
  return formatCurrency(amount, false);
}

/**
 * Parse currency string to number
 * @param currencyString - Currency string to parse (e.g., "£120.00")
 * @returns Numeric value
 */
export function parseCurrency(currencyString: string): number {
  return parseFloat(currencyString.replace(/[£$,]/g, ''));
}

