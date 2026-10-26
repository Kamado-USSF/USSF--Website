import React, { useState } from 'react';
import { Play, Shield, Menu, X, Crosshair, Volume2, VolumeX } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

interface NavbarProps {
  onAutoTourClick: () => void;
  isTourActive: boolean;
  onOpenProcurement: () => void;
  onOpenPhpExport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onAutoTourClick, 
  isTourActive,
  onOpenProcurement
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    tacticalAudio.setMuted(nextState);
    if (!nextState) {
      tacticalAudio.playRadioSquelch();
    }
  };

  const handleNavClick = (anchorId: string) => {
    tacticalAudio.playTacticalClick();
    setMobileMenuOpen(false);
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element brand wordmark */}
        <a 
          href="#" 
          className="text-lg font-bold uppercase tracking-wider text-neutral-100 font-tactical hover:text-amber-400 transition-colors flex items-center gap-2"
          onClick={() => tacticalAudio.playTacticalClick()}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/10 border border-amber-500/40 text-amber-400">
            <Crosshair className="h-4 w-4" />
          </div>
          <span>SPECIAL FORCES TACTICAL</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-tactical tracking-wider text-neutral-300">
          <button 
            onClick={() => handleNavClick('mission-video')} 
            className="hover:text-amber-400 transition-colors cursor-pointer uppercase"
          >
            15s Mission Reel
          </button>
          <button 
            onClick={() => handleNavClick('ussf-operations')} 
            className="hover:text-amber-400 transition-colors cursor-pointer uppercase"
          >
            Field Operations
          </button>
          <button 
            onClick={() => handleNavClick('ussf-roster')} 
            className="hover:text-amber-400 transition-colors cursor-pointer uppercase"
          >
            Special Forces Roster
          </button>
          <button 
            onClick={() => handleNavClick('ussf-financial')} 
            className="hover:text-emerald-400 transition-colors cursor-pointer uppercase text-emerald-400 font-bold"
          >
            Financial Ledger
          </button>
          <button 
            onClick={() => handleNavClick('tactical-gear')} 
            className="hover:text-amber-400 transition-colors cursor-pointer uppercase"
          >
            Tactical Gear
          </button>
          <button 
            onClick={() => handleNavClick('beam-simulator')} 
            className="hover:text-amber-400 transition-colors cursor-pointer uppercase"
          >
            Beam Lab
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-data transition-colors ${
              isMuted
                ? 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                : 'border-emerald-600/40 bg-emerald-950/20 text-emerald-400'
            }`}
            title="Toggle Tactical Radio Audio"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            <span className="text-[11px] uppercase tracking-wider">{isMuted ? 'Muted' : 'Audio'}</span>
          </button>

          {/* 15s Auto-Tour Scroll Action */}
          <button
            onClick={onAutoTourClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-tactical tracking-wider rounded border transition-all ${
              isTourActive
                ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold animate-pulse'
                : 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-amber-500/50 hover:text-amber-300'
            }`}
            title="Auto-scroll entire website in 15 seconds"
          >
            <Play className={`h-3 w-3 fill-current ${isTourActive ? 'text-amber-400' : 'text-neutral-400'}`} />
            <span className="whitespace-nowrap">{isTourActive ? 'Tour (15s)' : '15s Tour'}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              onOpenProcurement();
            }}
            className="px-3.5 py-1.5 text-xs font-tactical tracking-wider font-semibold text-neutral-950 bg-amber-500 rounded hover:bg-amber-400 active:scale-95 transition-all whitespace-nowrap"
          >
            ARMORY
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-neutral-400 hover:text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3 font-tactical text-xs tracking-wider">
          <button 
            onClick={() => handleNavClick('mission-video')} 
            className="block w-full text-left py-1 text-neutral-300 hover:text-amber-400"
          >
            15S MISSION REEL
          </button>
          <button 
            onClick={() => handleNavClick('ussf-operations')} 
            className="block w-full text-left py-1 text-neutral-300 hover:text-amber-400"
          >
            SPECIAL FORCES FIELD OPERATIONS
          </button>
          <button 
            onClick={() => handleNavClick('ussf-roster')} 
            className="block w-full text-left py-1 text-neutral-300 hover:text-amber-400"
          >
            OFFICIAL ROSTER
          </button>
          <button 
            onClick={() => handleNavClick('ussf-financial')} 
            className="block w-full text-left py-1 text-emerald-400 font-bold"
          >
            FINANCIAL PAYOUT LEDGER ($80.5M)
          </button>
          <button 
            onClick={() => handleNavClick('tactical-gear')} 
            className="block w-full text-left py-1 text-neutral-300 hover:text-amber-400"
          >
            TACTICAL GEAR SOLUTIONS
          </button>
          <button 
            onClick={() => handleNavClick('beam-simulator')} 
            className="block w-full text-left py-1 text-neutral-300 hover:text-amber-400"
          >
            INTERACTIVE BEAM SIMULATOR
          </button>
        </div>
      )}
    </header>
  );
};
