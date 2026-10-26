import React from 'react';
import { 
  ArrowRight, Shield, Award, Users, DollarSign, Radio, 
  FileText, Play, CheckCircle2, ChevronRight, ExternalLink
} from 'lucide-react';
import { USSFView } from './USSFHeader';
import { tacticalAudio } from '../utils/audioSynth';
import { COMMAND_NEWS, USSFMember, FieldReport } from '../data/ussfData';

interface USSFHomeViewProps {
  onNavigate: (view: USSFView) => void;
  members: USSFMember[];
  fieldReports: FieldReport[];
}

export const USSFHomeView: React.FC<USSFHomeViewProps> = ({
  onNavigate,
  members,
  fieldReports
}) => {
  const activeMembers = members.filter(m => m.status === 'Active Duty');

  return (
    <div className="w-full bg-[#0a0c0a] text-neutral-100">
      {/* System Overview Dashboard Banner */}
      <section className="relative w-full border-b border-neutral-800/80 px-4 py-10 sm:px-6 lg:px-8 bg-[#0d0f0c]">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-neutral-800 bg-[#121512]/90 p-6 md:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6 mb-6">
              <div className="space-y-1">
                <div className="text-xs font-data uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>SPECIAL FORCES COMMAND STATUS</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-tactical uppercase tracking-tight text-neutral-100">
                  CIT2 LAW DIVISION · OPERATIONAL READINESS
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-data text-emerald-400 font-bold uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE NETWORK
                </span>
                <span className="text-xs font-data text-neutral-400 border border-neutral-800 rounded px-3 py-1 bg-neutral-900">
                  SERVER: CIT2.NET
                </span>
              </div>
            </div>

            {/* 4 Metric Boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="rounded bg-neutral-900/60 p-4 border border-neutral-800/60">
                <div className="text-3xl sm:text-4xl font-bold font-data text-neutral-100 tabular-nums">
                  {activeMembers.length}
                </div>
                <div className="text-[10px] font-data text-neutral-400 uppercase mt-1">
                  ACTIVE OPERATORS
                </div>
              </div>

              <div className="rounded bg-neutral-900/60 p-4 border border-neutral-800/60">
                <div className="text-3xl sm:text-4xl font-bold font-data text-neutral-100 tabular-nums">
                  {fieldReports.length}
                </div>
                <div className="text-[10px] font-data text-neutral-400 uppercase mt-1">
                  FIELD REPORTS
                </div>
              </div>

              <div className="rounded bg-neutral-900/60 p-4 border border-neutral-800/60">
                <div className="text-3xl sm:text-4xl font-bold font-data text-neutral-100 tabular-nums">
                  20
                </div>
                <div className="text-[10px] font-data text-neutral-400 uppercase mt-1">
                  OFFICIAL RANKS
                </div>
              </div>

              <div className="rounded bg-neutral-900/60 p-4 border border-neutral-800/60">
                <div className="text-3xl sm:text-4xl font-bold font-data text-emerald-400 tabular-nums">
                  $80.5M
                </div>
                <div className="text-[10px] font-data text-emerald-500 uppercase mt-1">
                  APPROVED REWARDS
                </div>
              </div>
            </div>

            {/* In-game CIT2 Verification Notice */}
            <div className="mt-6 rounded bg-neutral-950/80 p-3.5 border border-neutral-800/80 text-xs font-data text-neutral-400 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">VERIFICATION PROTOCOL:</span>
                <span>F5 Scoreboard or Group Scores + unedited In-Game Phone Clock (B+Clock) required for all treasury payouts.</span>
              </div>
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  onNavigate('financial');
                }}
                className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1.5 cursor-pointer bg-neutral-900 border border-neutral-700 px-3 py-1 rounded"
              >
                <span>OPEN REWARDS LEDGER</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Genuine Brotherhood Welcome Note */}
          <div className="mt-6 rounded-xl border border-neutral-800/90 bg-neutral-950/90 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 text-[11px] font-data uppercase tracking-wider text-amber-400 font-bold">
                <Award className="h-3.5 w-3.5" />
                <span>FOUNDED JUNE 30, 2019 · CIT2 SPECIAL FORCES BROTHERHOOD</span>
              </div>
              <h4 className="text-base sm:text-lg font-tactical font-black text-white uppercase tracking-tight">
                Built by real players. Driven by discipline, honor, and loyalty.
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Welcome to our squadron home. Whether you are reporting for a night patrol, claiming your hard-earned arrest bounties, or climbing the 20-tier rank hierarchy, you are part of an unbroken team that has dominated the CIT2 law side for over 7 years.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  onNavigate('leaders');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-tactical font-bold uppercase transition-colors text-center cursor-pointer shadow-lg"
              >
                MEET THE LEADERS
              </button>
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  onNavigate('groupInfo');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 text-xs font-tactical font-bold uppercase transition-colors text-center cursor-pointer"
              >
                GROUP SPECS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 01 / COMMAND DECK: Everything has a place */}
      <section id="command-deck" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80 bg-[#0a0c0a]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-500 mb-1">
                <span>01 /</span>
                <span>COMMAND DECK</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-tactical uppercase tracking-tight text-neutral-100">
                Everything has a place.
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-sans max-w-md leading-relaxed">
              Personnel, field operations, financial rewards and career recognition structured into an authoritative command system.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Financial control */}
            <div 
              onClick={() => { tacticalAudio.playTacticalClick(); onNavigate('financial'); }}
              className="group cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-emerald-500/60 hover:bg-neutral-900/80 hover:shadow-xl"
            >
              <div className="flex items-center justify-between text-xs font-data text-neutral-400 mb-3">
                <span className="text-amber-500 font-bold uppercase">02 / REWARDS</span>
                <span className="text-emerald-400 font-bold">$80.5M PAYOUT</span>
              </div>
              <h4 className="text-xl font-bold font-tactical uppercase text-neutral-100 group-hover:text-emerald-300 transition-colors">
                Financial control
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-2">
                Claims, unedited screenshot proof, payout records and event bonuses.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-tactical font-semibold text-neutral-200 group-hover:text-emerald-400 transition-colors">
                <span>OPEN FINANCE</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Roster & profiles */}
            <div 
              onClick={() => { tacticalAudio.playTacticalClick(); onNavigate('roster'); }}
              className="group cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-amber-500/60 hover:bg-neutral-900/80 hover:shadow-xl"
            >
              <div className="flex items-center justify-between text-xs font-data text-neutral-400 mb-3">
                <span className="text-amber-500 font-bold uppercase">01 / PERSONNEL</span>
                <span className="text-neutral-400 font-semibold">{members.length} OPERATORS</span>
              </div>
              <h4 className="text-xl font-bold font-tactical uppercase text-neutral-100 group-hover:text-amber-300 transition-colors">
                Roster & profiles
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-2">
                Official members, rank structure, name cards and service history.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-tactical font-semibold text-neutral-200 group-hover:text-amber-400 transition-colors">
                <span>OPEN ROSTER</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Promotion path */}
            <div 
              onClick={() => { tacticalAudio.playTacticalClick(); onNavigate('career'); }}
              className="group cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-amber-500/60 hover:bg-neutral-900/80 hover:shadow-xl"
            >
              <div className="flex items-center justify-between text-xs font-data text-neutral-400 mb-3">
                <span className="text-amber-500 font-bold uppercase">03 / CAREER</span>
                <span className="text-neutral-400">20 TIERS</span>
              </div>
              <h4 className="text-xl font-bold font-tactical uppercase text-neutral-100 group-hover:text-amber-300 transition-colors">
                Promotion path
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-2">
                See exactly how days and activity points turn into the next rank.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-tactical font-semibold text-neutral-200 group-hover:text-amber-400 transition-colors">
                <span>VIEW PROMOTION HIERARCHY</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Patrol & training */}
            <div 
              onClick={() => { tacticalAudio.playTacticalClick(); onNavigate('operations'); }}
              className="group cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-amber-500/60 hover:bg-neutral-900/80 hover:shadow-xl"
            >
              <div className="flex items-center justify-between text-xs font-data text-neutral-400 mb-3">
                <span className="text-amber-500 font-bold uppercase">04 / FIELD</span>
                <span className="text-neutral-400">{fieldReports.length} REPORTS</span>
              </div>
              <h4 className="text-xl font-bold font-tactical uppercase text-neutral-100 group-hover:text-amber-300 transition-colors">
                Patrol & training
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-2">
                Host CIT2 events, record participants and preserve proof.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-tactical font-semibold text-neutral-200 group-hover:text-amber-400 transition-colors">
                <span>VIEW OPERATIONS</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Field Feed & Command News */}
      <section className="relative w-full py-14 px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80 bg-[#0d0f0c]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: FIELD FEED */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 md:p-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs font-data">
                <span className="text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Radio className="h-4 w-4 text-amber-400" />
                  <span>FIELD FEED</span>
                </span>
                <button 
                  onClick={() => onNavigate('operations')}
                  className="text-amber-400 hover:text-amber-300 uppercase flex items-center gap-1 cursor-pointer"
                >
                  <span>ARCHIVE</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {fieldReports.length > 0 ? (
                <div className="space-y-3">
                  {fieldReports.map((rep) => (
                    <div key={rep.id} className="p-3.5 rounded bg-neutral-950/60 border border-neutral-800/60 text-xs hover:border-neutral-700 transition-colors">
                      <div className="flex items-center justify-between text-neutral-400 font-data mb-1">
                        <span className="text-amber-400 font-bold">{rep.type.toUpperCase()}</span>
                        <span>{rep.date} · {rep.durationHours}h</span>
                      </div>
                      <div className="font-bold text-neutral-200 text-sm">{rep.title}</div>
                      <div className="text-neutral-400 text-xs mt-1 font-sans leading-relaxed">{rep.summary}</div>
                      <div className="mt-2 pt-2 border-t border-neutral-800/60 text-[10px] font-data text-neutral-500">
                        Host: {rep.hostName} ({rep.hostCid})
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs font-data text-neutral-500">
                  No published field records yet.
                </div>
              )}
            </div>

            {/* Right: COMMAND NEWS */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 md:p-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs font-data">
                <span className="text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span>COMMAND NEWS</span>
                </span>
                <span className="text-neutral-500 text-[10px] font-data uppercase">
                  CIT2 LAW HEADQUARTERS
                </span>
              </div>

              <div className="space-y-3">
                {COMMAND_NEWS.map((n) => (
                  <div key={n.id} className="p-3.5 rounded bg-neutral-950/60 border border-neutral-800/60 text-xs hover:border-neutral-700 transition-colors">
                    <div className="flex items-center justify-between text-neutral-400 font-data mb-1">
                      <span className="text-emerald-400 font-bold">{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <div className="font-bold text-neutral-200 text-sm">{n.title}</div>
                    <div className="text-neutral-400 text-xs mt-1 font-sans leading-relaxed">{n.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 / LEADERSHIP: People behind the standard */}
      <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800/80 bg-[#0a0c0a]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-data uppercase tracking-widest text-amber-500 mb-1">
                02 / LEADERSHIP
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-tactical uppercase tracking-tight text-neutral-100">
                People behind the standard.
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-sans max-w-md">
              High Command and field leadership maintaining Special Forces standards across San Andreas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.filter(m => !m.isApplicant && (m.rankLevel >= 7 || m.isOwner)).slice(0, 4).map((member) => (
              <div 
                key={member.id} 
                onClick={() => onNavigate('leaders')}
                className="cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 hover:border-amber-500/60 transition-all hover:bg-neutral-900/90 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={member.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg'}
                      alt={member.name}
                      className="h-12 w-12 rounded-xl object-cover border border-amber-500/40"
                    />
                    <div>
                      <div className="text-sm font-bold font-tactical uppercase text-neutral-100 group-hover:text-amber-400 transition-colors">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-amber-400/90 font-data font-semibold">
                        🎖️ {member.rank}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {member.cid}
                      </div>
                    </div>
                  </div>
                  {member.signature && (
                    <p className="text-[11px] text-neutral-300 italic font-sans border-l-2 border-neutral-700 pl-2 my-2 line-clamp-2">
                      "{member.signature}"
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-2.5 border-t border-neutral-800 text-[10px] text-neutral-400 font-data flex items-center justify-between">
                  <span>{member.division.split('&')[0]}</span>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    DOSSIER <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
