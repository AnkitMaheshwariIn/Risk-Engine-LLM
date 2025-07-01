import { evaluateRisk, PaymentData } from '../services/riskService';

describe('evaluateRisk', () => {
  const basePaymentData: PaymentData = {
    amount: 100,
    currency: 'USD',
    ip: '192.168.1.1',
    deviceFingerprint: 'device-123',
    email: 'test@example.com'
  };

  beforeEach(() => {
    // Clear any accumulated state from previous tests
    jest.clearAllMocks();
  });

  test('should return low risk for normal transaction', () => {
    const result = evaluateRisk(basePaymentData);
    
    expect(result.score).toBeLessThan(0.4);
    expect(result.riskLevel).toBe('low');
    expect(result.reasons).toHaveLength(0);
  });

  test('should detect high-risk email domain', () => {
    const riskyData = { ...basePaymentData, email: 'user@fraud.net' };
    const result = evaluateRisk(riskyData);
    
    expect(result.score).toBeGreaterThanOrEqual(0.4);
    expect(result.riskLevel).toBe('moderate');
    expect(result.reasons).toContain('High-risk email domain');
  });

  test('should detect large transaction', () => {
    const largeTransaction = { ...basePaymentData, amount: 5000, currency: 'USD' };
    const result = evaluateRisk(largeTransaction);
    
    expect(result.score).toBeGreaterThanOrEqual(0.3);
    expect(result.riskLevel).toBe('low'); // Score 0.3 is below 0.4 threshold for moderate
    expect(result.reasons).toContain('Large transaction');
  });

  test('should detect multiple risk factors', () => {
    const highRiskData = {
      ...basePaymentData,
      email: 'user@fraud.net',
      amount: 5000,
      currency: 'USD'
    };
    const result = evaluateRisk(highRiskData);
    
    expect(result.score).toBeGreaterThanOrEqual(0.7);
    expect(result.riskLevel).toBe('high');
    expect(result.reasons).toContain('High-risk email domain');
    expect(result.reasons).toContain('Large transaction');
  });

  test('should handle different currencies', () => {
    const eurTransaction = { ...basePaymentData, amount: 1000, currency: 'EUR' };
    const result = evaluateRisk(eurTransaction);
    
    expect(result.score).toBeGreaterThanOrEqual(0.3);
    // EUR threshold is 900, so 1000 should trigger large transaction
    // But the score might be affected by other factors, so just check the reason
    expect(result.reasons).toContain('Large transaction');
  });

  test('should clamp score to maximum 1.0', () => {
    const extremeRiskData = {
      ...basePaymentData,
      email: 'user@fraud.net',
      amount: 10000,
      currency: 'USD'
    };
    const result = evaluateRisk(extremeRiskData);
    
    expect(result.score).toBeLessThanOrEqual(1.0);
  });

  test('should handle edge case with zero amount', () => {
    const zeroAmount = { ...basePaymentData, amount: 0 };
    const result = evaluateRisk(zeroAmount);
    
    expect(result.score).toBeLessThan(0.4);
    expect(result.riskLevel).toBe('low');
  });

  test('should handle negative amount', () => {
    const negativeAmount = { ...basePaymentData, amount: -100 };
    const result = evaluateRisk(negativeAmount);
    
    expect(result.score).toBeLessThan(0.4);
    expect(result.riskLevel).toBe('low');
  });
}); 