export const formatPrice = (price: number, currency: string): string => {
  return `${price.toLocaleString('vi-VN')} ${currency}`;
};

export const formatAmount = (amount: number, crypto: string): string => {
  return `${amount.toFixed(8)} ${crypto}`;
};

export const formatCompletionRate = (rate: number): string => {
  return `${(rate * 100).toFixed(1)}%`;
};

export const formatTradeCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const formatProcessingTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
};