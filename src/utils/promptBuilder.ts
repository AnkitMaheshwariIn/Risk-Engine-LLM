export function buildRiskExplanationPrompt(score: number, riskLevel: string, reasons: string[]): string {
  const hasReasons = reasons.length > 0;
  const reasonsText = hasReasons ? reasons.join(', ') : 'none detected';
  
  return `You are a fraud detection expert. Analyze the following risk assessment and provide a clear, concise explanation:

Risk Score: ${score}
Risk Level: ${riskLevel}
Triggered Risk Factors: ${reasonsText}

Please provide a human-readable explanation that:
1. Explains why this transaction was classified as ${riskLevel} risk
2. Summarizes the specific risk factors that contributed to this assessment
3. Uses clear, non-technical language that a business user can understand
4. Is 2-3 sentences maximum

Explanation:`;
} 