import { timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export function requireAdminToken(req: VercelRequest, res: VercelResponse): boolean {
  const expectedToken = process.env.USSF_ADMIN_API_TOKEN;
  if (!expectedToken) {
    res.status(503).json({ success: false, error: 'USSF_ADMIN_API_TOKEN is not configured for this Vercel environment.' });
    return false;
  }
  if (Buffer.byteLength(expectedToken) < 32) {
    res.status(503).json({ success: false, error: 'USSF_ADMIN_API_TOKEN must contain at least 32 bytes.' });
    return false;
  }

  const authorization = req.headers.authorization;
  const providedToken = typeof authorization === 'string' ? authorization.replace(/^Bearer\s+/i, '') : '';
  const expected = Buffer.from(expectedToken);
  const provided = Buffer.from(providedToken);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    res.status(401).json({ success: false, error: 'Administrator API token is missing or invalid.' });
    return false;
  }
  return true;
}
