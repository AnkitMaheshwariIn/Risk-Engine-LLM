import { Request, Response, RequestHandler } from 'express';
import { evaluateRisk, PaymentData } from '../services/riskService';
import { generateExplanation } from '../services/explanationService';

/**
 * @openapi
 * /evaluate-risk:
 *   post:
 *     summary: Evaluate payment risk
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *               - ip
 *               - deviceFingerprint
 *               - email
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               ip:
 *                 type: string
 *               deviceFingerprint:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               amount: 5000
 *               currency: USD
 *               ip: 192.168.1.100
 *               deviceFingerprint: device-abc-123
 *               email: user@fraud.net
 *     responses:
 *       200:
 *         description: Risk evaluation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                 riskLevel:
 *                   type: string
 *                 reasons:
 *                   type: array
 *                   items:
 *                     type: string
 *                 explanation:
 *                   type: string
 *       400:
 *         description: Missing required fields
 */
const evaluateRiskHandler: RequestHandler = async (req: Request, res: Response) => {
  const { amount, currency, ip, deviceFingerprint, email } = req.body;
  if (!amount || !currency || !ip || !deviceFingerprint || !email) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  const paymentData: PaymentData = { amount, currency, ip, deviceFingerprint, email };
  const result = evaluateRisk(paymentData);
  const explanation = await generateExplanation(result.score, result.riskLevel, result.reasons);
  res.json({ ...result, explanation });
};

export default evaluateRiskHandler;