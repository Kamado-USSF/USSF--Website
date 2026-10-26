import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql, sendApiError } from '../lib/db.js';
import { validateApplication } from '../lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });

  try {
    const validation = validateApplication(req.body);
    if (!validation.ok) return res.status(400).json({ success: false, error: validation.error });
    const application = {
      id: `application-${randomUUID()}`,
      ...validation.value,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Review' as const
    };
    const sql = await getSql();
    const rows = await sql`
      UPDATE ussf_app_state
      SET state = jsonb_set(
        state,
        '{applications}',
        COALESCE(state->'applications', '[]'::jsonb) || ${JSON.stringify(application)}::jsonb,
        true
      ), updated_at = now()
      WHERE id = 1
      RETURNING state->'applications' AS applications
    `;
    if (!rows[0]) return res.status(503).json({ success: false, error: 'Shared database is not initialized. Run npm run migrate:neon.' });
    return res.status(201).json({ success: true, application });
  } catch (error) {
    return sendApiError(res, error, 'POST /api/applications');
  }
}
