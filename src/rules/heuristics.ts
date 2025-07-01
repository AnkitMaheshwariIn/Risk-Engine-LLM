export function checkHighRiskEmail(email: string): boolean {
  const highRiskDomains = ['.ru', 'fraud.net'];
  return highRiskDomains.some(domain => email.toLowerCase().endsWith(domain.toLowerCase()));
}

export function checkLargeTransaction(amount: number, currency: string): boolean {
  // Example: USD > $1000 is large, other currencies can be adjusted
  const thresholds: Record<string, number> = {
    USD: 1000,
    EUR: 900,
    INR: 80000,
    GBP: 800,
    DEFAULT: 1000,
  };
  const threshold = thresholds[currency] || thresholds.DEFAULT;
  return amount > threshold;
} 