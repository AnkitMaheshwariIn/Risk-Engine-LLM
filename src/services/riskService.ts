import { checkHighRiskEmail, checkLargeTransaction } from '../rules/heuristics';
import { trackAndScoreIpOrDevice } from '../utils/ipDeviceTracker';

export interface PaymentData {
  amount: number;
  currency: string;
  ip: string;
  deviceFingerprint: string;
  email: string;
}

export function evaluateRisk(data: PaymentData) {
  let score = 0;
  const reasons: string[] = [];

  // Heuristic 1: High-risk email domain
  if (checkHighRiskEmail(data.email)) {
    score += 0.4;
    reasons.push('High-risk email domain');
  }

  // Heuristic 2: Large transaction
  if (checkLargeTransaction(data.amount, data.currency)) {
    score += 0.3;
    reasons.push('Large transaction');
  }

  // Heuristic 3: Repeat IP/device
  const repeatScore = trackAndScoreIpOrDevice(data.ip, data.deviceFingerprint);
  if (repeatScore > 0) {
    score += repeatScore;
    reasons.push('Repeat IP or device');
  }

  // Clamp score between 0.0 and 1.0
  score = Math.min(1, score);

  let riskLevel: 'low' | 'moderate' | 'high' = 'low';
  if (score >= 0.7) riskLevel = 'high';
  else if (score >= 0.4) riskLevel = 'moderate';

  return {
    score,
    riskLevel,
    reasons,
  };
} 