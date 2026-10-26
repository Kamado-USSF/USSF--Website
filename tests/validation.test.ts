import assert from 'node:assert/strict';
import test from 'node:test';
import type { AccountLinkRequest } from '../src/data/ussfData';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminToken } from '../lib/auth';
import { getSql, type PersistentState } from '../lib/db';
import { toPublicState } from '../lib/public-state';
import { parseApiResponse } from '../src/services/api';
import { findLinkRequestConflict, validateApplication, validateAsset, validateGroupInfo, validateLinkRequest } from '../lib/validation';

const validLinkRequest = {
  username: 'website-user',
  inGameName: 'Operator_One',
  inGameCid: 'SF-222',
  ingameRank: 'Private',
  f5ScreenshotUrl: 'https://proof.example/image.png'
};

test('link request validates required data and HTTP proof URLs', () => {
  assert.equal(validateLinkRequest(validLinkRequest).ok, true);
  assert.equal(validateLinkRequest({ ...validLinkRequest, f5ScreenshotUrl: 'javascript:alert(1)' }).ok, false);
  assert.equal(validateLinkRequest({ ...validLinkRequest, username: '' }).ok, false);
});

test('pending link request is idempotent only for the same account and CID', () => {
  const existing = { ...validLinkRequest, id: 'link-1', submissionDate: '2026-01-01', status: 'Pending' } as AccountLinkRequest;
  const state = { linkRequests: [existing], members: [] };
  assert.equal(findLinkRequestConflict(state, 'WEBSITE-USER', 'sf-222')?.existing?.id, 'link-1');
  assert.match(findLinkRequestConflict(state, 'other-user', 'SF-222')?.error || '', /pending request/i);
  assert.match(findLinkRequestConflict(state, 'website-user', 'SF-333')?.error || '', /already has a pending/i);
});

test('roster CID and account collisions require administrative recovery', () => {
  const state = { linkRequests: [], members: [{ cid: 'SF-222' }, { cid: 'SF-333', accountName: 'other-user' }] };
  assert.match(findLinkRequestConflict(state, 'website-user', 'sf-222')?.error || '', /administrative recovery/i);
  assert.match(findLinkRequestConflict(state, 'other-user', 'SF-444')?.error || '', /already associated/i);
});

test('application and asset validation reject invalid payloads', () => {
  assert.equal(validateApplication({ applicantName: 'Applicant', age: 18, playtimeHours: 300, rulesAccepted: true }).ok, true);
  assert.equal(validateApplication({ applicantName: 'Applicant', age: 12, playtimeHours: 300, rulesAccepted: true }).ok, false);
  assert.equal(validateAsset({
    id: 'asset-1', type: 'SKIN', title: 'Field Uniform', codeOrId: '39', variantCount: 2,
    imageUrl: 'https://images.example/field.png', description: 'Field uniform', category: 'Infantry'
  }).ok, true);
  assert.equal(validateAsset({
    id: 'asset-1', type: 'SKIN', title: 'Field Uniform', codeOrId: '39', variantCount: 2,
    imageUrl: 'http://images.example/field.png', description: 'Field uniform', category: 'Infantry'
  }).ok, false);
});

test('group specification validation only accepts known fields and correctly typed arrays', () => {
  assert.deepEqual(validateGroupInfo({ founder: 'Verified Founder', skinsAvailable: [' 39 ', ''] }), {
    ok: true,
    value: { founder: 'Verified Founder', skinsAvailable: ['39'] }
  });
  assert.equal(validateGroupInfo({ unknownField: 'ignored' }).ok, false);
  assert.equal(validateGroupInfo({ skinsAvailable: '39, 164' }).ok, false);
});

test('admin token check fails closed for missing and invalid credentials', () => {
  const previousToken = process.env.USSF_ADMIN_API_TOKEN;
  const responseState: { status?: number; body?: unknown } = {};
  const response = {
    status(status: number) {
      responseState.status = status;
      return this;
    },
    json(body: unknown) {
      responseState.body = body;
      return this;
    }
  } as unknown as VercelResponse;
  const request = (authorization?: string) => ({ headers: { authorization } }) as unknown as VercelRequest;
  try {
    delete process.env.USSF_ADMIN_API_TOKEN;
    assert.equal(requireAdminToken(request(), response), false);
    assert.equal(responseState.status, 503);

    process.env.USSF_ADMIN_API_TOKEN = 'A'.repeat(32);
    assert.equal(requireAdminToken(request('Bearer incorrect-token'), response), false);
    assert.equal(responseState.status, 401);

    assert.equal(requireAdminToken(request(`Bearer ${'A'.repeat(32)}`), response), true);
  } finally {
    if (previousToken === undefined) delete process.env.USSF_ADMIN_API_TOKEN;
    else process.env.USSF_ADMIN_API_TOKEN = previousToken;
  }
});

test('missing database configuration fails before loading the Neon driver', async () => {
  const previousUrl = process.env.DATABASE_URL;
  try {
    delete process.env.DATABASE_URL;
    await assert.rejects(getSql(), /DATABASE_URL is not configured/);
  } finally {
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  }
});

test('API parser reports plain-text and HTML failures without JSON syntax errors', async () => {
  const textFailure = new Response('A server error has occurred\nFUNCTION_INVOCATION_FAILED\nrequest-id', {
    status: 500,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
  await assert.rejects(
    parseApiResponse(textFailure, 'Submit application'),
    /HTTP 500 \(text\/plain; charset=utf-8\).*FUNCTION_INVOCATION_FAILED/
  );

  const htmlFailure = new Response('<html>Not found</html>', {
    status: 404,
    headers: { 'Content-Type': 'text/html' }
  });
  await assert.rejects(parseApiResponse(htmlFailure, 'Update group info'), /HTTP 404 \(text\/html\)/);
});

test('API parser preserves structured authorization errors', async () => {
  const unauthorized = new Response(JSON.stringify({ success: false, error: 'Administrator token invalid.' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
  await assert.rejects(parseApiResponse(unauthorized, 'Save asset'), /Administrator token invalid/);
});

test('public state excludes private queues and member financial/account data', () => {
  const state = {
    version: 1,
    lastUpdated: '2026-10-25T00:00:00.000Z',
    members: [{
      id: 'member-1', cid: 'SF-100', name: 'Operator', rank: 'Recruit', rankLevel: 1,
      totalPayout: 9000000, promotionPoints: 700, accountName: 'private-account'
    }],
    claims: [{ id: 'claim-1', amount: 1000 }],
    linkRequests: [{ id: 'link-1', username: 'private-user' }],
    applications: [{ id: 'app-1', applicantName: 'Private Applicant' }],
    groupInfo: { name: 'USSF' },
    customAssets: []
  } as unknown as PersistentState;
  const result = toPublicState(state) as Record<string, unknown>;
  assert.equal('claims' in result, false);
  assert.equal('linkRequests' in result, false);
  assert.equal('applications' in result, false);
  const [member] = result.members as Array<Record<string, unknown>>;
  assert.equal(member.name, 'Operator');
  assert.equal('totalPayout' in member, false);
  assert.equal('promotionPoints' in member, false);
  assert.equal('accountName' in member, false);
});
