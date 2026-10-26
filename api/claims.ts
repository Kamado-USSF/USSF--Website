import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql, sendApiError } from '../lib/db.js';

function validHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > 2048) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : null;
  if (!body) return res.status(400).json({ success: false, error: 'Claim must be a JSON object.' });

  const rewardTitle = typeof body.rewardTitle === 'string' ? body.rewardTitle.trim() : '';
  const rewardCategory = typeof body.rewardCategory === 'string' ? body.rewardCategory.trim() : '';
  const claimantName = typeof body.claimantName === 'string' ? body.claimantName.trim() : '';
  const claimantCid = typeof body.claimantCid === 'string' ? body.claimantCid.trim() : '';
  const amount = Number(body.amount);
  const date = typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : '';
  const proofUrl = typeof body.proofUrl === 'string' ? body.proofUrl.trim() : '';

  // Return the exact field that failed validation so the UI can be corrected without guesswork.
  if (!rewardTitle || rewardTitle.length > 200) {
    return res.status(400).json({ success: false, error: 'Invalid claim: reward title is missing or too long.' });
  }
  if (!rewardCategory || rewardCategory.length > 100) {
    return res.status(400).json({ success: false, error: 'Invalid claim: reward category is missing or too long.' });
  }
  if (!claimantName || claimantName.length > 100) {
    return res.status(400).json({ success: false, error: 'Invalid claim: claimant name is missing or too long.' });
  }
  if (!claimantCid || claimantCid.length > 80) {
    return res.status(400).json({ success: false, error: 'Invalid claim: claimant CID is missing or too long. Re-link your member account or contact an administrator.' });
  }
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000_000) {
    return res.status(400).json({ success: false, error: 'Invalid claim: amount must be a positive number.' });
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
    return res.status(400).json({ success: false, error: 'Invalid claim: date must be a real calendar date in YYYY-MM-DD format.' });
  }
  if (!validHttpUrl(proofUrl)) {
    return res.status(400).json({ success: false, error: 'Invalid claim: proof link must be a complete HTTP or HTTPS URL, including the domain (for example, https://imgur.com/...).' });
  }

  const claim = {
    id: typeof body.id === 'string' && body.id.trim() ? body.id.trim().slice(0, 120) : `claim-${randomUUID()}`,
    rewardTitle, rewardCategory, amount,
    ...(Number.isInteger(body.quantity) && body.quantity > 0 && body.quantity <= 1000 ? { quantity: body.quantity } : {}),
    claimantName, claimantCid, date, status: 'Pending' as const, proofUrl,
    ...(typeof body.note === 'string' && body.note.trim() ? { note: body.note.trim().slice(0, 2000) } : {})
  };

  try {
    const sql = await getSql();
    const rows = await sql`
      UPDATE ussf_app_state
      SET state = jsonb_set(
        state,
        '{claims}',
        COALESCE(state->'claims', '[]'::jsonb) || ${JSON.stringify(claim)}::jsonb,
        true
      ), updated_at = now()
      WHERE id = 1
      RETURNING state->'claims' AS claims
    `;
    if (!rows[0]) return res.status(503).json({ success: false, error: 'Shared database is not initialized. Run npm run migrate:neon.' });
    return res.status(201).json({ success: true, claim });
  } catch (error) {
    return sendApiError(res, error, 'POST /api/claims');
  }
}
