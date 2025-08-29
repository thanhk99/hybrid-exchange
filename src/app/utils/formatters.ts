// Utility functions for formatting currency and percentage values

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0.00';
  }
  
  // Format with appropriate decimal places based on amount size
  const decimals = amount >= 1 ? 2 : amount >= 0.01 ? 4 : 6;
  
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  }).format(amount);
};

export const formatPercentage = (value: number | undefined | null): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '+0.00%';
  }
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatPnLAmount = (amount: number | undefined | null): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0.00';
  }
  
  return formatCurrency(Math.abs(amount));
};