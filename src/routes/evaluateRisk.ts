import { Request, Response, RequestHandler } from 'express';
import { evaluateRisk, PaymentData } from '../services/riskService';

const evaluateRiskHandler: RequestHandler = (req: Request, res: Response) => {
  const { amount, currency, ip, deviceFingerprint, email } = req.body;
  if (!amount || !currency || !ip || !deviceFingerprint || !email) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  const paymentData: PaymentData = { amount, currency, ip, deviceFingerprint, email };
  const result = evaluateRisk(paymentData);
  res.json(result);
};

export default evaluateRiskHandler;