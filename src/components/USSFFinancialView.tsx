import React, { useState, useEffect } from 'react';
import { 
  DollarSign, CheckCircle2, AlertCircle, PlusCircle, 
  ArrowRight, Shield, FileText, Target, 
  Lock, ShieldCheck, Sparkles, Gift, Hash, X
} from 'lucide-react';
import { 
  FinancialClaim, RewardItem, REALISTIC_REWARD_CATALOG, PendingLoginRewardClaim, 
  DAILY_LOGIN_REWARDS_7, DAILY_LOGIN_REWARDS_30, AdminEvent, USSFMember,
  MilestoneRewardChoice, DEFAULT_MILESTONE_CHOICES 
} from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';
import { BiometricModal } from './BiometricModal';

interface USSFFinancialViewProps {
  claims: FinancialClaim[];
  rewardCatalog: RewardItem[];
  events?: AdminEvent[];
  onOpenClaimModal: (
    preselectedReward?: RewardItem,
    quantity?: number,
    totalAmount?: number,
    batchItems?: Array<{ reward: RewardItem; quantity: number }>,
    totalBatchAmount?: number
  ) => void;
  onClaimDailyLoginReward?: (claim: PendingLoginRewardClaim) => void;
  currentUser?: USSFMember | null;
  onUpdateProfile?: (updated: Partial<USSFMember>) => void;
  milestoneChoices?: MilestoneRewardChoice[];
}

