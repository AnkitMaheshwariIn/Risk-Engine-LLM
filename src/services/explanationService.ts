import OpenAI from 'openai';
import { buildRiskExplanationPrompt } from '../utils/promptBuilder';

if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_ORG_ID || !process.env.OPENAI_PROJECT_ID) {
    throw new Error('OpenAI API key or org ID or project ID missing in environment');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // required for sk-proj- keys
  project: process.env.OPENAI_PROJECT_ID
});

export async function generateExplanation(score: number, riskLevel: string, reasons: string[]): Promise<string> {
  try {
    const prompt = buildRiskExplanationPrompt(score, riskLevel, reasons);
    
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
            role: "user",
            content: prompt
            }
        ],
        max_tokens: 150,
        temperature: 0.3,
    });

    return response.choices[0].message.content || 'Unable to generate explanation';
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock response
    if (reasons.length === 0) {
      return `The transaction was considered ${riskLevel} risk with a score of ${score}. No specific risk factors were detected.`;
    }
    const rules = reasons.join(', ');
    return `The transaction was considered ${riskLevel} risk (score: ${score}). The following factors contributed: ${rules}.`;
  }
} 