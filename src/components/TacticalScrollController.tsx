import React, { useEffect, useState, useRef } from 'react';
import { 
  Play, Pause, Compass, ArrowUp, ChevronDown, 
  ChevronsDown, Zap, Sliders, Shield, Volume2
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

interface TacticalScrollControllerProps {
  isAutoScrolling: boolean;
  onToggleAutoScroll: () => void;
  scrollSpeed: 'cinematic' | 'normal' | 'fast';
  onChangeSpeed: (speed: 'cinematic' | 'normal' | 'fast') => void;
}

export const TacticalScrollController: React.FC<TacticalScrollControllerProps> = ({
  isAutoScrolling,
  onToggleAutoScroll,
  scrollSpeed,
  onChangeSpeed
}) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // Section waypoints
  const waypoints = [
    { id: 'ussf-home', label: '01 / HOME', short: 'HOME' },
    { id: 'command-deck', label: '02 / COMMAND DECK', short: 'DECK' },
    { id: 'ussf-operations', label: '03 / OPERATIONS', short: 'OPS' },
    { id: 'ussf-roster', label: '04 / ROSTER', short: 'ROSTER' },
    { id: 'ussf-financial', label: '05 / REWARDS', short: 'PAYOUTS' },
    { id: 'ussf-career', label: '06 / CAREER', short: 'RANKS' },
    { id: 'mission-video', label: '07 / MISSION REEL', short: 'REEL' },
    { id: 'tactical-gear', label: '08 / GEAR & LAB', short: 'GEAR' }
  ];

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
        setScrollProgress(progress);
      }

      setShowScrollTop(currentScroll > 400);

      // Determine active section
      for (let i = waypoints.length - 1; i >= 0; i--) {
        const el = document.getElementById(waypoints[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(waypoints[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle continuous auto-scroll loop
  useEffect(() => {
    if (!isAutoScrolling) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    tacticalAudio.playRadioSquelch();

    // Speed in pixels per frame
    const speedMap = {
      cinematic: 1.2,
      normal: 2.5,
      fast: 4.8
    };
    const pixelsPerFrame = speedMap[scrollSpeed];

    const step = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 5) {
        tacticalAudio.playTargetLock();
        onToggleAutoScroll();
        return;
      }

      window.scrollBy({ top: pixelsPerFrame, behavior: 'instant' as ScrollBehavior });
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed, onToggleAutoScroll]);

  const scrollToElement = (id: string) => {
    tacticalAudio.playTacticalClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    tacticalAudio.playTacticalClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Viewport Top Tactical Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-neutral-900 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Floating Right Waypoint Navigator (Scroll Spy) */}
      <aside aria-label="Waypoint navigation" className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-1.5 p-2 bg-neutral-950/70 backdrop-blur-md rounded-xl border border-neutral-800/80 shadow-2xl">
        <div className="text-[9px] font-data text-neutral-500 uppercase tracking-widest px-2 py-0.5 border-b border-neutral-800/60 w-full text-right">
          WAYPOINTS
        </div>
        {waypoints.map((wp, idx) => {
          const isActive = activeSection === wp.id;
          return (
            <button
              key={wp.id}
              onClick={() => scrollToElement(wp.id)}
              className={`group flex items-center gap-2 px-2.5 py-1 rounded text-[11px] font-data transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60'
              }`}
              title={wp.label}
            >
              <span className={`text-[10px] ${isActive ? 'text-amber-400' : 'text-neutral-500'}`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="tracking-wider">{wp.short}</span>
              <span 
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  isActive ? 'bg-amber-400 scale-125 animate-pulse' : 'bg-neutral-700 group-hover:bg-neutral-400'
                }`}
              />
            </button>
          );
        })}
      </aside>

      {/* 3. Floating Bottom Scroll Control Deck */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 rounded-full border border-neutral-800 bg-[#0d0f0c]/90 shadow-2xl backdrop-blur-md">
        {/* Auto-Scroll Toggle Button */}
        <button
          onClick={onToggleAutoScroll}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-tactical uppercase tracking-wider transition-all cursor-pointer ${
            isAutoScrolling
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/30 animate-pulse'
              : 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800 border border-neutral-700/80 hover:border-amber-500/40'
          }`}
        >
          {isAutoScrolling ? (
            <>
              <Pause className="h-3.5 w-3.5 fill-current" />
              <span>PAUSE SCROLL</span>
            </>
          ) : (
            <>
              <Compass className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
              <span>AUTO SCROLL DOWN</span>
            </>
          )}
        </button>

        {/* Speed Selector (Active when auto-scrolling or hover) */}
        {isAutoScrolling && (
          <div className="flex items-center gap-1 bg-neutral-950/80 rounded-full px-2 py-1 border border-neutral-800 text-[10px] font-data">
            <span className="text-neutral-500 px-1">SPEED:</span>
            {(['cinematic', 'normal', 'fast'] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  onChangeSpeed(spd);
                }}
                className={`px-2 py-0.5 rounded-full uppercase transition-all ${
                  scrollSpeed === spd
                    ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {spd === 'cinematic' ? '0.5x' : spd === 'normal' ? '1x' : '2x'}
              </button>
            ))}
          </div>
        )}

        {/* Scroll Progress Readout */}
        <div className="px-3 py-1 text-[11px] font-data text-neutral-400 border-l border-neutral-800 tabular-nums">
          <span className="text-amber-400 font-bold">{Math.round(scrollProgress)}%</span>
        </div>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors border border-neutral-700/60"
            title="Scroll to top"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </>
  );
};
