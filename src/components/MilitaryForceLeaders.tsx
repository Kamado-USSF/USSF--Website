import React, { useState } from 'react';
import { FORCE_PILLARS, ForcePillar } from '../data/tacticalContent';
import { Shield, Award, Users, ChevronRight, CheckCircle, Crosshair, Star } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

export const MilitaryForceLeaders: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<ForcePillar | null>(null);

  return (
    <section id="military-leaders" className="relative w-full py-16 bg-neutral-950 border-b border-neutral-800 camo-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Military Force Banner (Inspired by Screenshot 37 Top Bar & Banner) */}
        <div className="rounded-xl border border-neutral-800 bg-[#161a14]/90 p-6 md:p-8 mb-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Olive Drab / Camo Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-600 to-emerald-700" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-emerald-400">
                <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                <span>MILITARY DEFENSE FORCE · DOCTRINE OF PREPAREDNESS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-tactical uppercase tracking-tight text-neutral-100">
                THE NATION IS STRONG WITH A PREPARED FORCE
              </h2>

              <p className="text-sm text-neutral-300 font-sans leading-relaxed max-w-2xl">
                True defense capability requires uncompromising leadership, mental resilience, and mastery of 
                both equipment and squad dynamics. We equip modern defense institutions with the battle-tested 
                frameworks to develop officers and operators of the highest echelon.
              </p>

              {/* 2-Zone Briefing Links (Screenshot 37 "How to start military education / becoming an officer") */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-800/80">
                <div className="space-y-1">
                  <div className="text-xs font-tactical uppercase tracking-wider text-amber-400 font-bold">
                    HOW TO INITIATE TACTICAL READINESS
                  </div>
                  <p className="text-xs text-neutral-400">
                    Comprehensive training syllabi covering nighttime illumination doctrine, light discipline, and rapid situational awareness.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-tactical uppercase tracking-wider text-amber-400 font-bold">
                    BECOMING A TACTICAL COMMAND OFFICER
                  </div>
                  <p className="text-xs text-neutral-400">
                    Rigorous operational decision matrices developed for tier-one units facing asymmetric urban and wilderness battlefields.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Officer Image Frame */}
            <div className="lg:col-span-4">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl">
                <img
                  src="/src/assets/images/military_leader_training_1790341999734.jpg"
                  alt="Military Special Force Operator in Desert Post"
                  className="h-full w-full object-cover filter contrast-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 p-3 text-xs font-data text-neutral-200">
                  <span className="text-amber-400 font-bold">DOCTRINE:</span> SPECIAL RECON COMMAND
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading: CREATING MILITARY LEADERS (Screenshot 37) */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400 mb-2">
            <Award className="h-4 w-4" />
            <span>OPERATIONAL EXCELLENCE PILLARS</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold font-tactical uppercase tracking-tight text-neutral-100">
            CREATING MILITARY LEADERS
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            It is our obligation to bring out courage and competence in every frontline defender.
          </p>
        </div>

        {/* 3 Pillar Cards (Screenshot 37 3-Column Layout: Teamwork, Discipline, Education) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FORCE_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setSelectedPillar(pillar);
              }}
              className="group cursor-pointer overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition-all hover:border-amber-500/70 hover:bg-neutral-900 hover:shadow-xl"
            >
              {/* Photo preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-800 mb-4 bg-neutral-950">
                <img
                  src={pillar.imageSrc}
                  alt={pillar.title}
                  className="h-full w-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 rounded bg-neutral-900/80 px-2 py-0.5 text-[10px] font-data text-amber-400 border border-neutral-700">
                  PILLAR {pillar.pillarNumber}
                </div>
              </div>

              {/* Title & Badge */}
              <div className="text-[11px] font-data text-emerald-400 font-bold uppercase tracking-wider mb-1">
                {pillar.badge}
              </div>

              <h4 className="text-base font-bold font-tactical uppercase text-neutral-100 group-hover:text-amber-300 transition-colors">
                {pillar.title}
              </h4>

              <p className="mt-2 text-xs text-neutral-400 line-clamp-3 font-sans leading-relaxed">
                {pillar.description}
              </p>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-tactical text-amber-400">
                <span>VIEW TRAINING MODULE</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillar Detail Modal */}
      {selectedPillar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-400" />
                <h4 className="text-lg font-bold font-tactical uppercase text-neutral-100">
                  {selectedPillar.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPillar(null)}
                className="text-neutral-400 hover:text-white text-xs font-data px-2 py-1 border border-neutral-700 rounded"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-semibold text-neutral-200">
                {selectedPillar.headline}
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {selectedPillar.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="text-xs font-data text-amber-400 uppercase font-bold">
                  CORE EVALUATION CRITERIA:
                </div>
                {selectedPillar.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-sans">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
