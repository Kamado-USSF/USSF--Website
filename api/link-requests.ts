import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql, readState, sendApiError } from '../lib/db.js';
import { findLinkRequestConflict, validateLinkRequest } from '../lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });

  const requestId = String(req.headers['x-vercel-id'] || randomUUID());
  try {
    const validation = validateLinkRequest(req.body);
    if (!validation.ok) return res.status(400).json({ success: false, error: validation.error });
    const state = await readState();
    const conflict = findLinkRequestConflict(state, validation.value.username, validation.value.inGameCid);
    if (conflict?.existing) return res.status(200).json({ success: true, request: conflict.existing });
    if (conflict) return res.status(409).json({ success: false, error: conflict.error });

    const request = {
      id: `link-${randomUUID()}`,
      ...validation.value,
      submissionDate: new Date().toISOString(),
      status: 'Pending' as const,
      adminNote: 'Submitted via official account linking portal.'
    };
    const sql = await getSql();
    const rows = await sql`
      UPDATE ussf_app_state
      SET state = jsonb_set(
        state,
        '{linkRequests}',
        COALESCE(state->'linkRequests', '[]'::jsonb) || ${JSON.stringify(request)}::jsonb,
        true
      ), updated_at = now()
      WHERE id = 1
        AND NOT EXISTS (
          SELECT 1
          FROM jsonb_array_elements(COALESCE(state->'linkRequests', '[]'::jsonb)) AS existing_request(item)
          WHERE item->>'status' = 'Pending'
            AND (lower(item->>'username') = lower(${request.username}) OR lower(item->>'inGameCid') = lower(${request.inGameCid}))
        )
        AND NOT EXISTS (
          SELECT 1
          FROM jsonb_array_elements(COALESCE(state->'members', '[]'::jsonb)) AS member(item)
          WHERE lower(item->>'cid') = lower(${request.inGameCid})
            OR lower(item->>'accountName') = lower(${request.username})
        )
      RETURNING state->'linkRequests' AS requests
    `;
    if (!rows[0]) return res.status(409).json({ success: false, error: 'The account or CID became associated with another request. Refresh and verify the details.' });
    return res.status(201).json({ success: true, request });
  } catch (error) {
    return sendApiError(res, error, 'POST /api/link-requests', requestId);
  }
}
