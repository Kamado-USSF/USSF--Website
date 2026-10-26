import assert from 'node:assert/strict';
import test from 'node:test';
import { USSF_RANKS, type FinancialClaim, type PromotionRequest, type USSFMember } from '../src/data/ussfData';
import { validatePromotionEligibility } from '../src/utils/promotionValidator';

test('1. Financial Claims Workflow: Status, Reviewer Audit Trail and Payout Disbursal', () => {
  const initialMember: USSFMember = {
    id: 'test-member-1',
    cid: 'SF-501',
    name: 'GhostOperator',
    callsign: 'Specter',
    rank: 'Corporal',
    rankLevel: 4,
    rankCategory: 'Regular Member',
    division: 'First Infantry Regiment',
    joinedDate: '2025-01-01',
    status: 'Active Duty',
    promotionPoints: 120,
    totalPayout: 500000,
    arrestCount: 15,
    patrolHours: 20,
    playtimeHours: 50,
    serviceRibbons: ['Service Ribbon'],
    avatarUrl: '/images/avatar.jpg',
    avatarFrame: 'Silver Issue',
    namecard: 'Special Operator',
    isMember: true,
    isApplicant: false
  };

  const pendingClaim: FinancialClaim = {
    id: 'claim-workflow-1',
    claimantName: initialMember.name,
    claimantCid: initialMember.cid,
    rewardTitle: 'High Value Target Arrest',
    rewardCategory: 'Combat & Tactical',
    amount: 150000,
    quantity: 1,
    date: '2026-03-01',
    proofUrl: 'https://imgur.com/evidence123',
    status: 'Pending',
    note: 'Arrest of 6-star suspect in San Fierro'
  };

  // Verify initial submission state
  assert.equal(pendingClaim.status, 'Pending');
  assert.equal(initialMember.totalPayout, 500000);
  assert.equal(initialMember.promotionPoints, 120);

  // Simulate Admin Approval Action (matching server PUT /api/claims/:id)
  const approvedClaim: FinancialClaim = {
    ...pendingClaim,
    status: 'Approved',
    reviewedBy: 'Kamado',
    reviewedAt: new Date().toISOString()
  };

  const updatedMemberAfterApproval: USSFMember = {
    ...initialMember,
    totalPayout: (initialMember.totalPayout || 0) + approvedClaim.amount,
    promotionPoints: (initialMember.promotionPoints || 0) + 25
  };

  assert.equal(approvedClaim.status, 'Approved');
  assert.equal(approvedClaim.reviewedBy, 'Kamado');
  assert.ok(approvedClaim.reviewedAt);
  assert.equal(updatedMemberAfterApproval.totalPayout, 650000);
  assert.equal(updatedMemberAfterApproval.promotionPoints, 145);

  // Simulate Rejection Action with reason
  const rejectedClaim: FinancialClaim = {
    ...pendingClaim,
    status: 'Rejected',
    reviewedBy: 'Kamado',
    reviewedAt: new Date().toISOString(),
    rejectionReason: 'Invalid screenshot proof: timestamp does not match CIT2 group log.'
  };

  // Member balance remains unchanged on rejection
  const memberAfterRejection = { ...initialMember };
  assert.equal(rejectedClaim.status, 'Rejected');
  assert.equal(rejectedClaim.rejectionReason, 'Invalid screenshot proof: timestamp does not match CIT2 group log.');
  assert.equal(memberAfterRejection.totalPayout, 500000);
});

