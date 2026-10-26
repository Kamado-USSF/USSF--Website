import React, { useState } from 'react';
import { 
  ArrowLeft, Printer, Shield, Clock, Award, Users, 
  CheckCircle2, DollarSign, Gift, FileText, ExternalLink, 
  Radio, Sparkles, MapPin, Calendar, Heart
} from 'lucide-react';
import { USSFMember, USSF_GROUP_INFO } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFView } from './USSFHeader';
import { getAvatarFrameCss } from '../utils/avatarFrameUtils';

interface PersonnelDossierViewProps {
  member: USSFMember;
  onBackToRoster: () => void;
  onNavigate: (view: USSFView) => void;
  onOpenBirthdayGift?: (member: USSFMember) => void;
  currentUser?: USSFMember | null;
  onUpdateMember?: (memberId: string, updated: Partial<USSFMember>) => void;
}

export const PersonnelDossierView: React.FC<PersonnelDossierViewProps> = ({
  member,
  onBackToRoster,
  onNavigate,
  currentUser,
  onUpdateMember
}) => {
  const [copiedTag, setCopiedTag] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCallsign, setEditCallsign] = useState(member.callsign);
  const [editDivision, setEditDivision] = useState(member.division);
  const [editSignature, setEditSignature] = useState(member.signature || '');
  const [editDiscordTag, setEditDiscordTag] = useState(member.discordTag || '');
  const [editWeapons, setEditWeapons] = useState(member.preferredWeapons || 'M4 Carbine, Deagle');

  const canEdit = Boolean(currentUser && (currentUser.cid === member.cid || currentUser.isOwner || (currentUser.rankLevel && currentUser.rankLevel >= 20) || currentUser.isAdmin));

  const daysPlaytime = Math.floor(member.playtimeHours / 24);
  const remainderHours = member.playtimeHours % 24;

  const handlePrint = () => {
    tacticalAudio.playTargetLock();
    window.print();
  };

  const handleCopyTag = () => {
    tacticalAudio.playTacticalClick();
    navigator.clipboard.writeText(member.callsign);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2500);
  };

  const getFrameCss = (frameName?: string) => {
    return getAvatarFrameCss(frameName);
  };

  // Namecard Theme CSS
  const getNamecardBg = () => {
    switch (member.namecard) {
      case 'Crimson Apex Seal': return 'border-rose-500/80 bg-neutral-950 shadow-rose-950/50';
      case 'Obsidian Commander': return 'border-neutral-600 bg-neutral-950 shadow-black';
      case 'Urban CQB': return 'border-amber-500/80 bg-neutral-950 shadow-amber-950/40';
      case 'Night Vision Grid': return 'border-emerald-500/80 bg-neutral-950 shadow-emerald-950/40';
      case 'Airborne Wings': return 'border-sky-500/80 bg-neutral-950 shadow-sky-950/40';
      case 'Desert Recon': return 'border-yellow-500/80 bg-neutral-950 shadow-yellow-950/40';
      case 'CIT2 Law Enforcer': return 'border-blue-500/80 bg-neutral-950 shadow-blue-950/40';
      case 'Valor Citadel': return 'border-purple-500/80 bg-neutral-950 shadow-purple-950/40';
      // Genshin & Wuwa & NTE
      case 'Raiden Shogun: Electro Eternity': return 'border-purple-500 bg-neutral-950 shadow-purple-950/50';
      case 'Furina: Alluring All-Water': return 'border-cyan-400 bg-neutral-950 shadow-cyan-950/50';
      case 'Arlecchino: Ashen Crimson Harbinger': return 'border-rose-600 bg-neutral-950 shadow-rose-950/50';
      case 'Kaedehara Kazuha: Autumn Maple': return 'border-orange-500 bg-neutral-950 shadow-orange-950/40';
      case 'Jinhsi: Sentinel of Resonance': return 'border-teal-400 bg-neutral-950 shadow-teal-950/50';
      case 'Changli: Blazing Vermilion Phoenix': return 'border-red-500 bg-neutral-950 shadow-red-950/50';
      case 'Yinlin: Thunder Weaver Puppet': return 'border-fuchsia-500 bg-neutral-950 shadow-fuchsia-950/40';
      case 'Shorekeeper: Stellar Butterfly': return 'border-sky-400 bg-neutral-950 shadow-sky-950/50';
      case 'Camellya: Bloom of Black Shores': return 'border-pink-500 bg-neutral-950 shadow-pink-950/50';
      case 'NTE: Neverness Cyber Spire': return 'border-cyan-400 bg-neutral-950 shadow-cyan-950/50';
      case 'Hutterite: Astral Glitch Distortion': return 'border-indigo-400 bg-neutral-950 shadow-indigo-950/50';
      case 'Custom Commission Banner': return 'border-amber-400/80 bg-neutral-950 shadow-amber-950/40';
      default: return 'border-neutral-700 bg-neutral-950 shadow-neutral-900/50';
    }
  };

  return (
    <div className="w-full bg-[#070907] text-neutral-100 min-h-screen pb-16 font-sans">
      {/* Top Live Data Connected Telemetry Bar (Matching Screenshot_44.png) */}
      <div className="border-b border-neutral-800 bg-[#0a0c0a] px-4 py-2 sm:px-6 lg:px-8 text-[11px] font-data text-neutral-400 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE DATA CONNECTED
          </span>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-400">
            Page response: 0ms | API updated: 17:57:48 | Next update: 18:02:48 | Special Forces (USSF)
          </span>
        </div>
        <div className="font-mono text-neutral-400 text-xs hidden sm:block">
          18:01:10 UTC
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: KEY STATISTICS (Matching Screenshot_44.png) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-[#0d100d] p-5 space-y-6">
              <div className="text-[11px] font-data text-neutral-400 uppercase tracking-widest font-bold border-b border-neutral-800/80 pb-2">
                KEY STATISTICS
              </div>

              {/* Total Playtime */}
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-data uppercase tracking-wider font-semibold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>TOTAL PLAYTIME</span>
                </div>
                <div className="text-3xl font-tactical font-black text-white mt-1">
                  {member.playtimeHours}H
                </div>
                <div className="text-[11px] font-data text-neutral-500 uppercase mt-0.5">
                  {daysPlaytime}D {remainderHours}H
                </div>
              </div>

              {/* Active Duty */}
              <div className="border-t border-neutral-800/80 pt-4">
                <div className="text-neutral-400 text-xs font-data uppercase tracking-wider">
                  ⚡ ACTIVE DUTY
                </div>
                <div className={`text-xl font-tactical font-black uppercase mt-1 ${
                  member.isOnlineCit ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {member.isOnlineCit ? 'ONLINE' : 'OFFLINE'}
                </div>
                <div className="text-[10px] font-data text-neutral-500 uppercase mt-0.5">
                  {member.isOnlineWeb ? 'WEB ONLINE' : 'WEB OFFLINE'}
                </div>
              </div>

              {/* Last Activity */}
              <div className="border-t border-neutral-800/80 pt-4">
                <div className="text-neutral-400 text-xs font-data uppercase tracking-wider">
                  📡 LAST ACTIVITY
                </div>
                <div className={`text-xl font-tactical font-black uppercase mt-1 ${
                  member.status === 'Active Duty' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {member.status === 'Active Duty' ? 'ACTIVE' : 'OFFLINE'}
                </div>
                <div className="text-[10px] font-data text-neutral-500 uppercase mt-0.5">
                  CIT {member.isOnlineCit ? 'ONLINE' : 'OFFLINE'} · WEB {member.isOnlineWeb ? 'ONLINE' : 'OFFLINE'}
                </div>
              </div>

              {/* Rank */}
              <div className="border-t border-neutral-800/80 pt-4">
                <div className="text-amber-400 text-xs font-data uppercase tracking-wider flex items-center gap-1 font-bold">
                  <span>👑 RANK</span>
                </div>
                <div className="text-2xl font-tactical font-black text-amber-400 mt-1 uppercase">
                  {member.rank}
                </div>
                <div className="text-[11px] font-data text-neutral-400 uppercase mt-0.5">
                  {member.division} · HONORARY L{member.rankLevel}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER / RIGHT: MAIN PERSONNEL DOSSIER & QUICK ACTIONS */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Return and Print Bar (Matching Screenshot_44.png) */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  onBackToRoster();
                }}
                className="flex items-center gap-2 text-xs font-data uppercase tracking-wider text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>RETURN TO ROSTER</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-500/60 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 text-xs font-tactical font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>PRINT ID CARD</span>
              </button>
            </div>

            {/* Huge Banner Showcase (Directly matching Screenshot_44.png) */}
            <div className={`relative rounded-2xl border-2 ${getNamecardBg()} p-6 sm:p-8 overflow-hidden shadow-2xl`}>
              {/* Background Tactical Image with clear visibility / Animated GIF Namecard */}
              <div className="absolute inset-0 z-0">
                {(member.namecardBgUrl || (member.namecard && (member.namecard.startsWith('http') || member.namecard.startsWith('data:image')))) ? (
                  <img
                    src={member.namecardBgUrl || member.namecard}
                    alt={member.namecard || "Custom Namecard Banner"}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/src/assets/images/roster_night_patrol_1790347377452.jpg';
                    }}
                    className="h-full w-full object-cover object-center filter brightness-105 contrast-105"
                  />
                ) : (
                  <img
                    src="/src/assets/images/roster_night_patrol_1790347377452.jpg"
                    alt="Dossier Background"
                    className="h-full w-full object-cover object-center filter brightness-95 contrast-110 opacity-40"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/40 pointer-events-none" />
              </div>

              {/* Banner Content Layout */}
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                {/* Framed Avatar with status dot and star ribbon (as seen in Screenshot_44.png) */}
                <div className="relative shrink-0">
                  <div className={`relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-neutral-950 shadow-2xl ${getFrameCss(member.avatarFrame)}`}>
                    <div className="h-full w-full rounded-xl overflow-hidden">
                      <img
                        src={member.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg'}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Online/Idle/DND presence status dot (top right) */}
                  <span 
                    title={`Status: ${member.presenceStatus || (member.isOnlineCit ? 'Online' : 'Offline')}`}
                    className={`absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full ring-4 ring-[#0d100d] ${
                      (member.presenceStatus === 'Online' || (!member.presenceStatus && member.isOnlineCit))
                        ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                        : member.presenceStatus === 'Idle'
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : member.presenceStatus === 'DND'
                        ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                        : 'bg-neutral-600'
                    }`} 
                  />

                  {/* Red star ribbon badge on bottom right of avatar (as in screenshot) */}
                  <span className="absolute -bottom-2 -right-2 h-7 w-7 rounded-lg bg-rose-600 border-2 border-neutral-900 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    ★
                  </span>
                </div>

                {/* Name, Tag, Biographical Note */}
                <div className="space-y-2 flex-1">
                  <div className="text-[10px] font-data text-amber-400 uppercase tracking-widest font-bold">
                    USSF PERSONNEL PROFILE // {member.namecard || 'CRIMSON APEX SEAL'}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-tactical uppercase tracking-tight text-white drop-shadow-md">
                      {member.name}[USSF]
                    </h1>

                    {/* Operational Presence Badge with Quick-Switcher for current user */}
                    <div className="flex flex-col gap-1">
                      <div className={`px-2.5 py-0.5 rounded text-xs font-data font-bold uppercase tracking-wider flex items-center gap-1.5 shadow ${
                        (member.presenceStatus === 'Online' || (!member.presenceStatus && member.isOnlineCit))
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : member.presenceStatus === 'Idle'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : member.presenceStatus === 'DND'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}>
                        <span className={`h-2 w-2 rounded-full ${
                          (member.presenceStatus === 'Online' || (!member.presenceStatus && member.isOnlineCit))
                            ? 'bg-emerald-400 animate-ping'
                            : member.presenceStatus === 'Idle'
                            ? 'bg-amber-400'
                            : member.presenceStatus === 'DND'
                            ? 'bg-rose-500'
                            : 'bg-neutral-500'
                        }`} />
                        <span>{member.presenceStatus || (member.isOnlineCit ? 'Online' : 'Offline')}</span>
                      </div>

                      {/* Instant Presence Toggle Buttons for logged-in user right on their dossier */}
                      {currentUser && (currentUser.id === member.id || currentUser.cid === member.cid) && onUpdateMember && (
                        <div className="flex items-center gap-1 p-0.5 rounded bg-neutral-900/90 border border-neutral-700 text-[10px] font-data">
                          <button
                            type="button"
                            onClick={() => {
                              tacticalAudio.playTacticalClick();
                              onUpdateMember(member.id, { presenceStatus: 'Online', isOnlineCit: true });
                            }}
                            className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                              (member.presenceStatus === 'Online' || !member.presenceStatus)
                                ? 'bg-emerald-500 text-neutral-950 font-bold'
                                : 'text-emerald-400 hover:text-white'
                            }`}
                          >
                            Online
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              tacticalAudio.playTacticalClick();
                              onUpdateMember(member.id, { presenceStatus: 'Idle', isOnlineCit: true });
                            }}
                            className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                              member.presenceStatus === 'Idle'
                                ? 'bg-amber-500 text-neutral-950 font-bold'
                                : 'text-amber-400 hover:text-white'
                            }`}
                          >
                            Idle
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              tacticalAudio.playTacticalClick();
                              onUpdateMember(member.id, { presenceStatus: 'DND', isOnlineCit: true });
                            }}
                            className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                              member.presenceStatus === 'DND'
                                ? 'bg-rose-500 text-white font-bold'
                                : 'text-rose-400 hover:text-white'
                            }`}
                          >
                            DND
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Discord Badge */}
                    {member.discordTag && (
                      <span className="p-1.5 rounded-lg bg-[#5865F2] text-white text-xs font-bold flex items-center gap-1 shadow">
                        <span>Discord: {member.discordTag}</span>
                      </span>
                    )}
                  </div>

                  {/* Tag Usage */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyTag}
                      className="text-xs font-data text-neutral-300 hover:text-amber-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-700 cursor-pointer"
                    >
                      TAG: {member.callsign} {copiedTag ? '(Copied!)' : ''}
                    </button>
                  </div>

                  {/* Rank Badge Header */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-data pt-1">
                    <span className="text-amber-400 font-bold uppercase flex items-center gap-1">
                      <span>🎖️ {member.rank}</span>
                    </span>
                    <span className="text-neutral-500">/</span>
                    <span className="text-neutral-300 uppercase">
                      {member.division}
                    </span>
                  </div>

                  {/* Biographical Note (Matching Screenshot_44.png) */}
                  <div className="mt-3 pt-3 border-t border-neutral-700/80 max-w-xl">
                    <span className="text-[10px] font-data text-amber-400 uppercase font-bold block mb-0.5">
                      BIOGRAPHICAL NOTE
                    </span>
                    <p className="text-sm font-sans italic text-neutral-200">
                      "{member.signature || member.bio || USSF_GROUP_INFO.motto}"
                    </p>
                    <span className="text-[10px] font-data text-neutral-500 uppercase block mt-1">
                      — OFFICIAL PERSONNEL RECORD · CIT2 LAW GROUP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Two-Column: PERSONNEL DATA (Left) + QUICK ACTIONS (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left 8 Cols: PERSONNEL DATA GRID (Matching Screenshot_44.png) */}
              <div className="md:col-span-8 rounded-xl border border-neutral-800 bg-[#0d100d] p-5 space-y-4">
                <div className="text-xs font-data uppercase tracking-wider text-amber-400 font-bold border-b border-neutral-800 pb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>PERSONNEL DATA</span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-data">
                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">👤 NAME</span>
                    <span className="text-neutral-100 font-bold text-sm">{member.name}[USSF]</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">🔑 ACCOUNT</span>
                    <span className="text-neutral-100 font-bold text-sm uppercase">{member.accountName || member.name}</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">👥 GROUP</span>
                    <span className="text-amber-400 font-bold text-sm">USSF (L4 Special Forces)</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">📂 SECTION</span>
                    <span className="text-amber-400 font-bold text-sm">{member.rankCategory}</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">🎖️ RANK</span>
                    <span className="text-neutral-200 font-medium">{member.rank}</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">🛡️ GROUP DIVISION</span>
                    <span className="text-neutral-200 font-medium">{member.division}</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">🎂 BIRTHDAY</span>
                    <span className="text-emerald-400 font-bold">{member.birthday || 'March 15'}</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">🌍 ORIGIN / AGE</span>
                    <span className="text-neutral-200">{member.country || 'San Andreas'} · {member.age || 24} yrs</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">💰 LIFETIME EARNINGS</span>
                    <span className="text-emerald-400 font-bold">${(member.totalPayout / 1000000).toFixed(1)}M</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase text-[10px] block mb-0.5">🎯 ARRESTS LOGGED</span>
                    <span className="text-neutral-100 font-bold">{member.arrestCount} Felons</span>
                  </div>
                </div>

                {/* Special Appointed Roles Badges */}
                {member.specialRoles && member.specialRoles.length > 0 && (
                  <div className="pt-4 border-t border-neutral-800">
                    <span className="text-amber-400 uppercase text-[10px] font-bold block mb-2">
                      SPECIAL APPOINTED ROLES (GIVEN BY ADMIN):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {member.specialRoles.map((role, idx) => {
                        const isPromo = role === 'Promotion Manager';
                        const isFin = role === 'Financial Manager';
                        const isRec = role === 'Account Recovery Manager';
                        const badgeColor = isPromo
                          ? 'border-purple-500/70 bg-purple-950/60 text-purple-300'
                          : isFin
                          ? 'border-amber-500/70 bg-amber-950/60 text-amber-300'
                          : 'border-cyan-500/70 bg-cyan-950/60 text-cyan-300';

                        return (
                          <span key={idx} className={`px-3 py-1 rounded-lg border text-xs font-data font-bold flex items-center gap-1.5 shadow ${badgeColor}`}>
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{role}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service Decorations & Citations */}
                <div className="pt-4 border-t border-neutral-800">
                  <span className="text-neutral-400 uppercase text-[10px] font-bold block mb-2">
                    OFFICIAL COMMENDATIONS & MEDALS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.serviceRibbons.map((ribbon, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-amber-300 flex items-center gap-1.5">
                        <Award className="h-3 w-3 text-amber-400" />
                        <span>{ribbon}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: QUICK ACTIONS (Without Birthday Gift and Financial Claim) */}
              <div className="md:col-span-4 rounded-xl border border-neutral-800 bg-[#0d100d] p-5 space-y-4">
                <div className="text-xs font-data uppercase tracking-wider text-amber-400 font-bold border-b border-neutral-800 pb-3 flex items-center justify-between">
                  <span>⚡ TACTICAL ACTIONS</span>
                  {canEdit && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] text-amber-400 hover:text-white uppercase font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>EDIT INFO</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 font-data text-xs">
                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      onBackToRoster();
                    }}
                    className="w-full text-left p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 hover:border-amber-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-neutral-200">
                      <Users className="h-4 w-4 text-amber-400" />
                      <span>RETURN TO ROSTER</span>
                    </span>
                    <span className="text-neutral-500 font-mono">›</span>
                  </button>

                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      onNavigate('operations');
                    }}
                    className="w-full text-left p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 hover:border-amber-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-neutral-200">
                      <Radio className="h-4 w-4 text-emerald-400" />
                      <span>OPERATIONS LOG</span>
                    </span>
                    <span className="text-neutral-500 font-mono">›</span>
                  </button>

                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      onNavigate('career');
                    }}
                    className="w-full text-left p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 hover:border-amber-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-neutral-200">
                      <Award className="h-4 w-4 text-amber-400" />
                      <span>CAREER & PROMOTION PATH</span>
                    </span>
                    <span className="text-neutral-500 font-mono">›</span>
                  </button>

                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      onNavigate('social');
                    }}
                    className="w-full text-left p-3 rounded-lg border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40 hover:border-cyan-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-cyan-300 font-bold">
                      <Radio className="h-4 w-4 text-cyan-400" />
                      <span>WARFEED & SQUAD COMMS</span>
                    </span>
                    <span className="text-cyan-400 font-mono">›</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400 space-y-1">
                  <span className="text-amber-400 font-bold block uppercase">ORGANIZATION:</span>
                  <p>Special Forces L4 Law Group · Active Since 2019-06-30</p>
                </div>
              </div>
            </div>

            {/* Inline Roster Edit Modal for Member / Admin */}
            {isEditing && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-neutral-950 border-2 border-amber-500/80 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h3 className="font-tactical font-black uppercase text-base text-white">
                      EDIT ROSTER DETAILS // {member.name}
                    </h3>
                    <button onClick={() => setIsEditing(false)} className="text-neutral-500 hover:text-white">
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-data">
                    {/* Current Rank & Promotion Protocol Notice */}
                    <div className="p-3 rounded-xl border border-amber-500/40 bg-neutral-900/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 uppercase text-[10px] font-bold">COMMISSIONED RANK</span>
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-xs">
                          🎖️ {member.rank} (Tier {member.rankLevel})
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 italic pt-1 leading-relaxed">
                        🔒 Ranks cannot be altered manually. Apply for your next rank via the <strong>Promotion Path</strong> portal. Once approved by Leadership, your rank updates automatically!
                      </p>
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[10px] block mb-1">Callsign / In-Game Tag</label>
                      <input
                        type="text"
                        value={editCallsign}
                        onChange={(e) => setEditCallsign(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[10px] block mb-1">Group Division</label>
                      <input
                        type="text"
                        value={editDivision}
                        onChange={(e) => setEditDivision(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[10px] block mb-1">Personal Signature</label>
                      <input
                        type="text"
                        value={editSignature}
                        onChange={(e) => setEditSignature(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[10px] block mb-1">Discord Tag</label>
                      <input
                        type="text"
                        value={editDiscordTag}
                        onChange={(e) => setEditDiscordTag(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded bg-neutral-900 text-neutral-300"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={() => {
                          if (onUpdateMember) {
                            onUpdateMember(member.id, {
                              callsign: editCallsign,
                              division: editDivision,
                              signature: editSignature,
                              discordTag: editDiscordTag,
                              preferredWeapons: editWeapons
                            });
                          }
                          setIsEditing(false);
                          tacticalAudio.playTargetLock();
                        }}
                        className="px-5 py-2 rounded bg-amber-500 text-neutral-950 font-bold font-tactical uppercase"
                      >
                        SAVE CHANGES
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
