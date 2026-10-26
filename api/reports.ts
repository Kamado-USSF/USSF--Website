import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql, sendApiError } from '../lib/db.js';

function validOptionalHttpUrl(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true;
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : null;
  if (!body) return res.status(400).json({ success: false, error: 'Field report must be a JSON object.' });

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const type = body.type;
  const hostName = typeof body.hostName === 'string' ? body.hostName.trim() : '';
  const hostCid = typeof body.hostCid === 'string' ? body.hostCid.trim() : '';
  const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
  const date = typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : '';
  const durationHours = Number(body.durationHours);
  const participants = Array.isArray(body.participants) && body.participants.every((x: unknown) => typeof x === 'string') ? body.participants.slice(0, 100) : null;

  if (!title || title.length > 200 || !['Patrol', 'Training', 'Combat', 'Incident'].includes(type) ||
      !hostName || hostName.length > 100 || !hostCid || hostCid.length > 80 ||
      !summary || summary.length > 5000 || !date ||
      !Number.isFinite(durationHours) || durationHours < 0 || durationHours > 48 ||
      !participants || !validOptionalHttpUrl(body.proofLink)) {
    return res.status(400).json({ success: false, error: 'Field report details are invalid. Check title, report type, host, date, duration, participants, and proof URL.' });
  }

  const report = {
    id: typeof body.id === 'string' && body.id.trim() ? body.id.trim().slice(0, 120) : `report-${randomUUID()}`,
    title, type, hostName, hostCid, durationHours, date, participants, summary,
    status: 'Pending Verification' as const,
    ...(typeof body.startTime === 'string' ? { startTime: body.startTime.slice(0, 40) } : {}),
    ...(typeof body.endTime === 'string' ? { endTime: body.endTime.slice(0, 40) } : {}),
    ...(typeof body.proofLink === 'string' && body.proofLink.trim() ? { proofLink: body.proofLink.trim() } : {})
  };

  try {
    const sql = await getSql();
    const rows = await sql`
      UPDATE ussf_app_state
      SET state = jsonb_set(
        state,
        '{fieldReports}',
        COALESCE(state->'fieldReports', '[]'::jsonb) || ${JSON.stringify(report)}::jsonb,
        true
      ), updated_at = now()
      WHERE id = 1
      RETURNING state->'fieldReports' AS field_reports
    `;
    if (!rows[0]) return res.status(503).json({ success: false, error: 'Shared database is not initialized. Run npm run migrate:neon.' });
    return res.status(201).json({ success: true, report });
  } catch (error) {
    return sendApiError(res, error, 'POST /api/reports');
  }
}