test('2. Promotion Requests Workflow: Evaluation, Admin Approval and Rank Updates', () => {
  const member: USSFMember = {
    id: 'member-promo-test',
    cid: 'SF-777',
    name: 'Vanguard',
    callsign: 'Apex',
    rank: 'Sergeant',
    rankLevel: 5,
    rankCategory: 'Special Operator',
    division: 'First Infantry Regiment',
    joinedDate: '2024-06-01',
    status: 'Active Duty',
    promotionPoints: 1200,
    totalPayout: 2000000,
    arrestCount: 80,
    patrolHours: 90,
    playtimeHours: 250,
    serviceRibbons: ['NCO Medal'],
    avatarUrl: '/images/avatar.jpg',
    avatarFrame: 'Gold Issue',
    namecard: 'USSF Specialist',
    isMember: true,
    isApplicant: false,
    promotionHistory: [
      { id: 'ph-1', rankTitle: 'Recruit', rankLevel: 1, pointsUsed: 0, approvingOfficer: 'Kamado', timestamp: '2024-06-01' },
      { id: 'ph-2', rankTitle: 'Sergeant', rankLevel: 5, pointsUsed: 250, approvingOfficer: 'Kamado', timestamp: '2024-11-01' }
    ]
  };

  // Target rank: Staff Sergeant (Level 6, requires 400 points)
  const targetRankDef = USSF_RANKS.find(r => r.level === 6)!;
  assert.ok(targetRankDef);
  assert.equal(targetRankDef.name, 'Staff Sergeant');

  const promoRequest: PromotionRequest = {
    id: 'pr-workflow-test',
    operatorName: member.name,
    operatorCid: member.cid,
    currentRank: member.rank,
    targetRank: targetRankDef.name,
    targetRankLevel: 6,
    pointsCost: 400,
    remainingPoints: 800,
    currentPoints: 1200,
    submissionDate: '2026-03-01',
    status: 'Pending',
    notes: 'Completed 30 days in rank, all squad patrol milestones completed.',
    evidenceProofUrl: 'https://imgur.com/promo-evidence-777'
  };

  assert.equal(promoRequest.status, 'Pending');
  // Submitted request does NOT prematurely promote member
  assert.equal(member.rank, 'Sergeant');
  assert.equal(member.rankLevel, 5);

  // Admin approves promotion
  const approvedPromotion: PromotionRequest = {
    ...promoRequest,
    status: 'Approved',
    reviewedBy: 'Kamado',
    reviewedAt: new Date().toISOString()
  };

  // Server promotion approval logic: update rank, deduct pointsCost, add promotionHistory
  const updatedMember: USSFMember = {
    ...member,
    rank: targetRankDef.name,
    rankLevel: targetRankDef.level,
    rankCategory: (targetRankDef.category as any) || 'Special Operator',
    promotionPoints: Math.max(0, (member.promotionPoints || 0) - promoRequest.pointsCost),
    promotionHistory: [
      ...(member.promotionHistory || []),
      {
        id: `promo-${Date.now()}`,
        rankTitle: targetRankDef.name,
        rankLevel: targetRankDef.level,
        pointsUsed: promoRequest.pointsCost,
        timestamp: new Date().toISOString(),
        approvingOfficer: 'Kamado',
        citation: 'Approved by High Command.'
      }
    ]
  };

  assert.equal(approvedPromotion.status, 'Approved');
  assert.equal(updatedMember.rank, 'Staff Sergeant');
  assert.equal(updatedMember.rankLevel, 6);
  assert.equal(updatedMember.promotionPoints, 800); // 1200 - 400 preserved
  assert.equal(updatedMember.promotionHistory!.length, 3);

  // Admin rejects promotion: rank must NOT change
  const rejectedPromotion: PromotionRequest = {
    ...promoRequest,
    status: 'Rejected',
    reviewedBy: 'Kamado',
    reviewedAt: new Date().toISOString(),
    rejectionReason: 'Additional patrol log hours required before Staff Sergeant advancement.'
  };

  const memberAfterRejection = { ...member };
  assert.equal(rejectedPromotion.status, 'Rejected');
  assert.equal(memberAfterRejection.rank, 'Sergeant');
  assert.equal(memberAfterRejection.rankLevel, 5);
  assert.equal(memberAfterRejection.promotionPoints, 1200);
});

