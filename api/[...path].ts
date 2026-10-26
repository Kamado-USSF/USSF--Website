import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';
import { getSql, sendApiError } from '../lib/db.js';
import { requireAdminToken } from '../lib/auth.js';

type JsonObject = Record<string, unknown>;

const ROUTES: Record<string, { collection: string; itemKey: string; publicCreate: boolean }> = {
  members: { collection: 'members', itemKey: 'member', publicCreate: false },
  claims: { collection: 'claims', itemKey: 'claim', publicCreate: true },
  reports: { collection: 'fieldReports', itemKey: 'report', publicCreate: true },
  promotions: { collection: 'promotionRequests', itemKey: 'promo', publicCreate: true },
  applications: { collection: 'applications', itemKey: 'application', publicCreate: true },
  'admin-events': { collection: 'adminEvents', itemKey: 'event', publicCreate: false },
  'social-posts': { collection: 'socialPosts', itemKey: 'post', publicCreate: true },
};

function objectBody(value: unknown): JsonObject | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : null;
}

function cleanId(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, 120) : '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const path = Array.isArray(req.query.path) ? req.query.path : [String(req.query.path || '')];
  const route = path[0];
  const id = cleanId(path[1]);
  const config = ROUTES[route];

  if (!config || (route === 'claims' && req.method === 'POST')) {
    if (route === 'claims' && req.method === 'POST') {
      return res.status(501).json({ success: false, error: `${req.method} /api/${path.join('/')} is not implemented on this endpoint.` });
    }
    return res.status(404).json({ success: false, error: `API route not found: /api/${path.join('/')}` });
  }

  const isCreate = path.length === 1 && req.method === 'POST';
  const isUpdate = path.length === 2 && req.method === 'PUT';
  const isDelete = path.length === 2 && req.method === 'DELETE';
  if (!isCreate && !isUpdate && !isDelete) {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }
  if (!(isCreate && config.publicCreate) && !requireAdminToken(req, res)) return;

  const body = objectBody(req.body);
  if (!isDelete && !body) return res.status(400).json({ success: false, error: 'Request body must be a JSON object.' });
  if (isUpdate && !id) return res.status(400).json({ success: false, error: 'Resource ID is required.' });

  try {
    const sql = await getSql();
    if (isCreate) {
      const record: Record<string, any> = { ...body, id: cleanId(body?.id) || `${route}-${randomUUID()}` };
      if (route === 'claims') record.status = 'Pending';
      if (route === 'reports') record.status = 'Pending Verification';
      if (route === 'promotions') record.status = 'Pending';
      if (route === 'applications') record.status = 'Pending Review';
      const rows = await sql`
        UPDATE ussf_app_state
        SET state = jsonb_set(state, ARRAY[${config.collection}],
          COALESCE(state->${config.collection}, '[]'::jsonb) || ${JSON.stringify(record)}::jsonb, true),
          updated_at = now()
        WHERE id = 1
        RETURNING state->${config.collection} AS records
      `;
      if (!rows[0]) return res.status(503).json({ success: false, error: 'Shared database is not initialized.' });
      return res.status(201).json({ success: true, [config.itemKey]: record });
    }

    const updates = isDelete ? null : body!;
    if (isUpdate && updates && cleanId(updates?.id) && cleanId(updates.id) !== id) {
      return res.status(400).json({ success: false, error: 'Resource ID does not match the URL.' });
    }
    const rows = isDelete
      ? await sql`
          UPDATE ussf_app_state
          SET state = jsonb_set(state, ARRAY[${config.collection}],
            COALESCE((SELECT jsonb_agg(entry.item ORDER BY entry.ordinality)
              FROM jsonb_array_elements(COALESCE(state->${config.collection}, '[]'::jsonb))
              WITH ORDINALITY AS entry(item, ordinality)
              WHERE entry.item->>'id' <> ${id}), '[]'::jsonb), true),
            updated_at = now()
          WHERE id = 1 AND EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(state->${config.collection}, '[]'::jsonb)) AS entry(item) WHERE entry.item->>'id' = ${id})
          RETURNING state->${config.collection} AS records
        `
      : await sql`
          UPDATE ussf_app_state
          SET state = jsonb_set(state, ARRAY[${config.collection}],
            (SELECT jsonb_agg(CASE WHEN entry.item->>'id' = ${id}
              THEN entry.item || ${JSON.stringify(updates)}::jsonb ELSE entry.item END ORDER BY entry.ordinality)
              FROM jsonb_array_elements(COALESCE(state->${config.collection}, '[]'::jsonb))
              WITH ORDINALITY AS entry(item, ordinality)), true),
            updated_at = now()
          WHERE id = 1 AND EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(state->${config.collection}, '[]'::jsonb)) AS entry(item) WHERE entry.item->>'id' = ${id})
          RETURNING state->${config.collection} AS records
        `;
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Resource not found.' });
    if (isDelete) return res.status(200).json({ success: true });
    const record = (rows[0].records as JsonObject[]).find(item => item.id === id);
    return res.status(200).json({ success: true, [config.itemKey]: record });
  } catch (error) {
    return sendApiError(res, error, `${req.method} /api/${path.join('/')}`);
  }
}
