import React, { useState } from 'react';
import { VideoPlayer15s } from './VideoPlayer15s';
import { VIDEO_SCENES } from '../data/tacticalContent';
import { BookOpen, Shield, Target, Radio, Award } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

export const VideoSection: React.FC = () => {
  const [activeTimestamp, setActiveTimestamp] = useState<number>(0);

  return (
    <section id="mission-video" className="relative w-full py-16 bg-[#0a0c0a] border-b border-neutral-800">
      {/* Background ambient military grid */}
      <div className="absolute inset-0 tactical-grid opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-500 mb-2">
            <BookOpen className="h-4 w-4" />
            <span>OPERATIONAL DOSSIER</span>
            <span aria-hidden="true" className="text-neutral-600">/</span>
            <span className="text-neutral-400">SPECIAL FORCES ENCYCLOPEDIA</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-tactical uppercase tracking-tight text-neutral-100">
            SPECIAL FORCES TACTICAL ENCYCLOPEDIA
          </h2>

          <p className="mt-3 text-sm text-neutral-300 max-w-2xl leading-relaxed font-sans">
            Special Forces doctrine and tactical field operations encyclopedia. Standard operating procedures across 4 synchronized scenarios: amphibious perimeter swamp infiltration with IR targeting laser beams, CQB vertical stairwell clearance, perimeter suppressed night reconnaissance, and 360-degree skyward group extraction.
          </p>
        </div>

        {/* 15-Second Cinematic Video Reel Player */}
        <div>
          <VideoPlayer15s onTimeUpdate={setActiveTimestamp} />
        </div>

        {/* Tactical Encyclopedia Text Briefings */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-tactical uppercase tracking-wider text-neutral-200 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>SPECIAL FORCES OPERATIONAL ENCYCLOPEDIA & DOCTRINE</span>
            </h3>
            <span className="text-xs font-data text-neutral-500">
              CIT2 LAW GROUP HIGH COMMAND STANDARDS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-data">
                <span className="text-amber-400 font-bold">THEATER 01 · AMPHIBIOUS & SWAMP</span>
                <span className="text-neutral-500">IR TARGETING</span>
              </div>
              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100">
                Low-Light Water & Swamp Infiltration
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Silent amphibious ingress using sub-surface rebreathers and collimated 850nm infrared laser emitters. Zero white-light signature maintained across contested wetlands to secure perimeter breach points.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-data">
                <span className="text-amber-400 font-bold">THEATER 02 · CQB & STAIRWELL</span>
                <span className="text-neutral-500">PIE SLICING</span>
              </div>
              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100">
                Vertical Close Quarters Battle (CQB)
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Methodical threshold evaluation, fatal-funnel management, and coordinated 360-degree corner clearance. Operators coordinate blind corner angles with precision laser target designation.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-data">
                <span className="text-amber-400 font-bold">THEATER 03 · PERIMETER RECON</span>
                <span className="text-neutral-500">SUPPRESSED NIGHT OPS</span>
              </div>
              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100">
                Perimeter Surveillance & Border Interception
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Suppressed tactical observation and border enforcement around high-risk zones. Continuous telemetry synchronization between group leaders and command dispatch for instant APB target tracking.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-data">
                <span className="text-amber-400 font-bold">THEATER 04 · SKYWARD EXTRACTION</span>
                <span className="text-neutral-500">360° DEFENSIVE EGRESS</span>
              </div>
              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100">
                Hot Zone Tactical Group Extraction
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Airborne helicopter landing zone (HLZ) defense with 360-degree suppression perimeter. Extraction signaling via secure IR beacon strobes visible exclusively through military night vision optics.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-data">
                <span className="text-amber-400 font-bold">THEATER 05 · DESERT INTERDICTION</span>
                <span className="text-neutral-500">50-CAL GUN-TRUCK PATROL</span>
              </div>
              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100">
                Long-Range Convoy & Border Intercept
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Heavy mechanized patrol deployed along desert highway corridors. High-caliber vehicle mounts provide kinetic interdiction against armored target convoys and APB felons.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-data">
                <span className="text-amber-400 font-bold">THEATER 06 · URBAN ARMORED CQB</span>
                <span className="text-neutral-500">BEARCAT NIGHT BREACH</span>
              </div>
              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100">
                Urban BearCat Dynamic Assault
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                High-threat dynamic warrant service executed under heavy armored cover. Synchronized flashbang charges, thermal infrared breach scans, and dynamic entries disorient barricaded hostiles.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-data">
                <span className="text-amber-400 font-bold">THEATER 07 · MOUNTAIN RECON</span>
                <span className="text-neutral-500">DAWN SCOUT & DRONES</span>
              </div>
              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100">
                High-Altitude Ridge Surveillance
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                High-mobility foot patrol traversing difficult mountain ridgelines at dawn. Handheld drone telemetry synchronized with CIT2 command HQ for early threat detection.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-data">
                <span className="text-amber-400 font-bold">THEATER 08 · COMBINED ARMS WAR</span>
                <span className="text-neutral-500">AIR SUPERIORITY & TANKS</span>
              </div>
              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100">
                Full-Theater Escalation & Ground Assault
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Maximum escalation protocol integrating heavy ground armor, loitering strike drones, close air support fighter jets, and tactical Blackhawk airborne insertions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
