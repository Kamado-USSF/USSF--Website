import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, Award, Users, Radio, Crosshair, Radar, 
  Terminal, Play, Pause, ChevronRight, ChevronLeft, Sparkles, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFView } from './USSFHeader';
import { USSFLogo } from './USSFLogo';

interface HeroSectionProps {
  onNavigate: (view: USSFView) => void;
  lang?: string;
}

export interface TheaterScene {
  id: string;
  name: string;
  badge: string;
  code: string;
  src: string;
  description: string;
  telemetry: {
    sector: string;
    threatLevel: string;
    temperature: string;
    wind: string;
    activeUnits: string;
  };
}

export const THEATER_SCENES: TheaterScene[] = [
  {
    id: 'desert_patrol',
    name: 'DESERT LONG-RANGE PATROL',
    badge: 'STAGE 01 // INTERDICTION',
    code: 'SEC-DESERT-44',
    src: '/src/assets/images/hero_tactical_desert_1790341915780.jpg',
    description: 'Heavy armored 50-cal gun-truck patrol executing long-range desert interdiction and vehicle intercepts across San Andreas borders.',
    telemetry: {
      sector: 'San Andreas Bone County · Sector 4',
      threatLevel: 'DEFCON 3 · ACTIVE PATROL',
      temperature: '38°C / 100°F (Arid Heat)',
      wind: '14 kts NNE · Dust Advisory',
      activeUnits: '4 Patrol Trucks · 12 Operators'
    }
  },
  {
    id: 'night_raid',
    name: 'URBAN NIGHT RAID ASSAULT',
    badge: 'STAGE 02 // NIGHT CQB',
    code: 'SEC-NIGHT-09',
    src: '/src/assets/images/hero_night_raid_1790347363090.jpg',
    description: 'Tactical night breach team advancing under cover of darkness with night vision gear, suppressed weapons, and armored convoy support.',
    telemetry: {
      sector: 'Los Santos Urban Corridor · Sector 2',
      threatLevel: 'DEFCON 2 · HIGH ALERT',
      temperature: '16°C / 61°F (Night Mist)',
      wind: '4 kts SW · Low Visibility',
      activeUnits: '2 Assault Groups · 1 BearCat'
    }
  },
  {
    id: 'morning_patrol',
    name: 'DAWN MOUNTAIN VALLEY PATROL',
    badge: 'STAGE 03 // MOUNTAIN RECON',
    code: 'SEC-DAWN-17',
    src: '/src/assets/images/hero_morning_patrol_1790422704024.jpg',
    description: 'Elite special forces operators marching through misty mountain passes at sunrise, backed by scout drones and high-mobility transport.',
    telemetry: {
      sector: 'Mount Chiliad Foothills · Sector 7',
      threatLevel: 'DEFCON 4 · ROUTINE SWEEP',
      temperature: '11°C / 52°F (Morning Dew)',
      wind: '6 kts W · Rising Fog',
      activeUnits: '6 Foot Recon · 2 Drones'
    }
  },
  {
    id: 'combined_arms',
    name: 'COMBINED ARMS JOINT ASSAULT',
    badge: 'STAGE 04 // FULL THEATER WAR',
    code: 'SEC-COMBINED-01',
    src: '/src/assets/images/combined_arms_assault_1790348050560.jpg',
    description: 'All-out special forces tactical offensive featuring infantry, battle tanks, loitering attack drones, Blackhawk helicopters, and air superiority fighter jets.',
    telemetry: {
      sector: 'Verdant Meadows Joint Air-Ground Sector',
      threatLevel: 'DEFCON 1 · COMBINED ENGAGEMENT',
      temperature: '24°C / 75°F (Combat Smoke)',
      wind: '19 kts NE · Aircraft Active',
      activeUnits: 'Tanks · Helicopters · Jets · 48 Operators'
    }
  },
  {
    id: 'cqb_breach',
    name: 'VERTICAL CQB STAIRWELL BREACH',
    badge: 'STAGE 05 // HIGH-RISK BREACH',
    code: 'SEC-BREACH-05',
    src: '/src/assets/images/scene_cqb_stairwell_breach_1790341945314.jpg',
    description: 'Methodical stairwell clearance, ballistic shield point-man positioning, and synchronized blind corner target designation.',
    telemetry: {
      sector: 'Los Santos Tower Complex · Interior',
      threatLevel: 'DEFCON 1 · CQB ENTRY',
      temperature: '21°C / 70°F',
      wind: '0 kts · Interior Funnel',
      activeUnits: '4 Breachers · 1 Shield Point'
    }
  },
  {
    id: 'night_recon',
    name: 'SUPPRESSED NIGHT RECONNAISSANCE',
    badge: 'STAGE 06 // SILENT INTEL',
    code: 'SEC-RECON-12',
    src: '/src/assets/images/scene_night_vision_recon_1790341968068.jpg',
    description: 'Deep woodland night observation using thermal optics and infrared lasers to track APB fugitives across perimeter borders.',
    telemetry: {
      sector: 'Flint County Woodlands · Sector 8',
      threatLevel: 'DEFCON 3 · COVERT OBS',
      temperature: '13°C / 55°F (Dense Fog)',
      wind: '5 kts SSE · Quiet',
      activeUnits: '2 Sniper-Recon Pairs'
    }
  },
  {
    id: 'skyward_extraction',
    name: '360° DEFENSIVE EXTRACTION',
    badge: 'STAGE 07 // HOT LZ DEFENSE',
    code: 'SEC-EXTRACT-33',
    src: '/src/assets/images/scene_skyward_circle_team_1790341985671.jpg',
    description: 'Circular defensive perimeter defense under heavy enemy fire waiting for tactical helicopter extraction and dust-off.',
    telemetry: {
      sector: 'San Fierro Harbor LZ · Point Bravo',
      threatLevel: 'DEFCON 1 · EXTRACTION INBOUND',
      temperature: '19°C / 66°F',
      wind: '22 kts W · Heavy Rotor Wash',
      activeUnits: '1 Extraction Team · 1 Blackhawk'
    }
  },
  {
    id: 'swamp_ops',
    name: 'AMPHIBIOUS SWAMP INFILTRATION',
    badge: 'STAGE 08 // WATER INGRESS',
    code: 'SEC-SWAMP-21',
    src: '/src/assets/images/scene_swamp_night_ops_1790341930336.jpg',
    description: 'Silent amphibious crossing through murky bayous with underwater rebreathers and collimated IR weapon lasers.',
    telemetry: {
      sector: 'Back O Beyond Wetlands · Sector 9',
      threatLevel: 'DEFCON 2 · AMBUSH PATROL',
      temperature: '18°C / 64°F (Swamp Mists)',
      wind: '2 kts Calm',
      activeUnits: '6 Amphibious Scouts'
    }
  },
  {
    id: 'tactical_hq',
    name: 'SPECIAL FORCES WAR COMMAND ROOM',
    badge: 'STAGE 09 // STRATEGY DECK',
    code: 'SEC-HQ-CENTRAL',
    src: '/src/assets/images/tactical_ops_hq_1790346770610.jpg',
    description: 'High Command operations floor monitoring live CIT2 radar pings, treasury disbursements, and unit status boards in real time.',
    telemetry: {
      sector: 'CIT2 Law Special Forces Command HQ',
      threatLevel: 'DEFCON 4 · COMMAND CONTROL',
      temperature: '20°C / 68°F (HVAC Secure)',
      wind: '0 kts Enclosed',
      activeUnits: 'High Command Staff · Satellite Comms'
    }
  },
  {
    id: 'assault_unit',
    name: 'ELITE APB STRIKE UNIT FORMATION',
    badge: 'STAGE 10 // UNIT DISCIPLINE',
    code: 'SEC-STRIKE-88',
    src: '/src/assets/images/special_forces_unit_1790346782492.jpg',
    description: 'Full tactical company deployment in black Mil-Spec armor prepared for statewide felony arrest operations across CIT2.',
    telemetry: {
      sector: 'San Andreas Joint Law Headquarters',
      threatLevel: 'DEFCON 2 · MOBILIZED SQUAD',
      temperature: '22°C / 72°F',
      wind: '8 kts ENE',
      activeUnits: '24 Operators · Full Loadout'
    }
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = React.useRef<number>(0);
  const touchEndX = React.useRef<number>(0);

  // Preload all 10 high-resolution theater images for instantaneous switching
  useEffect(() => {
    THEATER_SCENES.forEach(scene => {
      const img = new Image();
      img.src = scene.src;
    });
  }, []);

  // Continuous auto-rotation interval: ticks every 4.5 seconds reliably without being cancelled
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % THEATER_SCENES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentTheater = THEATER_SCENES[currentIndex];

  const handleSelectTheater = (index: number) => {
    tacticalAudio.playTacticalClick();
    setCurrentIndex(index);
  };

  const handleNext = () => {
    tacticalAudio.playTacticalClick();
    setCurrentIndex((prev) => (prev + 1) % THEATER_SCENES.length);
  };

  const handlePrev = () => {
    tacticalAudio.playTacticalClick();
    setCurrentIndex((prev) => (prev - 1 + THEATER_SCENES.length) % THEATER_SCENES.length);
  };

  const toggleAutoPlay = () => {
    tacticalAudio.playTacticalClick();
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext(); // Swiped left -> next
    } else if (distance < -minSwipeDistance) {
      handlePrev(); // Swiped right -> prev
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section 
      className="relative w-full overflow-hidden border-b border-neutral-800 bg-[#080a08] min-h-[580px] sm:min-h-[700px] lg:min-h-[760px] flex items-center select-none"
      aria-label="Special Forces Field Operations Hero Carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Background Image - HIGH CLARITY AND VIBRANCE */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentTheater.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={currentTheater.src}
              alt={currentTheater.name}
              className="h-full w-full object-cover object-center filter brightness-[0.92] contrast-110 saturate-[1.15]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gentle readable overlays - Leaves vehicles and soldiers clear and vibrant */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a08] via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 scanlines-overlay opacity-15 pointer-events-none" />
      </div>

      {/* Floating Left / Right Nav Arrows (Desktop & Tablet) */}
      <button
        onClick={handlePrev}
        aria-label="Previous operational theater"
        className="hidden md:flex absolute left-4 lg:left-6 z-20 h-11 w-11 items-center justify-center rounded-xl bg-black/70 border border-neutral-700/80 text-neutral-300 hover:text-white hover:border-amber-400 hover:bg-neutral-900 transition-all backdrop-blur-md shadow-2xl active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next operational theater"
        className="hidden md:flex absolute right-4 lg:right-6 z-20 h-11 w-11 items-center justify-center rounded-xl bg-black/70 border border-neutral-700/80 text-neutral-300 hover:text-white hover:border-amber-400 hover:bg-neutral-900 transition-all backdrop-blur-md shadow-2xl active:scale-95 cursor-pointer"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-16 sm:px-6 lg:px-8 w-full">
        {/* Top Kicker Bar with Status & Auto-play Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-data uppercase tracking-wider text-neutral-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 text-emerald-400 font-bold bg-black/85 border border-emerald-500/50 px-3 py-1 rounded-lg backdrop-blur-md shadow-lg">
              <USSFLogo size="sm" />
              <span>SPECIAL FORCES (USSF)</span>
            </span>
            <span className="text-neutral-500 hidden sm:inline">·</span>
            <span className="text-neutral-200 font-semibold bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur border border-neutral-800">
              CIT2 LAW GROUP · EST. 2019
            </span>
            <span className="text-neutral-500 hidden sm:inline">·</span>
            <span className="text-amber-400 font-bold flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur border border-amber-500/30">
              <Crosshair className="h-3.5 w-3.5" />
              <span>THEATER {currentIndex + 1 < 10 ? '0' : ''}{currentIndex + 1} / 10</span>
            </span>
          </div>

          {/* Auto-Rotation Controls & Progress Bar */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* 5-second countdown progress bar */}
            <div className="w-24 sm:w-32 h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-700 relative">
              {isAutoPlaying && (
                <motion.div
                  key={`progress-${currentIndex}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                  className="h-full bg-amber-400"
                />
              )}
              {!isAutoPlaying && (
                <div className="h-full bg-neutral-600 w-full" />
              )}
            </div>

            <button
              onClick={toggleAutoPlay}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 border border-neutral-700 text-[10px] font-bold text-neutral-300 hover:text-white hover:border-amber-400 transition-colors backdrop-blur-md cursor-pointer"
              title={isAutoPlaying ? "Pause image auto-rotation" : "Resume image auto-rotation"}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3 w-3 text-amber-400" />
                  <span>AUTO (5s)</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-emerald-400" />
                  <span>PAUSED</span>
                </>
              )}
            </button>

            {/* Mobile Prev / Next Buttons */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1 rounded bg-black/80 border border-neutral-700 text-neutral-300 hover:text-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded bg-black/80 border border-neutral-700 text-neutral-300 hover:text-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Theater Switcher Buttons (Horizontally scrollable on mobile, flex-wrap on desktop) */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
          {THEATER_SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => handleSelectTheater(idx)}
              className={`text-[11px] font-data px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 backdrop-blur-md ${
                currentIndex === idx
                  ? 'bg-amber-500 text-neutral-950 font-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                  : 'bg-black/80 text-neutral-300 hover:text-white border border-neutral-700/80 hover:border-neutral-500'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${currentIndex === idx ? 'bg-neutral-950' : 'bg-neutral-500'}`} />
              <span>0{idx + 1} {scene.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Main Title Block with Brotherhood Warmth and Tactical Heritage */}
        <div className="mt-6 space-y-3 sm:space-y-4">
          <div className="relative inline-block">
            {/* Visual Accent Corner Brackets */}
            <div className="absolute -top-3 -left-3 h-5 w-5 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute -bottom-3 -right-3 h-5 w-5 border-b-2 border-r-2 border-amber-500" />
            <div className="absolute -top-3 -right-3 h-3 w-3 border-t-2 border-r-2 border-amber-500/60" />
            <div className="absolute -bottom-3 -left-3 h-3 w-3 border-b-2 border-l-2 border-amber-500/60" />
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black font-tactical uppercase tracking-tight text-white drop-shadow-[0_12px_40px_rgba(0,0,0,1)]">
              TACTICAL
            </h1>
          </div>

          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black font-tactical uppercase tracking-tight text-white max-w-3xl drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
            SPECIAL FORCES CIT2 SQUADRON
          </h2>

          <div className="border-l-4 border-amber-500 pl-4 py-3 max-w-xl bg-black/85 backdrop-blur-md rounded-r-xl shadow-2xl border border-neutral-800 space-y-2">
            <p className="text-xs sm:text-sm font-sans font-bold italic text-amber-400">
              "May God Have Mercy Upon Our Enemies Cause We Won't"
            </p>
            <p className="text-[11px] font-data text-neutral-300 uppercase flex flex-wrap items-center gap-2">
              <span className="text-emerald-400 font-bold">{currentTheater.badge}</span>
              <span className="text-neutral-500">·</span>
              <span className="text-neutral-200 font-semibold">{currentTheater.code}</span>
            </p>
            <p className="text-xs font-sans text-neutral-200 leading-relaxed">
              {currentTheater.description}
            </p>
            <div className="pt-1.5 border-t border-neutral-800 text-[11px] font-sans text-neutral-400 flex items-center justify-between">
              <span>Founded June 30, 2019 · CIT2 Law Group</span>
              <span className="text-amber-400/90 font-medium">Level 4 Law Group</span>
            </div>
          </div>
        </div>

        {/* Live Theater Telemetry HUD Overlay (Responsive 3-column layout) */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl font-data text-[11px] bg-black/85 border border-neutral-700/80 p-3 sm:p-3.5 rounded-xl backdrop-blur-md shadow-2xl">
          <div className="border-l-2 border-amber-500 pl-2.5">
            <span className="text-neutral-400 uppercase text-[10px] block">OPERATIONAL STATUS</span>
            <div className="text-amber-400 font-bold truncate">{currentTheater.telemetry.threatLevel}</div>
          </div>
          <div className="border-l-2 border-cyan-500 pl-2.5">
            <span className="text-neutral-400 uppercase text-[10px] block">ATMOSPHERE</span>
            <div className="text-neutral-100 truncate">{currentTheater.telemetry.temperature}</div>
          </div>
          <div className="border-l-2 border-purple-500 pl-2.5">
            <span className="text-neutral-400 uppercase text-[10px] block">UNITS IN FIELD</span>
            <div className="text-emerald-400 font-bold truncate">{currentTheater.telemetry.activeUnits}</div>
          </div>
        </div>

        {/* Quick Action Buttons (Optimized for both Mobile touch & Desktop) */}
        <div className="mt-7 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              onNavigate('roster');
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-tactical font-black uppercase tracking-wider text-neutral-950 transition-all hover:bg-amber-400 active:scale-95 shadow-xl cursor-pointer hover:shadow-amber-500/30"
          >
            <span>VIEW OFFICIAL ROSTER</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              onNavigate('financial');
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/70 bg-black/85 px-5 py-3 text-xs font-tactical font-bold uppercase tracking-wider text-emerald-300 transition-all hover:bg-emerald-950/70 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
          >
            <span>FINANCIAL TASKS & BOUNTIES</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              onNavigate('career');
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-black/85 px-5 py-3 text-xs font-tactical font-bold uppercase tracking-wider text-neutral-200 transition-all hover:bg-neutral-800 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer hover:text-white"
          >
            <span>PROMOTION PATH (20 RANKS)</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              onNavigate('groupInfo');
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/50 bg-black/85 px-5 py-3 text-xs font-tactical font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-950/60 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
          >
            <span>GROUP INFORMATION (L4)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
