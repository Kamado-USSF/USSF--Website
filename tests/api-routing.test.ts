import assert from 'node:assert/strict';
import test from 'node:test';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import healthHandler from '../api/health';
import linkRequestsHandler from '../api/link-requests';
import fallbackHandler from '../api/[...path]';

function createResponse() {
  const state: { status?: number; headers: Record<string, string>; body?: unknown } = { headers: {} };
  const response = {
    status(status: number) {
      state.status = status;
      return this;
    },
    setHeader(name: string, value: string) {
      state.headers[name] = value;
      return this;
    },
    json(body: unknown) {
      state.body = body;
      return this;
    }
  } as unknown as VercelResponse;
  return { state, response };
}

test('health route returns a structured success response', () => {
  const responseState: { status?: number; headers: Record<string, string>; body?: unknown } = { headers: {} };
  const response = {
    status(status: number) {
      responseState.status = status;
      return this;
    },
    setHeader(name: string, value: string) {
      responseState.headers[name] = value;
      return this;
    },
    json(body: unknown) {
      responseState.body = body;
      return this;
    }
  } as unknown as VercelResponse;
  healthHandler({ method: 'GET' } as VercelRequest, response);
  assert.equal(responseState.status, 200);
  assert.deepEqual(responseState.body, { success: true, service: 'ussf-api' });
});

test('unimplemented API routes fail explicitly with JSON 501', () => {
  const responseState: { status?: number; headers: Record<string, string>; body?: unknown } = { headers: {} };
  const response = {
    status(status: number) {
      responseState.status = status;
      return this;
    },
    setHeader(name: string, value: string) {
      responseState.headers[name] = value;
      return this;
    },
    json(body: unknown) {
      responseState.body = body;
      return this;
    }
  } as unknown as VercelResponse;
  fallbackHandler({ method: 'POST', query: { path: ['claims'] } } as unknown as VercelRequest, response);
  assert.equal(responseState.status, 501);
  assert.match((responseState.body as { error: string }).error, /POST \/api\/claims/);
});

test('account-link endpoint enforces POST and validates the actual payload', async () => {
  const methodResult = createResponse();
  await linkRequestsHandler({ method: 'GET', headers: {} } as VercelRequest, methodResult.response);
  assert.equal(methodResult.state.status, 405);
  assert.deepEqual(methodResult.state.body, { success: false, error: 'Method not allowed.' });

  const invalidResult = createResponse();
  await linkRequestsHandler({ method: 'POST', headers: {}, body: {} } as VercelRequest, invalidResult.response);
  assert.equal(invalidResult.state.status, 400);
  assert.match((invalidResult.state.body as { error: string }).error, /required/);
});

test('valid account-link submission reports missing shared database configuration honestly', async () => {
  const previousUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const result = createResponse();
    await linkRequestsHandler({
      method: 'POST',
      headers: { 'x-vercel-id': 'test-request-id' },
      body: {
        username: 'website-user',
        inGameName: 'Operator_One',
        inGameCid: 'SF-222',
        ingameRank: 'Private',
        f5ScreenshotUrl: 'https://proof.example/image.png'
      }
    } as unknown as VercelRequest, result.response);
    assert.equal(result.state.status, 503);
    assert.deepEqual(result.state.body, {
      success: false,
      error: 'DATABASE_URL is not configured for this Vercel environment.',
      requestId: 'test-request-id'
    });
  } finally {
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  }
});
