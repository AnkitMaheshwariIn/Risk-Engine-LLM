export async function generateExplanation(score: number, riskLevel: string, reasons: string[]): Promise<string> {
  // Mock LLM logic: summarize the triggered rules and their impact
  if (reasons.length === 0) {
    return `The transaction was considered ${riskLevel} risk with a score of ${score}. No specific risk factors were detected.`;
  }
  const rules = reasons.join(', ');
  return `The transaction was considered ${riskLevel} risk (score: ${score}). The following factors contributed: ${rules}.`;
} 