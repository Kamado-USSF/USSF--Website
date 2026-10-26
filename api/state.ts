import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readState, sendApiError } from '../lib/db.js';
import { toPublicState } from '../lib/public-state.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  try {
    const state = await readState();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ success: true, data: toPublicState(state) });
  } catch (error) {
    return sendApiError(res, error, 'GET /api/state');
  }
}