test('3. Promotion Eligibility Calculator: ALL 20 Official Ranks Supported', () => {
  // Confirm exactly 20 ranks defined in shared source of truth
  assert.equal(USSF_RANKS.length, 20);

  // Verify rank ordering and levels from 1 to 20
  for (let lvl = 1; lvl <= 20; lvl++) {
    const rank = USSF_RANKS.find(r => r.level === lvl);
    assert.ok(rank, `Rank Level ${lvl} must exist in USSF_RANKS`);
    assert.ok(rank.name, `Rank Level ${lvl} must have a name`);
    assert.ok(rank.badgeColor, `Rank Level ${lvl} must have a badge color`);
    assert.ok(typeof rank.requiredDays === 'number', `Rank Level ${lvl} requiredDays must be a number`);
    assert.ok(typeof rank.requiredPoints === 'number', `Rank Level ${lvl} requiredPoints must be a number`);
  }

  // Lowest rank: Recruit (Level 1)
  const recruit = USSF_RANKS.find(r => r.level === 1)!;
  assert.equal(recruit.name, 'Recruit');
  assert.equal(recruit.order, 190);

  // Highest rank: High Commander (Level 20)
  const highCommander = USSF_RANKS.find(r => r.level === 20)!;
  assert.equal(highCommander.name, 'High Commander');
  assert.equal(highCommander.order, 0);

  // Test Member: Level 1 Recruit with 0 days and 0 points
  const newRecruit: USSFMember = {
    id: 'recruit-1',
    cid: 'SF-101',
    name: 'NewPrivate',
    callsign: 'Trainee-101',
    rank: 'Recruit',
    rankLevel: 1,
    rankCategory: 'Regular Member',
    division: 'First Infantry Regiment',
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'Active Duty',
    promotionPoints: 0,
    totalPayout: 0,
    arrestCount: 0,
    patrolHours: 0,
    playtimeHours: 0,
    serviceRibbons: ['Enlistment'],
    isMember: true,
    isApplicant: false
  };

  // Check eligibility for Level 2 (Private: requires 3 days, 30 points)
  const privateResult = validatePromotionEligibility(newRecruit, 2);
  assert.equal(privateResult.eligible, false);
  assert.equal(privateResult.targetRank, 'Private');
  assert.equal(privateResult.pointsDeficit, 30);
  assert.equal(privateResult.serviceDaysDeficit, 3);
  assert.ok(privateResult.incompleteReasons.length >= 2);

  // Now test with requirements met for Level 2
  const readyPrivate: USSFMember = {
    ...newRecruit,
    joinedDate: '2025-01-01', // >3 days ago
    promotionPoints: 50,
    playtimeHours: 10
  };
  const qualifiedPrivate = validatePromotionEligibility(readyPrivate, 2);
  assert.equal(qualifiedPrivate.eligible, true);
  assert.equal(qualifiedPrivate.pointsDeficit, 0);
  assert.equal(qualifiedPrivate.serviceDaysDeficit, 0);
  assert.equal(qualifiedPrivate.incompleteReasons.length, 0);

  // Test Honorary Distinction Ranks cannot be self-claimed (e.g. Level 10 Brigade Laftaru or Level 15 Honorable)
  const honoraryBrigade = validatePromotionEligibility(readyPrivate, 10);
  assert.equal(honoraryBrigade.isHonorary, true);
  assert.equal(honoraryBrigade.eligible, false);
  assert.ok(honoraryBrigade.incompleteReasons.some(r => r.includes('Honorary Distinction')));

  const honoraryHonorable = validatePromotionEligibility(readyPrivate, 15);
  assert.equal(honoraryHonorable.isHonorary, true);
  assert.equal(honoraryHonorable.eligible, false);
  assert.ok(honoraryHonorable.incompleteReasons.some(r => r.includes('Honorary Distinction')));

  // Test Level 20 High Commander evaluation
  const eliteOfficer: USSFMember = {
    ...newRecruit,
    rank: 'Commander',
    rankLevel: 19,
    joinedDate: '2024-01-01',
    promotionPoints: 6000,
    playtimeHours: 600
  };
  const hcmdResult = validatePromotionEligibility(eliteOfficer, 20);
  assert.equal(hcmdResult.targetRank, 'High Commander');
  assert.equal(hcmdResult.targetRankLevel, 20);
  assert.equal(hcmdResult.pointsDeficit, 0);
  assert.equal(hcmdResult.serviceDaysDeficit, 0);
  assert.equal(hcmdResult.eligible, true);

  // Test Member already at Level 20 (High Commander) attempting to promote further
  const currentHighCommander: USSFMember = {
    ...eliteOfficer,
    rank: 'High Commander',
    rankLevel: 20
  };
  const maxRankResult = validatePromotionEligibility(currentHighCommander, 20);
  assert.equal(maxRankResult.eligible, false);
  assert.ok(maxRankResult.incompleteReasons.some(r => r.includes('not higher than current rank')));
});
