export const CURRENCY_SYMBOL = '₹';

/**
 * Format a numeric amount into Indian Rupee string (e.g. ₹4,500.00 or ₹4,500)
 */
export function formatINR(amount: number, showDecimals: boolean = true): string {
  if (isNaN(amount)) return '₹0.00';
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })}`;
}
