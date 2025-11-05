// Currency conversion utilities

// USD to INR conversion rate (update as needed)
export const USD_TO_INR_RATE = 83.5;

/**
 * Convert USD to INR
 */
export const convertUSDToINR = (usdAmount: number): number => {
  return usdAmount * USD_TO_INR_RATE;
};

/**
 * Format price in INR
 */
export const formatPriceINR = (price: number, isUSD: boolean = true): string => {
  const amount = isUSD ? convertUSDToINR(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format price in USD
 */
export const formatPriceUSD = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);
};

