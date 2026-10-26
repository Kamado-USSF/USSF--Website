import { randomUUID } from 'node:crypto';

export interface PersistentState {
  version: number;
  lastUpdated: string;
  members: Array<{
    [key: string]: unknown;
    id?: string;
    cid?: string;
    accountName?: string;
    name?: string;
    callsign?: string;
    rank?: string;
    rankLevel?: number;
    rankCategory?: string;
    division?: string;
    joinedDate?: string;
    status?: string;
    presenceStatus?: string;
    serviceRibbons?: string[];
    avatarUrl?: string;
    avatarFrame?: string;
    namecard?: string;
    nameStyle?: string;
    bio?: string;
    signature?: string;
    customCursor?: string;
    isMember?: boolean;
    isApplicant?: boolean;
  }>;
  linkRequests: Array<{
    id: string;
    username: string;
    inGameName: string;
    inGameCid: string;
    ingameRank: string;
    f5ScreenshotUrl: string;
    submissionDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    reviewedBy?: string;
    adminNote?: string;
  }>;
  applications: unknown[];
  groupInfo: Record<string, unknown>;
  customAssets: Array<Record<string, unknown> & { id: string }>;
  [key: string]: unknown;
}

export async function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured for this Vercel environment.');
  const { neon } = await import('@neondatabase/serverless');
  return neon(connectionString);
}

export async function readState() {
  const sql = await getSql();
  const rows = await sql`SELECT state FROM ussf_app_state WHERE id = 1`;
  if (!rows[0]?.state) {
    throw new Error('Shared database is not initialized. Run npm run migrate:neon with DATABASE_URL.');
  }
  return rows[0].state as PersistentState;
}

export function sendApiError(
  res: { status: (code: number) => { json: (body: unknown) => unknown }; json: (body: unknown) => unknown },
  error: unknown,
  operation: string,
  requestId: string = randomUUID()
) {
  const message = error instanceof Error ? error.message : 'Unexpected server error.';
  const status = message.includes('DATABASE_URL is not configured') || message.includes('database is not initialized') ? 503 : 500;
  if (status === 500) {
    const errorName = error instanceof Error ? error.name : typeof error;
    const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : undefined;
    console.error('[USSF API]', { operation, requestId, errorName, errorCode });
  }
  return res.status(status).json({
    success: false,
    error: status === 500 ? 'Persistent storage request failed.' : message,
    requestId
  });
}
