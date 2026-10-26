import React, { useState, useEffect } from 'react';
import { X, Send, DollarSign, AlertCircle, Shield, Sparkles, Hash } from 'lucide-react';
import { FinancialClaim, RewardItem, USSFMember } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';

interface USSFClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (claim: FinancialClaim) => void;
  rewardCatalog: RewardItem[];
  preselectedReward?: RewardItem | null;
  preselectedQuantity?: number;
  activeMultiplier?: number;
  currentUser?: USSFMember | null;
  batchItems?: Array<{ reward: RewardItem; quantity: number }>;
  totalBatchAmount?: number;
}

export const USSFClaimModal: React.FC<USSFClaimModalProps> = ({
  isOpen,
  onClose,
  onSubmitClaim,
  rewardCatalog,
  preselectedReward,
  preselectedQuantity = 1,
  activeMultiplier = 1,
  currentUser,
  batchItems = [],
  totalBatchAmount
}) => {
  const [selectedRewardId, setSelectedRewardId] = useState<string>(
    preselectedReward?.id || rewardCatalog[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(preselectedQuantity || 1);
  const [claimantName, setClaimantName] = useState(currentUser?.name || '');
  const [claimantCid, setClaimantCid] = useState(currentUser?.cid || '');
  const [proofUrl, setProofUrl] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setClaimantName(currentUser.name);
      setClaimantCid(currentUser.cid);
    }
  }, [currentUser]);

  useEffect(() => {
    if (preselectedReward) {
      setSelectedRewardId(preselectedReward.id);
    }
    if (preselectedQuantity) {
      setQuantity(preselectedQuantity);
    }
  }, [preselectedReward, preselectedQuantity]);

  if (!isOpen) return null;

  const isBatch = Boolean(batchItems && batchItems.length > 1);
  const currentReward = rewardCatalog.find(r => r.id === selectedRewardId) || rewardCatalog[0];
  const isCombatTask = currentReward?.category === 'Combat & Tactical' || currentReward?.allowQuantity;
  const currentQty = isCombatTask ? Math.max(1, quantity) : 1;
  const multiplier = activeMultiplier > 1 ? activeMultiplier : 1;
  const totalAmount = isBatch
    ? (totalBatchAmount || batchItems.reduce((sum, b) => sum + (b.reward.payoutAmount * b.quantity * multiplier), 0))
    : (currentReward?.payoutAmount || 0) * currentQty * multiplier;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.isApplicant || currentUser.isMember === false) {
      setErrorMsg('Unauthorized: Only verified active USSF members may submit financial claims. Non-members and applicants must link their account via the Enlistment Center.');
      tacticalAudio.playAlertWarning();
      return;
    }
    if (!proofUrl) {
      setErrorMsg('Please supply a verified proof link or screenshot.');
      return;
    }

    const newClaim: FinancialClaim = {
      id: `clm-${Date.now()}`,
      rewardTitle: isBatch
        ? `Multi-Claim (${batchItems.length} Tasks): ${batchItems.map(b => `${b.reward.title}${b.quantity > 1 ? ` x${b.quantity}` : ''}`).join(', ')}`
        : isCombatTask && currentQty > 1 ? `${currentReward.title} (x${currentQty})` : currentReward.title,
      rewardCategory: isBatch ? 'Multi-Task Claim' : currentReward.category,
      amount: totalAmount,
      quantity: isBatch ? batchItems.reduce((acc, b) => acc + b.quantity, 0) : isCombatTask ? currentQty : 1,
      claimantName,
      claimantCid,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      proofUrl,
      note: note ? `${note} ${multiplier > 1 ? `[${multiplier}X Event Applied]` : ''}` : (multiplier > 1 ? `[${multiplier}X Event Applied]` : (isBatch ? `Multi-Task Batch (${batchItems.length} tasks)` : 'Awaiting Command Review'))
    };

    tacticalAudio.playTargetLock();
    tacticalAudio.playRadioSquelch();
    onSubmitClaim(newClaim);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-tactical uppercase text-neutral-100">
              BUILD FINANCIAL DISBURSEMENT REQUEST
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-data">
          {errorMsg && (
            <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {multiplier > 1 && (
            <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/60 text-amber-300 text-xs font-data flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>{multiplier}X EVENT MULTIPLIER ACTIVE:</strong> Reward payout will be multiplied by {multiplier}X automatically!
              </span>
            </div>
          )}

          {isBatch ? (
            <div className="p-3 rounded-lg bg-neutral-950 border border-emerald-500/40 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-400 border-b border-neutral-800 pb-2">
                <span>BATCH MULTI-TASK CLAIM ({batchItems.length} TASKS SELECTED)</span>
                <span className="font-mono text-sm">${totalAmount.toLocaleString()}</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-neutral-800/60 pr-1">
                {batchItems.map((b, idx) => (
                  <div key={idx} className="pt-1.5 flex items-center justify-between text-[11px] text-neutral-300">
                    <span className="truncate max-w-[280px]">
                      {b.reward.title} {b.quantity > 1 ? `(x${b.quantity})` : ''}
                    </span>
                    <span className="font-mono text-emerald-400 shrink-0 font-bold">
                      ${(b.reward.payoutAmount * b.quantity * multiplier).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-neutral-400 mb-1 uppercase font-bold">
                  SELECT OBJECTIVE REWARD
                </label>
                <select
                  value={selectedRewardId}
                  onChange={(e) => setSelectedRewardId(e.target.value)}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
                >
                  {rewardCatalog.map((r) => (
                    <option key={r.id} value={r.id}>
                      ${r.payoutAmount.toLocaleString()} · {r.title} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Numeric Quantity Input for Combat & Tactical Tasks */}
              {isCombatTask && (
                <div className="p-3 rounded-lg bg-neutral-950 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-amber-400 uppercase font-bold flex items-center gap-1.5 text-[11px]">
                      <Hash className="h-3.5 w-3.5" />
                      <span>NUMBER OF KILLS / ARRESTS / BLIPS (QUANTITY):</span>
                    </label>
                    <span className="text-[10px] text-neutral-400">Multiplier Enabled</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-28 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100 font-bold text-center focus:border-amber-400 focus:outline-none text-base tabular-nums"
                    />
                    <span className="text-neutral-400 text-xs">
                      ${currentReward.payoutAmount.toLocaleString()} × {currentQty} count
                      {multiplier > 1 ? ` × ${multiplier}X event` : ''}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Total Claim Amount Display with breakdown */}
          <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-neutral-400 uppercase text-[10px] block">TOTAL CLAIM AMOUNT:</span>
              <span className="text-[11px] text-neutral-500">
                {currentQty > 1 ? `${currentQty}x Units ` : ''}
                {multiplier > 1 ? `· ${multiplier}X Boosted` : ''}
              </span>
            </div>
            <span className="text-2xl font-black text-emerald-400 tabular-nums">
              ${totalAmount.toLocaleString()}
            </span>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 uppercase font-bold">
              CLAIMANT OPERATOR NAME
            </label>
            <input
              type="text"
              value={claimantName}
              onChange={(e) => setClaimantName(e.target.value)}
              placeholder="e.g. Ghost or SF-Operator"
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 uppercase font-bold">
              PROOF LINK (MANDATORY) *
            </label>
            <input
              type="text"
              required
              placeholder="https://imgur.com/... or unedited screenshot with phone clock"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Required: F5 scores, group kills or unedited phone clock (B+Clock).
            </span>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 uppercase font-bold">
              OPERATIONAL NOTE
            </label>
            <input
              type="text"
              placeholder="e.g. APB convoy intercept in LV, 4 kills at AR"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg"
            >
              <Send className="h-3.5 w-3.5" />
              <span>TRANSMIT CLAIM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
