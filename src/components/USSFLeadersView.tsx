import React, { useState } from 'react';
import { 
  Shield, Award, Edit3, Star, CheckCircle2, Crown, 
  Terminal, Sparkles, User, Crosshair, MapPin, Clock, X, Save,
  Check, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { USSFMember, USSF_GROUP_INFO, PromotionRequest } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFLogo } from './USSFLogo';
import { USSFView } from './USSFHeader';

interface USSFLeadersViewProps {
  currentUser: USSFMember | null;
  members: USSFMember[];
  onUpdateMember: (memberId: string, updated: Partial<USSFMember>) => void;
  onOpenAuth: () => void;
  onNavigate?: (view: USSFView) => void;
  promotionRequests?: PromotionRequest[];
  onResolvePromotionRequest?: (id: string, approved: boolean) => void;
}

export const USSFLeadersView: React.FC<USSFLeadersViewProps> = ({
  currentUser,
  members,
  onUpdateMember,
  onOpenAuth,
  onNavigate,
  promotionRequests = [],
  onResolvePromotionRequest
}) => {
  // Official Group Leaders: First Major+ ranks (Tier 7+) and Command officers
  const leaderMembers = members.filter(
    m => !m.isApplicant && m.status !== 'Applicant' && (
      m.rankLevel >= 7 || 
      m.isOwner || 
      m.isAdmin || 
      m.rankCategory === 'High Command' || 
      m.rankCategory === 'Field Command'
    )
  ).sort((a, b) => b.rankLevel - a.rankLevel);

  // Edit Modal State
  const [editingLeader, setEditingLeader] = useState<USSFMember | null>(null);
  const [editBio, setEditBio] = useState('');
  const [editPhilosophy, setEditPhilosophy] = useState('');
  const [editNamecardBgUrl, setEditNamecardBgUrl] = useState('');
  const [editSignature, setEditSignature] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const isCurrentUserLeader = currentUser && !currentUser.isApplicant && (
    currentUser.rankLevel >= 7 || 
    currentUser.isOwner || 
    currentUser.isAdmin || 
    currentUser.rankCategory === 'High Command' || 
    currentUser.rankCategory === 'Field Command'
  );

  const pendingPromotions = (promotionRequests || []).filter(r => r.status === 'Pending');

  const handleOpenEdit = (leader: USSFMember) => {
    tacticalAudio.playTacticalClick();
    setEditingLeader(leader);
    setEditBio(leader.leaderBio || leader.bio || '');
    setEditPhilosophy(leader.commandPhilosophy || leader.signature || '');
    setEditNamecardBgUrl(leader.namecardBgUrl || (leader.namecard && leader.namecard.startsWith('http') ? leader.namecard : ''));
    setEditSignature(leader.signature || '');
  };

  const handleSaveLeaderBio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeader) return;

    tacticalAudio.playTargetLock();
    onUpdateMember(editingLeader.id, {
      leaderBio: editBio.trim(),
      commandPhilosophy: editPhilosophy.trim(),
      namecardBgUrl: editNamecardBgUrl.trim(),
      signature: editSignature.trim(),
      bio: editBio.trim()
    });

    setEditingLeader(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-20 font-sans">
      {/* Leadership Showcase Hero Banner */}
      <div className="relative w-full overflow-hidden border-b border-neutral-800 bg-[#0c100d] min-h-[340px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/military_achievements_medals_1790425138935.jpg"
            alt="Leadership Hall of Honor"
            className="h-full w-full object-cover object-center filter brightness-40 contrast-125 saturate-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a08] via-[#080a08]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a08] via-[#080a08]/85 to-transparent" />
          <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400">
                <span className="flex items-center gap-1.5 font-bold bg-amber-950/80 border border-amber-500/50 px-2.5 py-1 rounded backdrop-blur">
                  <Crown className="h-3.5 w-3.5 text-amber-400" />
                  HIGH COMMAND & LEADERSHIP CORPS
                </span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-200">CIT2 LAW GROUP</span>
                <span className="text-neutral-500">/</span>
                <span className="text-emerald-400 font-bold">EST. 2019-06-30</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-tactical uppercase tracking-tight text-white drop-shadow-lg flex items-center gap-3">
                <USSFLogo size="lg" />
                <span>COMMANDING OFFICERS & LEADERS</span>
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-2xl leading-relaxed">
                The founders, commanders, and First Major+ operational leaders upholding the uncompromising standard of Special Forces on CIT2. Every member ranked First Major and above is commissioned as an official leader with promotion approval powers and strategic dispatch authority.
              </p>
            </div>

            {/* Quick Stat Counter */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-amber-500/60 bg-black/80 p-4 text-right backdrop-blur shadow-2xl">
                <span className="text-[10px] font-data text-amber-400 uppercase tracking-widest block font-bold">
                  COMMISSIONED LEADERS
                </span>
                <div className="text-3xl font-black font-tactical text-white">
                  0{leaderMembers.length}
                </div>
                <span className="text-[10px] font-data text-neutral-400 block mt-0.5">
                  First Major+ & High Command
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {saveToast && (
          <div className="p-4 rounded-xl border border-emerald-500/60 bg-emerald-950/80 text-emerald-300 text-xs font-data flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>Leader bio, command philosophy, and profile representation updated successfully!</span>
          </div>
        )}


        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaderMembers.map(leader => {
            const canEditThisLeader = Boolean(currentUser && (
              currentUser.cid === leader.cid || currentUser.isOwner || (currentUser.rankLevel && currentUser.rankLevel >= 20) || currentUser.isAdmin
            ));

            const leaderBanner = leader.namecardBgUrl || (leader.namecard && leader.namecard.startsWith('http') ? leader.namecard : null);

            return (
              <div
                key={leader.id}
                className="rounded-2xl border-2 border-neutral-800 bg-[#0d100d] hover:border-amber-500/70 transition-all p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group"
              >
                {/* Custom Namecard / Animated GIF Background */}
                {leaderBanner && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={leaderBanner}
                      alt={leader.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                      className="h-full w-full object-cover object-center filter brightness-105 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/65" />
                  </div>
                )}

                {/* Background Tactical Grid */}
                <div className="absolute top-0 right-0 p-8 opacity-5 font-tactical font-black text-8xl text-white select-none pointer-events-none">
                  L{leader.rankLevel}
                </div>

                <div className="space-y-5 relative z-10">
                  {/* Top Badge & Edit Action */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/50 text-[10px] font-data font-bold text-amber-300 uppercase">
                      {leader.rankCategory} // TIER {leader.rankLevel}
                    </span>

                    {canEditThisLeader && (
                      <button
                        onClick={() => handleOpenEdit(leader)}
                        className="px-3 py-1 rounded-lg border border-amber-500/60 bg-amber-500/10 hover:bg-amber-500 hover:text-neutral-950 text-amber-400 text-xs font-data font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit Leader Bio</span>
                      </button>
                    )}
                  </div>

                  {/* Avatar + Main Leader Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="h-20 w-20 rounded-2xl border-2 border-amber-500/80 overflow-hidden shadow-2xl bg-neutral-950">
                        <img
                          src={leader.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg'}
                          alt={leader.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs shadow">
                        ★
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="text-[10px] font-data text-neutral-400 uppercase">
                        {leader.callsign} · {leader.cid}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black font-tactical uppercase text-white truncate">
                        {leader.name}[USSF]
                      </h3>
                      <div className="text-xs font-data text-amber-400 font-bold uppercase">
                        {leader.rank} · {leader.division}
                      </div>
                    </div>
                  </div>

                  {/* Command Philosophy Block */}
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-black/60 space-y-1">
                    <span className="text-[10px] font-data text-amber-400 uppercase font-bold tracking-wider block">
                      COMMAND PHILOSOPHY & MOTTO
                    </span>
                    <p className="text-xs font-sans italic text-neutral-200 leading-relaxed">
                      "{leader.commandPhilosophy || leader.signature || USSF_GROUP_INFO.motto}"
                    </p>
                  </div>

                  {/* Detailed Leader Bio */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-data text-neutral-400 uppercase font-bold tracking-wider block">
                      OPERATIONAL LEADERSHIP BIOGRAPHY
                    </span>
                    <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                      {leader.leaderBio || leader.bio || `${leader.name} has served as a key commander within Special Forces, coordinating tactical operations and upholding law enforcement standards across CIT2.`}
                    </p>
                  </div>
                </div>

                {/* Footer Service Ribbons */}
                <div className="mt-5 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-data">
                  <div className="flex flex-wrap gap-1.5">
                    {leader.serviceRibbons.slice(0, 3).map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-700 text-[10px] text-amber-300">
                        {r}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] text-neutral-500">
                    Active Since: {leader.joinedDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Leader Bio Modal */}
      {editingLeader && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-950 border-2 border-amber-500/80 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-tactical font-black uppercase text-lg text-white flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-400" />
                  <span>EDIT LEADER PROFILE // {editingLeader.name}</span>
                </h3>
                <span className="text-xs font-data text-neutral-400">
                  Configure how you are officially represented on the Leaders Page.
                </span>
              </div>
              <button
                onClick={() => setEditingLeader(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeaderBio} className="space-y-4 text-xs font-data">
              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Command Philosophy & Motto
                </label>
                <input
                  type="text"
                  required
                  value={editPhilosophy}
                  onChange={(e) => setEditPhilosophy(e.target.value)}
                  placeholder="e.g. Precision under pressure. Stand firm."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Custom Namecard / Animated GIF Background URL
                </label>
                <input
                  type="url"
                  value={editNamecardBgUrl}
                  onChange={(e) => setEditNamecardBgUrl(e.target.value)}
                  placeholder="Paste direct animated GIF or image URL (e.g. https://...gif, https://...png)"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Supports animated GIFs, high-res banners, and custom artwork. Displays vibrantly on your leader card!
                </span>
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Operational Leadership Biography
                </label>
                <textarea
                  rows={4}
                  required
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Describe your tactical background, group achievements, and leadership philosophy..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingLeader(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-data cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black font-tactical uppercase cursor-pointer flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="h-4 w-4" />
                  <span>SAVE LEADER DOSSIER</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
