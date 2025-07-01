import { checkHighRiskEmail, checkLargeTransaction } from '../rules/heuristics';

describe('Heuristics Rules', () => {
  describe('checkHighRiskEmail', () => {
    test('should detect .ru domain as high risk', () => {
      expect(checkHighRiskEmail('user@example.ru')).toBe(true);
      expect(checkHighRiskEmail('test@domain.ru')).toBe(true);
    });

    test('should detect fraud.net domain as high risk', () => {
      expect(checkHighRiskEmail('user@fraud.net')).toBe(true);
      expect(checkHighRiskEmail('test@subdomain.fraud.net')).toBe(true);
    });

    test('should not flag normal domains as high risk', () => {
      expect(checkHighRiskEmail('user@example.com')).toBe(false);
      expect(checkHighRiskEmail('test@gmail.com')).toBe(false);
      expect(checkHighRiskEmail('admin@company.org')).toBe(false);
    });

    test('should handle case sensitivity', () => {
      expect(checkHighRiskEmail('user@EXAMPLE.RU')).toBe(true);
      expect(checkHighRiskEmail('user@Fraud.Net')).toBe(true);
    });

    test('should handle edge cases', () => {
      expect(checkHighRiskEmail('')).toBe(false);
      expect(checkHighRiskEmail('notanemail')).toBe(false);
      expect(checkHighRiskEmail('user@example.com.ru')).toBe(true);
    });
  });

  describe('checkLargeTransaction', () => {
    test('should detect large USD transactions', () => {
      expect(checkLargeTransaction(1001, 'USD')).toBe(true);
      expect(checkLargeTransaction(1000, 'USD')).toBe(false);
      expect(checkLargeTransaction(999, 'USD')).toBe(false);
    });

    test('should detect large EUR transactions', () => {
      expect(checkLargeTransaction(901, 'EUR')).toBe(true);
      expect(checkLargeTransaction(900, 'EUR')).toBe(false);
      expect(checkLargeTransaction(899, 'EUR')).toBe(false);
    });

    test('should detect large INR transactions', () => {
      expect(checkLargeTransaction(80001, 'INR')).toBe(true);
      expect(checkLargeTransaction(80000, 'INR')).toBe(false);
      expect(checkLargeTransaction(79999, 'INR')).toBe(false);
    });

    test('should use default threshold for unknown currencies', () => {
      expect(checkLargeTransaction(1001, 'UNKNOWN')).toBe(true);
      expect(checkLargeTransaction(1000, 'UNKNOWN')).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(checkLargeTransaction(0, 'USD')).toBe(false);
      expect(checkLargeTransaction(-100, 'USD')).toBe(false);
      expect(checkLargeTransaction(Number.MAX_SAFE_INTEGER, 'USD')).toBe(true);
    });

    test('should handle different currency cases', () => {
      expect(checkLargeTransaction(1001, 'usd')).toBe(true);
      expect(checkLargeTransaction(1001, 'USD')).toBe(true);
    });
  });
}); 