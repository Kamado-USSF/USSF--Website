import React, { useState } from 'react';
import { Shield, Clock, Users, ArrowRight, PlusCircle, CheckCircle, FileText, Filter, Radio, Target, Terminal, Eye, ExternalLink } from 'lucide-react';
import { FieldReport } from '../data/ussfData';
import { USSFView } from './USSFHeader';
import { tacticalAudio } from '../utils/audioSynth';

interface USSFOperationsViewProps {
  onNavigate: (view: USSFView) => void;
  reports: FieldReport[];
  onOpenReportModal: () => void;
}

export const USSFOperationsView: React.FC<USSFOperationsViewProps> = ({
  onNavigate,
  reports,
  onOpenReportModal
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'Patrol' | 'Training'>('ALL');

  const filteredReports = filterType === 'ALL'
    ? reports
    : reports.filter(r => r.type === filterType);

  const totalPatrols = reports.filter(r => r.type === 'Patrol').length;
  const totalTrainings = reports.filter(r => r.type === 'Training').length;
  const totalHours = reports.reduce((acc, r) => acc + r.durationHours, 0);

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-16">
      {/* High-Impact Tactical Operations HQ Hero Banner */}
      <div className="relative w-full overflow-hidden border-b border-neutral-800 bg-[#0c100d]">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/tactical_ops_hq_1790346770610.jpg"
            alt="Special Forces Tactical Operations Center"
            className="h-full w-full object-cover object-center filter brightness-40 contrast-125 saturate-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a08] via-[#080a08]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a08] via-[#080a08]/80 to-transparent" />
          <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-data uppercase tracking-widest text-neutral-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SPECIAL FORCES
                </span>
                <span className="text-neutral-600">/</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5 text-amber-400" />
                  FIELD OPERATIONS & PATROLS
                </span>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-300">CIT2 LAW SECTOR</span>
              </div>

              <div className="relative inline-block">
                <div className="absolute -top-2 -left-2 h-4 w-4 border-t-2 border-l-2 border-amber-500" />
                <div className="absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-amber-500" />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-tactical uppercase tracking-tight text-white drop-shadow-lg">
                  Field Operations
                </h1>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl">
                Publish authentic records of frontline patrols, live-fire drills, and tactical urban clearance sessions. The publisher, host, and participating group members are securely tracked and logged under CIT2 standards.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    onOpenReportModal();
                  }}
                  className="px-5 py-2.5 rounded bg-neutral-100 text-neutral-950 font-tactical font-black text-xs uppercase tracking-wider hover:bg-white active:scale-95 transition-all flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-600" />
                  <span>PUBLISH REPORT</span>
                </button>

                <button
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    onNavigate('financial');
                  }}
                  className="px-4 py-2.5 rounded border border-neutral-700 bg-neutral-900/80 backdrop-blur text-neutral-200 font-tactical font-bold text-xs uppercase tracking-wider hover:border-emerald-500/60 hover:text-emerald-300 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>CLAIM REWARDS</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Tactical Telemetry Card */}
            <div className="rounded-xl border border-neutral-800 bg-[#121612]/90 backdrop-blur p-5 lg:min-w-[280px] shrink-0 space-y-3">
              <div className="flex items-center justify-between text-xs font-data text-neutral-400 border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SATCOM FEED
                </span>
                <span className="text-neutral-500">LIVE // SEC-04</span>
              </div>
              <div className="text-2xl font-bold font-data text-neutral-100 flex items-baseline justify-between">
                <span>TOTAL LOGS</span>
                <span className="text-3xl text-amber-400 tabular-nums">{String(reports.length).padStart(2, '0')}</span>
              </div>
              <div className="text-[11px] font-data text-neutral-400 space-y-1">
                <div className="flex justify-between">
                  <span>DISPATCH SYSTEM:</span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>VERIFICATION:</span>
                  <span className="text-neutral-200">F5 + PHONE CLOCK</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stat Boxes */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-4 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
              <div className="text-3xl font-bold font-data text-neutral-100 tabular-nums">
                {reports.length}
              </div>
              <div className="text-[11px] font-data text-neutral-400 uppercase mt-1 flex items-center gap-1">
                <FileText className="h-3 w-3 text-amber-400" />
                TOTAL REPORTS
              </div>
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-500/30" />
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="text-3xl font-bold font-data text-neutral-100 tabular-nums">
                {totalPatrols}
              </div>
              <div className="text-[11px] font-data text-neutral-400 uppercase mt-1 flex items-center gap-1">
                <Radio className="h-3 w-3 text-emerald-400" />
                PATROLS
              </div>
              <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500/30" />
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-4 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="text-3xl font-bold font-data text-neutral-100 tabular-nums">
                {totalTrainings}
              </div>
              <div className="text-[11px] font-data text-neutral-400 uppercase mt-1 flex items-center gap-1">
                <Target className="h-3 w-3 text-blue-400" />
                TRAININGS
              </div>
              <div className="absolute top-0 right-0 w-1 h-full bg-blue-500/30" />
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-4 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
              <div className="text-3xl font-bold font-data text-neutral-100 tabular-nums">
                {totalHours.toFixed(1)}h
              </div>
              <div className="text-[11px] font-data text-neutral-400 uppercase mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-400" />
                FIELD HOURS
              </div>
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-500/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Section: FIELD ARCHIVES - Recent reports */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            <div>
              <div className="text-[11px] font-data text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <span>FIELD ARCHIVES</span>
                <span>//</span>
                <span className="text-amber-500 font-semibold">AUTHENTIC CIT2 LOGS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-tactical uppercase text-neutral-100">
                Recent Mission Reports
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 p-1 text-xs font-data">
              {(['ALL', 'Patrol', 'Training'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    setFilterType(t);
                  }}
                  className={`px-3 py-1 rounded transition-colors uppercase cursor-pointer ${
                    filterType === t
                      ? 'bg-neutral-800 text-neutral-100 font-bold border border-neutral-700'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-data text-emerald-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SPECIAL FORCES DISPATCH DATABASE // ONLINE</span>
          </div>

          {/* List of Reports */}
          {filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 hover:border-neutral-700 transition-all hover:bg-neutral-900/70 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs font-data">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rep.type === 'Patrol' ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' : 'bg-blue-950 border border-blue-500/40 text-blue-300'
                      }`}>
                        {rep.type}
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-300 font-semibold">HOST: {rep.hostName} ({rep.hostCid})</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-neutral-500" />
                        {rep.durationHours} HOURS
                      </span>
                      <span>·</span>
                      <span>{rep.date}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-tactical uppercase text-neutral-100">
                    {rep.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                    {rep.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-data text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-neutral-500" />
                      <span>SQUAD PARTICIPANTS: {rep.participants.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {rep.proofLink && (
                        <a
                          href={rep.proofLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>PROOF LINK</span>
                        </a>
                      )}
                      <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                        <CheckCircle className="h-3.5 w-3.5" />
                        COMMAND VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 rounded-xl border border-neutral-800 bg-neutral-900/30 text-center text-xs font-data text-neutral-500">
              No field reports found for this filter.
            </div>
          )}
        </div>

        {/* OPERATIONS CENTER & FINANCIAL LINK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Card 1: Publish a field report */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors">
            <div>
              <div className="text-xs font-data text-amber-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5" />
                <span>OPERATIONS CENTER</span>
              </div>
              <h3 className="text-2xl font-bold font-tactical uppercase text-neutral-100">
                Publish a field report.
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed">
                Open the publisher dialog to log a live CIT2 patrol or tactical training. Enter the host, roster participants, duration hours, and unedited screenshot proof.
              </p>
            </div>

            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onOpenReportModal();
              }}
              className="w-fit px-5 py-2.5 rounded bg-neutral-100 text-neutral-950 font-tactical font-bold text-xs uppercase tracking-wider hover:bg-white active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>CREATE REPORT</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 2: Financial Link */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
            <div>
              <div className="text-xs font-data text-emerald-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                <span>FINANCIAL LINK</span>
              </div>
              <h3 className="text-2xl font-bold font-tactical uppercase text-neutral-100">
                Participation is recorded.
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed">
                Published attendance and hosted patrols automatically qualify group members for weekly and daily rewards in the Financial Department.
              </p>
            </div>

            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onNavigate('financial');
              }}
              className="w-fit px-5 py-2.5 rounded border border-neutral-700 bg-neutral-900 text-neutral-200 font-tactical font-bold text-xs uppercase tracking-wider hover:border-neutral-500 hover:text-white active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>OPEN FINANCIAL LEDGER</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
