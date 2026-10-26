import React, { useState } from 'react';
import { 
  Shield, Search, Filter, Award, ChevronDown, CheckCircle, 
  Clock, DollarSign, Crosshair, Users, Terminal, Moon, Eye, 
  Radio, Compass, Sparkles, MousePointer, Lock, X, Circle, Edit3, Crown, Key
} from 'lucide-react';
import { USSFMember, DiscordPresenceStatus, USSF_RANKS } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';
import { PersonnelDossierView } from './PersonnelDossierView';
import { USSFView } from './USSFHeader';
import { USSFLogo } from './USSFLogo';

interface USSFRosterViewProps {
  members: USSFMember[];
  onSelectMember?: (member: USSFMember) => void;
  onNavigate: (view: USSFView) => void;
  onOpenBirthdayGift?: (member: USSFMember) => void;
  currentUser?: USSFMember | null;
  onUpdateMember?: (memberId: string, updated: Partial<USSFMember>) => void;
}

export const USSFRosterView: React.FC<USSFRosterViewProps> = ({
  members,
  onSelectMember,
  onNavigate,
  onOpenBirthdayGift,
  currentUser,
  onUpdateMember
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRankCategory, setSelectedRankCategory] = useState<string>('ALL');
  const [selectedPresence, setSelectedPresence] = useState<string>('ALL');
  const [activeDossierMember, setActiveDossierMember] = useState<USSFMember | null>(null);

  // Quick Member Roster Profile Edit Modal (Ranks are earned via Promotion system)
  const [editingMember, setEditingMember] = useState<USSFMember | null>(null);
  const [editPlaytime, setEditPlaytime] = useState(0);
  const [editCallsign, setEditCallsign] = useState('');
  const [editDivision, setEditDivision] = useState('');
  const [editSignature, setEditSignature] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editDiscordTag, setEditDiscordTag] = useState('');
  const [editWeapons, setEditWeapons] = useState('');

  const commandCount = members.filter(m => m.rankCategory === 'High Command').length;
  const staffCount = members.length;
  const activeDutyCount = members.filter(m => m.status === 'Active Duty').length;

  const onlineCount = members.filter(m => (m.presenceStatus || 'Online') === 'Online').length;
  const idleCount = members.filter(m => m.presenceStatus === 'Idle').length;
  const dndCount = members.filter(m => m.presenceStatus === 'DND').length;
  const offlineCount = members.filter(m => m.presenceStatus === 'Offline').length;

  const filteredMembers = members.filter(member => {
    const presence = member.presenceStatus || 'Online';
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.cid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.callsign.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRank = 
      selectedRankCategory === 'ALL' || member.rankCategory === selectedRankCategory;

    const matchesPresence = 
      selectedPresence === 'ALL' || presence === selectedPresence;

    return matchesSearch && matchesRank && matchesPresence;
  });

  const handleStartEdit = (member: USSFMember, e: React.MouseEvent) => {
    e.stopPropagation();
    tacticalAudio.playTacticalClick();
    setEditingMember(member);
    setEditPlaytime(member.playtimeHours || 0);
    setEditCallsign(member.callsign);
    setEditDivision(member.division);
    setEditSignature(member.signature || '');
    setEditBio(member.bio || '');
    setEditDiscordTag(member.discordTag || '');
    setEditWeapons(member.preferredWeapons || 'M4 Carbine, Deagle');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    if (!editingMember || !onUpdateMember) return;

    tacticalAudio.playTargetLock();
    onUpdateMember(editingMember.id, {
      playtimeHours: editPlaytime,
      callsign: editCallsign.trim(),
      division: editDivision.trim(),
      signature: editSignature.trim(),
      bio: editBio.trim(),
      discordTag: editDiscordTag.trim(),
      preferredWeapons: editWeapons.trim()
    });

    setEditingMember(null);
  };

  const getFrameCss = (frameName?: string) => {
    switch (frameName) {
      case 'Supreme Gold Aureole': return 'frame-supreme-gold';
      case 'Vice Commander Ruby': return 'frame-vice-ruby';
      case 'Golden Star Officer': return 'frame-golden-star';
      case 'Cyan Tactical': return 'frame-cyan-tactical';
      case 'Emerald Chevrons': return 'frame-emerald-chevron';
      case 'Single Gold Chevron': return 'frame-golden-star';
      case 'Specialist Diamond': return 'frame-emerald-chevron';
      case 'Recruit Ring': return 'frame-recruit-ring';
      case 'Standard Issue Border': return 'frame-recruit-ring';
      default: return 'frame-recruit-ring';
    }
  };

  const getNameStyleCss = (style?: string) => {
    switch (style) {
      case 'gold-glow': return 'name-style-gold';
      case 'emerald-glow': return 'name-style-emerald';
      case 'cyan-glow': return 'name-style-cyan';
      case 'amber-glow': return 'name-style-amber';
      case 'crimson-glow': return 'name-style-crimson';
      case 'astral-rainbow': return 'name-style-astral';
      case 'wuwa-resonance': return 'name-style-wuwa-resonance';
      case 'genshin-archon': return 'name-style-genshin-archon';
      case 'abyssal-void': return 'name-style-abyssal-void';
      case 'flame-phoenix': return 'name-style-flame-phoenix';
      case 'cyber-neon': return 'name-style-cyber-neon';
      default: return '';
    }
  };

  const getNamecardCardStyle = (namecard?: string) => {
    switch (namecard) {
      // Tactical Cards
      case 'Crimson Apex Seal': return 'border-rose-500/60 bg-gradient-to-b from-rose-950/40 via-neutral-900/90 to-neutral-950 shadow-rose-950/30';
      case 'Obsidian Commander': return 'border-neutral-500/60 bg-gradient-to-b from-neutral-800/40 via-neutral-900/90 to-neutral-950';
      case 'Urban CQB': return 'border-amber-500/60 bg-gradient-to-b from-amber-950/40 via-neutral-900/90 to-neutral-950 shadow-amber-950/30';
      case 'Night Vision Grid': return 'border-emerald-500/60 bg-gradient-to-b from-emerald-950/40 via-neutral-900/90 to-neutral-950 shadow-emerald-950/30';
      case 'Airborne Wings': return 'border-sky-500/60 bg-gradient-to-b from-sky-950/40 via-neutral-900/90 to-neutral-950 shadow-sky-950/30';
      case 'Desert Recon': return 'border-yellow-500/60 bg-gradient-to-b from-yellow-950/40 via-neutral-900/90 to-neutral-950 shadow-yellow-950/30';
      case 'CIT2 Law Enforcer': return 'border-blue-500/60 bg-gradient-to-b from-blue-950/40 via-neutral-900/90 to-neutral-950 shadow-blue-950/30';
      case 'Valor Citadel': return 'border-purple-500/60 bg-gradient-to-b from-purple-950/40 via-neutral-900/90 to-neutral-950 shadow-purple-950/30';
      // Genshin Prestige
      case 'Raiden Shogun: Electro Eternity': return 'border-purple-500/80 bg-gradient-to-b from-purple-950/60 via-indigo-950/80 to-neutral-950 shadow-[0_0_20px_rgba(168,85,247,0.3)]';
      case 'Furina: Alluring All-Water': return 'border-cyan-400/80 bg-gradient-to-b from-cyan-950/60 via-blue-950/80 to-neutral-950 shadow-[0_0_20px_rgba(34,211,238,0.3)]';
      case 'Arlecchino: Ashen Crimson Harbinger': return 'border-rose-600/80 bg-gradient-to-b from-rose-950/70 via-neutral-950 to-black shadow-[0_0_20px_rgba(225,29,72,0.4)]';
      case 'Kaedehara Kazuha: Autumn Maple': return 'border-orange-500/80 bg-gradient-to-b from-amber-950/60 via-red-950/70 to-neutral-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
      // Wuwa Prestige
      case 'Jinhsi: Sentinel of Resonance': return 'border-teal-400/80 bg-gradient-to-b from-teal-950/60 via-cyan-950/80 to-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.4)]';
      case 'Changli: Blazing Vermilion Phoenix': return 'border-red-500/80 bg-gradient-to-b from-red-950/60 via-orange-950/80 to-neutral-950 shadow-[0_0_20px_rgba(239,68,68,0.4)]';
      case 'Yinlin: Thunder Weaver Puppet': return 'border-fuchsia-500/80 bg-gradient-to-b from-fuchsia-950/60 via-purple-950/80 to-black shadow-[0_0_20px_rgba(217,70,239,0.3)]';
      case 'Shorekeeper: Stellar Butterfly': return 'border-sky-400/80 bg-gradient-to-b from-blue-950/60 via-indigo-950/80 to-cyan-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]';
      case 'Camellya: Bloom of Black Shores': return 'border-pink-500/80 bg-gradient-to-b from-pink-950/60 via-neutral-950 to-black shadow-[0_0_20px_rgba(236,72,153,0.3)]';
      // NTE Urban Cyber
      case 'NTE: Neverness Cyber Spire': return 'border-cyan-400/80 bg-gradient-to-b from-cyan-950/60 via-purple-950/70 to-neutral-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]';
      case 'Hutterite: Astral Glitch Distortion': return 'border-indigo-400/80 bg-gradient-to-b from-indigo-950/60 via-fuchsia-950/70 to-neutral-950 shadow-[0_0_20px_rgba(99,102,241,0.4)]';
      default: return 'border-neutral-800 bg-[#0c0f0c]/90';
    }
  };

  const renderPresenceBadge = (status: DiscordPresenceStatus = 'Online') => {
    switch (status) {
      case 'Online':
        return <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-neutral-950 shadow-md" title="Online" />;
      case 'Idle':
        return <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-amber-400 border-2 border-neutral-950 shadow-md" title="Idle" />;
      case 'DND':
        return <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-rose-500 border-2 border-neutral-950 shadow-md" title="Do Not Disturb" />;
      case 'Offline':
        return <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-neutral-600 border-2 border-neutral-950 shadow-md" title="Offline" />;
      default:
        return <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-neutral-950" />;
    }
  };

  const getPresenceText = (status: DiscordPresenceStatus = 'Online') => {
    switch (status) {
      case 'Online': return { label: 'Online', color: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/40' };
      case 'Idle': return { label: 'Idle / Away', color: 'text-amber-400 bg-amber-950/70 border-amber-500/40' };
      case 'DND': return { label: 'Do Not Disturb', color: 'text-rose-400 bg-rose-950/70 border-rose-500/40' };
      case 'Offline': return { label: 'Offline', color: 'text-neutral-400 bg-neutral-950/70 border-neutral-700' };
    }
  };

  // If a member is selected, render the complete Personnel Dossier view!
  if (activeDossierMember) {
    return (
      <PersonnelDossierView
        member={activeDossierMember}
        onBackToRoster={() => setActiveDossierMember(null)}
        onNavigate={onNavigate}
        onOpenBirthdayGift={onOpenBirthdayGift}
        currentUser={currentUser}
        onUpdateMember={onUpdateMember}
      />
    );
  }

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-20 font-sans">
      {/* High-Impact Special Forces Hero Banner */}
      <div className="relative w-full overflow-hidden border-b border-neutral-800 bg-[#0c100d] min-h-[360px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/roster_night_patrol_1790347377452.jpg"
            alt="Special Forces Tactical Night Patrol Group"
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
                  SPECIAL FORCES (USSF)
                </span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-200">CIT2 LAW GROUP</span>
                <span className="text-neutral-500">/</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Crosshair className="h-3 w-3" />
                  <span>OFFICIAL GROUP PERSONNEL</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-tactical uppercase tracking-tight text-white drop-shadow-lg flex items-center gap-3">
                <USSFLogo size="lg" />
                <span>OFFICIAL SPECIAL FORCES ROSTER</span>
              </h1>

              <p className="text-xs sm:text-sm font-sans text-neutral-200 max-w-2xl drop-shadow leading-relaxed">
                Official verified law enforcement operators under Special Forces jurisdiction on CIT2. Real-time active status, tactical rank badges, special appointed duties, and member dossier synchronization.
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="rounded-xl border border-neutral-700/80 bg-black/80 p-4 text-right backdrop-blur-md shadow-2xl">
                <span className="text-[10px] font-data text-neutral-400 uppercase tracking-widest block font-bold">
                  ACTIVE OPERATORS
                </span>
                <div className="text-2xl sm:text-3xl font-black font-tactical text-emerald-400">
                  {activeDutyCount} / {staffCount}
                </div>
                <span className="text-[10px] font-data text-neutral-400 block mt-0.5">
                  100% In-Game Verified
                </span>
              </div>

              <div className="rounded-xl border border-amber-500/50 bg-black/80 p-4 text-right backdrop-blur-md shadow-2xl">
                <span className="text-[10px] font-data text-amber-400 uppercase tracking-widest block font-bold">
                  HIGH COMMAND
                </span>
                <div className="text-2xl sm:text-3xl font-black font-tactical text-amber-400">
                  0{commandCount} LEADERS
                </div>
                <span className="text-[10px] font-data text-neutral-400 block mt-0.5">
                  CIT2 Law Headquarters
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Personnel Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-[#0d100d] p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by operator name, CID, callsign, or rank..."
              className="w-full rounded-lg bg-neutral-950 border border-neutral-800 pl-9 pr-4 py-2 text-xs font-data text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'High Command', 'Field Command', 'Regular Member'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setSelectedRankCategory(cat);
                }}
                className={`text-xs font-data px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedRankCategory === cat
                    ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold shadow-md'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Operational Status Filters (Removed the bulky "DISCORD PRESENCE STATUS:" text!) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-800 bg-[#0b0e0c] text-xs font-data">
          <div className="flex items-center gap-2 text-neutral-300 uppercase text-[11px] font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL STATUS FILTERS:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Status', count: staffCount, dot: 'bg-neutral-400' },
              { id: 'Online', label: 'Online', count: onlineCount, dot: 'bg-emerald-500' },
              { id: 'Idle', label: 'Idle / Away', count: idleCount, dot: 'bg-amber-400' },
              { id: 'DND', label: 'Do Not Disturb', count: dndCount, dot: 'bg-rose-500' },
              { id: 'Offline', label: 'Offline', count: offlineCount, dot: 'bg-neutral-600' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setSelectedPresence(tab.id);
                }}
                className={`px-3 py-1 rounded-lg border text-xs font-data transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedPresence === tab.id
                    ? 'bg-neutral-800 border-amber-400 text-white font-bold shadow'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${tab.dot}`} />
                <span>{tab.label}</span>
                <span className="text-[10px] text-neutral-500 font-mono">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modern Tactical Members Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map(member => {
            const presence = member.presenceStatus || 'Online';
            const presenceInfo = getPresenceText(presence);
            const isMe = currentUser && currentUser.cid === member.cid;
            const canEditThisMember = isMe || (currentUser && currentUser.isOwner);
            const memberBanner = member.namecardBgUrl || (member.namecard && member.namecard.startsWith('http') ? member.namecard : null);

            return (
              <div
                key={member.id}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setActiveDossierMember(member);
                  if (onSelectMember) onSelectMember(member);
                }}
                className={`rounded-2xl border-2 ${getNamecardCardStyle(member.namecard)} p-5 hover:border-amber-500 transition-all cursor-pointer hover:shadow-2xl hover:shadow-amber-500/10 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md`}
              >
                {/* Vivid Animated GIF / Custom Banner Background */}
                {memberBanner && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={memberBanner}
                      alt="Card Background"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                      className="h-full w-full object-cover object-center filter brightness-105 opacity-65 group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/65" />
                  </div>
                )}

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    {/* Top Bar with Namecard & Edit Button */}
                    <div className="flex items-center justify-between text-[10px] font-data text-neutral-400 uppercase mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded bg-black/80 border border-neutral-700 text-amber-300 font-bold backdrop-blur">
                          {member.namecard || 'CIT2 Law Enforcer'}
                        </span>
                        {member.isApplicant && (
                          <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/60 text-rose-300 font-bold text-[9px]">
                            APPLICANT
                          </span>
                        )}
                      </div>

                    <div className="flex items-center gap-2">
                      {canEditThisMember && (
                        <button
                          onClick={(e) => handleStartEdit(member, e)}
                          className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500 hover:text-neutral-950 text-amber-300 border border-amber-500/50 text-[10px] font-data font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Edit your roster info"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>EDIT INFO</span>
                        </button>
                      )}
                      <span className="text-emerald-400 font-bold bg-black/80 px-2 py-0.5 rounded border border-neutral-700">
                        LVL {member.rankLevel}
                      </span>
                    </div>
                  </div>

                  {/* Avatar + Main Identity */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="relative shrink-0">
                      <div className={`relative h-16 w-16 rounded-full ${getFrameCss(member.avatarFrame)}`}>
                        <div className="h-full w-full rounded-full overflow-hidden">
                          <img
                            src={member.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg'}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      {renderPresenceBadge(presence)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-data text-neutral-400 uppercase truncate">
                          {member.cid} · {member.callsign}
                        </div>
                        <span className={`px-2 py-0.2 rounded text-[9px] font-bold border ${presenceInfo.color}`}>
                          {presenceInfo.label}
                        </span>
                      </div>
                      <h3 className={`text-lg font-tactical font-black uppercase text-white truncate ${getNameStyleCss(member.nameStyle)}`}>
                        {member.name}[USSF]
                      </h3>
                      <div className="text-xs font-data text-amber-400 font-semibold mt-0.5 truncate">
                        {member.rank}
                      </div>
                    </div>
                  </div>

                  {/* Special Appointed Roles Badges (Promotion, Financial, Recovery Manager) */}
                  {member.specialRoles && member.specialRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {member.specialRoles.map((role, rIdx) => {
                        const isPromo = role === 'Promotion Manager';
                        const isFin = role === 'Financial Manager';
                        const badgeColor = isPromo
                          ? 'border-purple-500/70 bg-purple-950/80 text-purple-300'
                          : isFin
                          ? 'border-amber-500/70 bg-amber-950/80 text-amber-300'
                          : 'border-cyan-500/70 bg-cyan-950/80 text-cyan-300';

                        return (
                          <span
                            key={rIdx}
                            className={`px-2 py-0.5 rounded text-[10px] font-data font-bold border flex items-center gap-1 shadow ${badgeColor}`}
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>{role}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Division */}
                  <div className="text-xs font-sans text-neutral-300 mb-2 truncate">
                    {member.division}
                  </div>

                  {/* Signature Preview */}
                  {member.signature && (
                    <div className="text-[11px] font-sans italic text-amber-300/80 mb-3 line-clamp-1 border-l-2 border-amber-500/50 pl-2">
                      "{member.signature}"
                    </div>
                  )}

                  {/* Playtime & Arrests Bar */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-neutral-800 bg-black/80 p-2.5 text-center text-xs font-data backdrop-blur">
                    <div>
                      <div className="text-neutral-500 text-[9px] uppercase">PLAYTIME</div>
                      <div className="text-neutral-200 font-bold mt-0.5">{member.playtimeHours}h</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 text-[9px] uppercase">POINTS</div>
                      <div className="text-amber-400 font-bold mt-0.5">{member.promotionPoints}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 text-[9px] uppercase">ARRESTS</div>
                      <div className="text-emerald-400 font-bold mt-0.5">{member.arrestCount}</div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-data">
                  <span className="text-neutral-400 group-hover:text-amber-400 transition-colors flex items-center gap-1 font-bold">
                    <span>VIEW FULL DOSSIER</span>
                    <span>→</span>
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Joined: {member.joinedDate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {members.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-800 bg-[#0d100d] space-y-4">
            <Users className="h-12 w-12 text-amber-500/60 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-tactical font-black uppercase text-white tracking-wide">
                CLEAN PRODUCTION ROSTER // ZERO ACTIVE OPERATORS
              </h3>
              <p className="text-xs text-neutral-400 font-sans max-w-md mx-auto leading-relaxed">
                The Special Forces database is running in a pristine production state with zero dummy or fabricated member records. In-game CIT2 operators can link accounts or apply for official enlistment.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onNavigate('recruitment')}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase cursor-pointer transition-all shadow-lg shadow-amber-500/20"
              >
                GO TO ENLISTMENT & ACCOUNT LINKING
              </button>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/50">
            <Users className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-tactical font-bold uppercase text-neutral-300">
              NO OPERATORS FOUND
            </h3>
            <p className="text-xs text-neutral-500 font-sans mt-1">
              Adjust search parameters or status filters to view group personnel.
            </p>
          </div>
        ) : null}
      </div>

      {/* Member Roster Info Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-950 border-2 border-amber-500/80 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-tactical font-black uppercase text-base text-white">
                EDIT ROSTER DETAILS // {editingMember.name}
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs font-data">
              {/* Current Rank & Promotion Protocol Notice */}
              <div className="p-3 rounded-xl border border-amber-500/40 bg-neutral-950/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 uppercase text-[10px] font-bold">OFFICIAL COMMISSIONED RANK</span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-xs">
                    🎖️ {editingMember.rank} (Tier {editingMember.rankLevel})
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800">
                  <span>Current Banked Points:</span>
                  <span className="text-emerald-400 font-bold font-mono">{(editingMember.promotionPoints || 0).toLocaleString()} PTS</span>
                </div>
                <p className="text-[10px] text-neutral-400 italic pt-1 leading-relaxed">
                  🔒 Ranks cannot be manually altered. Operators must apply for their next rank via the <strong>Promotion Path</strong> portal. Once approved by High Command, your rank updates automatically!
                </p>
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Callsign / Tactical Tag
                </label>
                <input
                  type="text"
                  required
                  value={editCallsign}
                  onChange={(e) => setEditCallsign(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Group Division
                </label>
                <input
                  type="text"
                  required
                  value={editDivision}
                  onChange={(e) => setEditDivision(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Personal Signature / Motto
                </label>
                <input
                  type="text"
                  value={editSignature}
                  onChange={(e) => setEditSignature(e.target.value)}
                  placeholder="e.g. May God Have Mercy Upon Our Enemies Cause We Won't"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Biographical Note
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                    Discord Tag
                  </label>
                  <input
                    type="text"
                    value={editDiscordTag}
                    onChange={(e) => setEditDiscordTag(e.target.value)}
                    placeholder="user#0001"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                    Preferred Weapons
                  </label>
                  <input
                    type="text"
                    value={editWeapons}
                    onChange={(e) => setEditWeapons(e.target.value)}
                    placeholder="M4, Deagle"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-neutral-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-tactical uppercase"
                >
                  SAVE ROSTER INFO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
