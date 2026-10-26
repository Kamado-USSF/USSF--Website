import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ success: true, service: 'ussf-api' });
}