export const USSFFinancialView: React.FC<USSFFinancialViewProps> = ({
  claims,
  rewardCatalog,
  events = [],
  onOpenClaimModal,
  onClaimDailyLoginReward,
  currentUser,
  onUpdateProfile,
  milestoneChoices = DEFAULT_MILESTONE_CHOICES
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'dailyLogin' | 'claims'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [taskQuantities, setTaskQuantities] = useState<Record<string, number>>({});
  const [loginMode, setLoginMode] = useState<'7days' | '30days'>('7days');
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [biometricAction, setBiometricAction] = useState<string>('');
  const [dailyClaimSuccess, setDailyClaimSuccess] = useState<string | null>(null);

  // Today's date and per-user streak storage key
  const todayStr = new Date().toISOString().split('T')[0];
  const userKey = currentUser?.cid || currentUser?.name || 'visitor';
  const streakStorageKey = `ussf_user_streak_${userKey}`;

  interface StreakState {
    streak7: number;
    lastClaim7Date: string;
    streak30: number;
    lastClaim30Date: string;
  }

  const [streakData, setStreakData] = useState<StreakState>(() => {
    try {
      const saved = localStorage.getItem(streakStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      streak7: 1,
      lastClaim7Date: '',
      streak30: 1,
      lastClaim30Date: ''
    };
  });

  const saveStreak = (next: StreakState) => {
    setStreakData(next);
    try {
      localStorage.setItem(streakStorageKey, JSON.stringify(next));
    } catch {}
  };

  const is7ClaimedToday = streakData.lastClaim7Date === todayStr;
  const is30ClaimedToday = streakData.lastClaim30Date === todayStr;

  // Today's Financial Points Claimed (Daily cap: 50 pts)
  const storageKey = `ussf_daily_fin_pts_${todayStr}_${currentUser?.cid || 'SF-001'}`;
  const [claimedTodayPts, setClaimedTodayPts] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(storageKey) || 0);
    } catch {
      return 0;
    }
  });

  // Active Multiplier Event Calculation (X2, X3, X4 Financial)
  const activeFinancialEvent = events.find(e => 
    e.isActive && (
      e.multiplierType === '2X Financial Payouts' || 
      e.multiplierType === '3X Financial Payouts' || 
      e.multiplierType === '4X Financial Payouts' ||
      (e.multiplierType && typeof e.multiplierType === 'string' && e.multiplierType.toLowerCase().includes('financial')) ||
      (e.title && typeof e.title === 'string' && e.title.toLowerCase().includes('financial')) ||
      (e.multiplier && e.multiplier > 1 && !e.multiplierType?.toLowerCase().includes('promotion'))
    )
  );

  const financialMultiplier = activeFinancialEvent
    ? (activeFinancialEvent.multiplier || (activeFinancialEvent.multiplierType?.includes('4X') ? 4 : activeFinancialEvent.multiplierType?.includes('3X') ? 3 : 2))
    : 1;

  // Use the realistic catalog
  const catalog = REALISTIC_REWARD_CATALOG;

  const categories = [
    { id: 'ALL', label: 'All Tasks (30+)', count: catalog.length },
    { id: 'Arrest Points', label: '01 Arrest Points (Daily)', count: catalog.filter(r => r.category === 'Arrest Points').length },
    { id: 'Patrol & Training', label: '02 Patrol & Training (Weekly)', count: catalog.filter(r => r.category === 'Patrol & Training').length },
    { id: 'Combat & Tactical', label: '03 Combat & Tactical (Numeric Multiplier)', count: catalog.filter(r => r.category === 'Combat & Tactical').length },
    { id: 'Daily & Specialist Tasks', label: '04 Daily & Specialist', count: catalog.filter(r => r.category === 'Daily & Specialist Tasks').length },
    { id: 'Promotions & Achievements', label: '05 Promotions & Achievements', count: catalog.filter(r => r.category === 'Promotions & Achievements').length }
  ];

  const filteredCatalog = selectedCategory === 'ALL'
    ? catalog
    : catalog.filter(r => r.category === selectedCategory);

  const toggleTaskSelection = (id: string) => {
    tacticalAudio.playTacticalClick();
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter(t => t !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const setQuantityForTask = (id: string, q: number) => {
    const validQ = Math.max(1, Math.min(100, q));
    setTaskQuantities({ ...taskQuantities, [id]: validQ });
  };

  const totalMultiClaim = selectedTaskIds.reduce((sum, id) => {
    const item = catalog.find(r => r.id === id);
    if (!item) return sum;
    const qty = taskQuantities[id] || 1;
    return sum + (item.payoutAmount * qty * financialMultiplier);
  }, 0);

  const totalApprovedPayout = claims
    .filter(c => c.status === 'Approved')
    .reduce((sum, c) => sum + c.amount, 0);

  const handleOpenMultiClaim = () => {
    if (selectedTaskIds.length === 0) return;
    if (!currentUser || !currentUser.isMember || currentUser.isApplicant) {
      alert('Action Restricted: Only verified active USSF members can submit financial claims.');
      return;
    }
    tacticalAudio.playTargetLock();
    const batchItems = selectedTaskIds.map(id => {
      const reward = catalog.find(r => r.id === id);
      const quantity = taskQuantities[id] || 1;
      return reward ? { reward, quantity } : null;
    }).filter((b): b is { reward: RewardItem; quantity: number } => b !== null);

    if (batchItems.length === 0) return;
    onOpenClaimModal(batchItems[0].reward, batchItems[0].quantity, totalMultiClaim, batchItems, totalMultiClaim);
  };

  const handleClaimLoginReward = (day: number, cash: number, pts: number, mode: '7days' | '30days') => {
    if (!currentUser || !currentUser.isMember || currentUser.isApplicant) {
      alert('Action Restricted: Only verified active USSF members can claim daily login milestones.');
      return;
    }

    if (mode === '7days') {
      if (is7ClaimedToday) {
        alert('You have already claimed your login reward for today. Next day unlocks tomorrow after 24 hours!');
        return;
      }
      if (day !== streakData.streak7) {
        alert(`You can only claim Day 0${streakData.streak7} today.`);
        return;
      }
    } else {
      if (is30ClaimedToday) {
        alert('You have already claimed your monthly login reward for today. Next day unlocks tomorrow after 24 hours!');
        return;
      }
      if (day !== streakData.streak30) {
        alert(`You can only claim Day ${streakData.streak30} today.`);
        return;
      }
    }

    tacticalAudio.playTargetLock();

    let milestoneBonusNote = '';
    // Day 7 milestone: Admin designates reward (Default: Angel Crystal Avatar Frame)
    if (mode === '7days' && day === 7) {
      const day7Reward = milestoneChoices.find(c => c.milestoneDay === 7);
      const frameName = day7Reward?.type === 'AVATAR_FRAME' ? day7Reward.rewardValue : 'Angel Crystal';
      if (onUpdateProfile) {
        onUpdateProfile({ avatarFrame: frameName });
      }
      milestoneBonusNote = ` + Equipped "${frameName}" Custom Avatar Frame!`;
    } else if (mode === '30days' && day === 30) {
      // Day 30 milestone: Admin designates reward (Default: Supreme Gold Aureole)
      const day30Reward = milestoneChoices.find(c => c.milestoneDay === 30);
      const frameName = day30Reward?.type === 'AVATAR_FRAME' ? day30Reward.rewardValue : 'Supreme Gold Aureole';
      if (onUpdateProfile) {
        onUpdateProfile({ avatarFrame: frameName });
      }
      milestoneBonusNote = ` + Equipped "${frameName}" Custom Avatar Frame!`;
    }

    const claim: PendingLoginRewardClaim = {
      id: `plc-${Date.now()}`,
      operatorName: currentUser.name,
      operatorCid: currentUser.cid || 'SF-REC',
      day,
      cashAmount: cash,
      promotionPoints: pts,
      claimedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Pending Payout'
    };

    if (onClaimDailyLoginReward) {
      onClaimDailyLoginReward(claim);
    }

    // Advance streak and record today's claim date
    if (mode === '7days') {
      const nextStreak = streakData.streak7 >= 7 ? 1 : streakData.streak7 + 1;
      saveStreak({
        ...streakData,
        streak7: nextStreak,
        lastClaim7Date: todayStr
      });
    } else {
      const nextStreak = streakData.streak30 >= 30 ? 1 : streakData.streak30 + 1;
      saveStreak({
        ...streakData,
        streak30: nextStreak,
        lastClaim30Date: todayStr
      });
    }

    setDailyClaimSuccess(`Day ${day < 10 ? '0' + day : day} Login Reward ($${cash.toLocaleString()} Cash + ${pts} Promotion Points) successfully claimed! Transmitted to High Command Admin Queue for cash disbursement approval${milestoneBonusNote}`);
    setTimeout(() => setDailyClaimSuccess(null), 7000);
  };

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-16 font-sans">
      {/* High-Impact Hero Banner */}
      <div className="relative w-full overflow-hidden border-b border-neutral-800 bg-[#0c100d] min-h-[360px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/rewards_night_tasks_1790347392900.jpg"
            alt="Tactical Treasury & Task Operations"
            className="h-full w-full object-cover object-center filter brightness-95 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a08] via-[#080a08]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a08] via-[#080a08]/75 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-data uppercase tracking-widest text-emerald-400">
                <span className="flex items-center gap-1.5 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SPECIAL FORCES
                </span>
                <span className="text-neutral-500">/</span>
                <span className="text-amber-400 font-semibold">FINANCIAL TASK TREASURY</span>
                <span className="text-neutral-500">/</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>E2EE ACTIVE</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-tactical uppercase tracking-tight text-white drop-shadow-lg">
                FINANCIAL TASKS & OPERATOR BOUNTIES
              </h1>

              <p className="text-xs sm:text-sm font-sans text-neutral-200 max-w-2xl drop-shadow">
                Official compensation payouts for criminal arrest milestones, weekly patrols, combat APB raids, specialist tasks, and rank promotions. Combat & Tactical tasks feature numeric quantity inputs to multiply your payout!
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="rounded-xl border border-emerald-500/50 bg-black/80 p-4 text-right backdrop-blur-md shadow-2xl">
                <span className="text-[10px] font-data text-emerald-400 uppercase tracking-widest block font-bold">
                  TOTAL DISBURSED
                </span>
                <div className="text-2xl sm:text-3xl font-black font-tactical text-emerald-400">
                  ${(totalApprovedPayout / 1000000).toFixed(1)}M
                </div>
                <span className="text-[10px] font-data text-neutral-400 block mt-0.5">
                  100% Verified CIT2 Law Treasury
                </span>
              </div>

              <div className="rounded-xl border border-amber-500/50 bg-black/80 p-4 text-right backdrop-blur-md shadow-2xl">
                <span className="text-[10px] font-data text-amber-400 uppercase tracking-widest block font-bold">
                  DAILY REWARDS
                </span>
                <div className="text-2xl sm:text-3xl font-black font-tactical text-amber-400">
                  UP TO $50M
                </div>
                <span className="text-[10px] font-data text-neutral-400 block mt-0.5">
                  Arrest Points & Combat Bounties
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Active Multiplier Event Notification Banner */}
        {financialMultiplier > 1 && activeFinancialEvent && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/80 bg-gradient-to-r from-amber-950/80 via-neutral-900 to-black text-amber-300 font-data text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-500 text-neutral-950 font-black text-sm">
                {financialMultiplier}X
              </div>
              <div>
                <span className="font-bold text-white uppercase text-sm block">
                  {activeFinancialEvent.title}
                </span>
                <span className="text-amber-200/90 text-xs">
                  {activeFinancialEvent.announcement || `All task payouts are automatically multiplied by ${financialMultiplier}X!`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 uppercase block font-mono">MULTIPLIER ACTIVE</span>
              <span className="text-emerald-400 font-bold">{financialMultiplier}X CASH BOOSTED</span>
            </div>
          </div>
        )}

        {dailyClaimSuccess && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/60 bg-emerald-950/60 text-emerald-300 font-data text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{dailyClaimSuccess}</span>
          </div>
        )}

        {/* Civilian Account Non-Member Restriction Banner */}
        {(!currentUser || !currentUser.isMember || currentUser.isApplicant) && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/60 bg-amber-950/40 text-amber-300 font-data text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold uppercase text-white block">CIVILIAN ACCOUNT / RESTRICTED ACCESS</span>
                <span className="text-neutral-300 text-[11px]">Financial task bounties, daily claims, and payouts require verified USSF active membership. Please submit an enlistment application or link your in-game CIT2 account.</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setActiveTab('catalog');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-tactical font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>TASK CATALOG ({catalog.length})</span>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setActiveTab('dailyLogin');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-tactical font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'dailyLogin'
                  ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Gift className="h-4 w-4" />
              <span>7 & 30 DAY LOGIN REWARDS</span>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setActiveTab('claims');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-tactical font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'claims'
                  ? 'bg-neutral-700 text-white shadow-lg'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>TREASURY AUDIT ({claims.length})</span>
            </button>
          </div>

          {/* Biometric & E2EE Quick Status */}
          <div className="flex items-center gap-2 font-data text-xs">
            <button
              onClick={() => {
                setBiometricAction('Authorize Treasury Disbursal');
                setIsBiometricOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-emerald-500 transition-colors cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>BIOMETRIC VAULT</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>AES-256 E2EE</span>
            </div>
          </div>
        </div>

        {/* TAB 1: TASK CATALOG (With Numeric Quantity Input for Combat & Multipliers) */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Multi-Select Action Banner if items selected */}
            {selectedTaskIds.length > 0 && (
              <div className="p-4 rounded-xl border border-amber-500/70 bg-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                <div>
                  <span className="text-xs font-tactical font-bold uppercase text-amber-400 block">
                    {selectedTaskIds.length} TASKS MULTI-SELECTED
                  </span>
                  <span className="text-2xl font-black font-tactical text-emerald-400">
                    TOTAL ESTIMATED PAYOUT: ${totalMultiClaim.toLocaleString()}
                  </span>
                  {financialMultiplier > 1 && (
                    <span className="text-xs text-amber-400 block mt-0.5 font-data">
                      Includes {financialMultiplier}X active campaign multiplier boost!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTaskIds([])}
                    className="px-3 py-2 rounded text-xs font-data text-neutral-400 hover:text-white"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={handleOpenMultiClaim}
                    className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>CLAIM {selectedTaskIds.length} TASKS TOGETHER</span>
                  </button>
                </div>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`text-xs font-data px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold shadow-md'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCatalog.map(item => {
                const isSelected = selectedTaskIds.includes(item.id);
                const isCombat = item.category === 'Combat & Tactical' || item.allowQuantity;
                const quantity = isCombat ? (taskQuantities[item.id] || 1) : 1;
                const baseItemPayout = item.payoutAmount * quantity;
                const totalItemPayout = baseItemPayout * financialMultiplier;

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleTaskSelection(item.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/30 shadow-lg shadow-amber-500/10'
                        : 'border-neutral-800 bg-neutral-900/70 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between text-[10px] font-data text-neutral-400 uppercase mb-2">
                        <span className="text-amber-400 font-semibold">{item.category}</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          item.frequency === 'DAILY' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                          item.frequency === 'WEEKLY' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                          item.frequency === 'MULTI_DAILY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                          item.frequency === 'MONTHLY' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                          'bg-rose-950 text-rose-300 border border-rose-500/40'
                        }`}>
                          {item.frequency === 'MULTI_DAILY' ? 'MULTI-CLAIM (ANY TIME)' :
                           item.frequency === 'DAILY' ? 'DAILY RESET (1x/DAY)' :
                           item.frequency === 'WEEKLY' ? 'WEEKLY RESET (1x/WK)' :
                           item.frequency === 'MONTHLY' ? 'MONTHLY RESET' : 'ONCE ONLY'}
                        </span>
                      </div>

                      {/* Title & Selection indicator */}
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-amber-400 bg-amber-500 text-neutral-950' : 'border-neutral-700 bg-neutral-950'
                        }`}>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <h4 className="text-base font-tactical font-black uppercase text-white">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-400 font-sans mt-1.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Numeric Quantity Input for Combat & Tactical Tasks */}
                      {isCombat && (
                        <div 
                          className="mt-4 p-3 rounded-lg bg-neutral-950 border border-amber-500/40 flex items-center justify-between text-xs font-data"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <span className="text-amber-400 uppercase text-[10px] block font-bold flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              <span>QUANTITY (KILLS / APB):</span>
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              Base: ${item.payoutAmount.toLocaleString()} ea
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setQuantityForTask(item.id, quantity - 1)}
                              className="h-7 w-7 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={quantity}
                              onChange={(e) => setQuantityForTask(item.id, parseInt(e.target.value) || 1)}
                              className="w-14 rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-center font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="button"
                              onClick={() => setQuantityForTask(item.id, quantity + 1)}
                              className="h-7 w-7 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Pricing & Single Submit */}
                    <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-tactical font-black text-emerald-400">
                            ${totalItemPayout.toLocaleString()}
                          </span>
                          {financialMultiplier > 1 && (
                            <span className="text-[10px] text-amber-400 font-bold uppercase">
                              ({financialMultiplier}X EVENT)
                            </span>
                          )}
                        </div>
                        {quantity > 1 && (
                          <span className="text-[10px] font-data text-neutral-500 block">
                            ${(item.payoutAmount * financialMultiplier).toLocaleString()} × {quantity}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!currentUser || !currentUser.isMember || currentUser.isApplicant) {
                            alert('Action Restricted: Only verified active USSF members can submit financial claims. Complete Enlistment or Account Linking first.');
                            return;
                          }
                          onOpenClaimModal(item, quantity, totalItemPayout);
                        }}
                        className="text-[11px] font-tactical uppercase px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 font-bold text-neutral-200 transition-colors cursor-pointer"
                      >
                        SUBMIT CLAIM
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: 7 & 30 DAY LOGIN REWARDS (CASH & PROMOTION POINTS - SUBMITTED TO ADMINS) */}
        {activeTab === 'dailyLogin' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-base font-tactical font-bold uppercase text-white flex items-center gap-2">
                    <Gift className="h-5 w-5 text-emerald-400" />
                    <span>DAILY & MONTHLY LOGIN MILESTONES (CASH + PROMOTION POINTS)</span>
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans mt-1">
                    When you claim your login streak milestone, the payout request is transmitted directly to the High Command Admin Queue for monetary approval. Rewards include guaranteed cash bounties AND career promotion points!
                  </p>
                </div>

                {/* Switch between 7-Day and 30-Day Monthly Mode */}
                <div className="flex items-center gap-2 p-1 rounded-lg bg-neutral-950 border border-neutral-800">
                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setLoginMode('7days');
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-data uppercase font-bold transition-all cursor-pointer ${
                      loginMode === '7days'
                        ? 'bg-emerald-500 text-neutral-950 shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    7-DAY STREAK
                  </button>
                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setLoginMode('30days');
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-data uppercase font-bold transition-all cursor-pointer ${
                      loginMode === '30days'
                        ? 'bg-amber-500 text-neutral-950 shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    30-DAY MONTHLY CALENDAR
                  </button>
                </div>
              </div>

              {/* 7-Day Streak Cards */}
              {loginMode === '7days' && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-data bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                    <span className="text-neutral-300">
                      CURRENT STREAK: <strong className="text-amber-400">DAY 0{streakData.streak7} OF 07</strong>
                      {is7ClaimedToday && (
                        <span className="text-emerald-400 ml-2 font-bold">✓ TODAY'S REWARD CLAIMED (NEXT DAY UNLOCKS TOMORROW)</span>
                      )}
                    </span>
                    <span className="text-amber-400 font-bold">
                      DAY 07 DESIGNATED REWARD: ANGEL CRYSTAL AVATAR FRAME + $15,000,000
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {DAILY_LOGIN_REWARDS_7.map(r => {
                      const isClaimedToday = is7ClaimedToday && r.day === (streakData.streak7 >= 2 ? streakData.streak7 - 1 : 7);
                      const isPastClaimed = r.day < streakData.streak7;
                      const isCurrentClaimable = r.day === streakData.streak7 && !is7ClaimedToday;

                      return (
                        <div
                          key={r.day}
                          className={`p-4 rounded-xl border text-center flex flex-col justify-between space-y-3 transition-all ${
                            isCurrentClaimable
                              ? 'border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                              : isPastClaimed || isClaimedToday
                              ? 'border-neutral-800 bg-neutral-950/40 opacity-70'
                              : 'border-neutral-800/60 bg-neutral-950/80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-data text-neutral-500 uppercase">
                              <span>DAY 0{r.day}</span>
                              {r.day === 7 && (
                                <span className="text-amber-400 font-bold">★ FRAME</span>
                              )}
                            </div>
                            <div className="mt-2 text-sm font-tactical font-black text-emerald-400">
                              ${r.cashAmount.toLocaleString()}
                            </div>
                            <span className="text-[11px] font-data text-amber-400 font-bold block mt-0.5">
                              +{r.promotionPoints} Points
                            </span>
                            {r.day === 7 && (
                              <span className="text-[9px] font-data text-purple-400 font-bold block mt-1">
                                + Angel Crystal Frame
                              </span>
                            )}
                          </div>

                          {isPastClaimed || isClaimedToday ? (
                            <div className="w-full py-1.5 rounded text-[11px] font-data uppercase font-bold bg-neutral-900 text-neutral-500 border border-neutral-800 flex items-center justify-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              <span>CLAIMED</span>
                            </div>
                          ) : isCurrentClaimable ? (
                            <button
                              onClick={() => handleClaimLoginReward(r.day, r.cashAmount, r.promotionPoints, '7days')}
                              className={`w-full py-1.5 rounded text-[11px] font-data uppercase font-black tracking-wider transition-all cursor-pointer shadow-lg ${
                                r.day === 7
                                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/20'
                                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                              }`}
                            >
                              {r.day === 7 ? 'CLAIM FRAME ★' : 'CLAIM REWARD'}
                            </button>
                          ) : (
                            <div className="w-full py-1.5 rounded text-[10px] font-data uppercase font-bold bg-neutral-950 text-neutral-600 border border-neutral-800/80 flex items-center justify-center gap-1">
                              <Lock className="h-3 w-3 text-neutral-600" />
                              <span>LOCKED</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 30-Day Monthly Calendar Grid */}
              {loginMode === '30days' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-data bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                    <span className="text-neutral-300">
                      CURRENT PROGRESS: <strong className="text-amber-400">DAY {streakData.streak30} OF 30</strong>
                      {is30ClaimedToday && (
                        <span className="text-emerald-400 ml-2 font-bold">✓ TODAY'S REWARD CLAIMED (NEXT DAY UNLOCKS TOMORROW)</span>
                      )}
                    </span>
                    <span className="text-amber-400 font-bold">
                      DAY 30 GRAND BOUNTY: $25,000,000 + 1,000 PTS + SUPREME GOLD AUREOLE FRAME
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2.5">
                    {DAILY_LOGIN_REWARDS_30.map(r => {
                      const isClaimedToday = is30ClaimedToday && r.day === (streakData.streak30 >= 2 ? streakData.streak30 - 1 : 30);
                      const isPastClaimed = r.day < streakData.streak30;
                      const isCurrentClaimable = r.day === streakData.streak30 && !is30ClaimedToday;

                      return (
                        <div
                          key={r.day}
                          className={`p-2.5 rounded-lg border text-center flex flex-col justify-between ${
                            isCurrentClaimable
                              ? 'border-emerald-500/80 bg-emerald-950/30'
                              : r.day % 7 === 0 || r.day === 30
                              ? 'border-amber-500/60 bg-amber-950/30'
                              : 'border-neutral-800 bg-neutral-950'
                          } ${isPastClaimed || isClaimedToday ? 'opacity-70' : ''}`}
                        >
                          <span className="text-[9px] font-data text-neutral-500 uppercase">DAY {r.day}</span>
                          <div className="text-xs font-tactical font-black text-emerald-400 mt-1">
                            ${(r.cashAmount / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-[9px] font-data text-amber-400 font-bold">
                            +{r.promotionPoints} Pts
                          </div>
                          {isPastClaimed || isClaimedToday ? (
                            <div className="mt-2 w-full py-1 rounded text-[9px] font-data uppercase font-bold bg-neutral-900 text-neutral-500 border border-neutral-800 flex items-center justify-center gap-0.5">
                              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                              <span>CLAIMED</span>
                            </div>
                          ) : isCurrentClaimable ? (
                            <button
                              onClick={() => handleClaimLoginReward(r.day, r.cashAmount, r.promotionPoints, '30days')}
                              className={`mt-2 w-full py-1 rounded text-[9px] font-data uppercase font-bold transition-colors cursor-pointer ${
                                r.day === 30
                                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black shadow'
                                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold'
                              }`}
                            >
                              {r.day === 30 ? 'CLAIM ★' : 'CLAIM'}
                            </button>
                          ) : (
                            <div className="mt-2 w-full py-1 rounded text-[9px] font-data uppercase font-bold bg-neutral-950 text-neutral-600 border border-neutral-800/80 flex items-center justify-center gap-0.5">
                              <Lock className="h-2.5 w-2.5 text-neutral-600" />
                              <span>LOCKED</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {/* TAB 4: TREASURY AUDIT LOG */}
        {activeTab === 'claims' && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-data uppercase tracking-wider text-amber-400 font-bold">
                OFFICIAL RECORD OF SUBMITTED CLAIMS ({claims.length})
              </span>
              <span className="text-xs font-data text-neutral-400">
                Total Verified: ${claims.reduce((s, c) => s + c.amount, 0).toLocaleString()}
              </span>
            </div>

            <div className="space-y-3">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-data"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold uppercase">{claim.rewardCategory}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-400">{claim.date}</span>
                    </div>
                    <div className="text-sm font-tactical font-black text-white">{claim.rewardTitle}</div>
                    <div className="text-neutral-400 text-[11px]">
                      Claimant: <span className="text-neutral-200 font-semibold">{claim.claimantName}</span> ({claim.claimantCid})
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-tactical font-black text-emerald-400 tabular-nums">
                      ${claim.amount.toLocaleString()}
                    </div>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                      {claim.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>



      {/* Biometric Verification Modal */}
      <BiometricModal
        isOpen={isBiometricOpen}
        onClose={() => setIsBiometricOpen(false)}
        actionTitle={biometricAction || 'Treasury Vault Access'}
        onSuccess={() => {
          tacticalAudio.playRadioSquelch();
          setDailyClaimSuccess('Biometric Authentication Verified: Vault access confirmed.');
          setTimeout(() => setDailyClaimSuccess(null), 5000);
        }}
      />
    </div>
  );
};
