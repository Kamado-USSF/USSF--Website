import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { USSFLogo } from './USSFLogo';
import { Shield, Terminal, Wifi, Lock, Radio, CheckCircle, ChevronRight } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

interface TacticalLoadingScreenProps {
  onLoaded: () => void;
  forceShow?: boolean;
}

export const TacticalLoadingScreen: React.FC<TacticalLoadingScreenProps> = ({
  onLoaded,
  forceShow = false
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [networkPing, setNetworkPing] = useState(24);
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    { text: 'ESTABLISHING SECURE GATEWAY TO CIT2 SATELLITE NODE...', icon: Wifi },
    { text: 'INITIALIZING AES-256 ENCRYPTED COMMAND PROTOCOL...', icon: Lock },
    { text: 'SYNCHRONIZING SPECIAL FORCES OFFICIAL ROSTER & CAREER TIERS...', icon: Shield },
    { text: 'FETCHING CIT2 LIVE RADAR & IN-GAME PATROL POSITIONS...', icon: Radio },
    { text: 'CLEARANCE GRANTED // WELCOME TO SPECIAL FORCES COMMAND.', icon: CheckCircle }
  ];

  useEffect(() => {
    // Check network speed if supported
    const nav = navigator as any;
    if (nav.connection) {
      const rtt = nav.connection.rtt || 28;
      setNetworkPing(rtt);
    }

    const startTime = performance.now();
    // Simulate real load based on network ping (1.8s - 2.8s)
    const totalDuration = Math.max(1800, Math.min(3000, 1600 + networkPing * 10));

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      setProgress(pct);

      if (pct < 25) setCurrentStep(0);
      else if (pct < 50) setCurrentStep(1);
      else if (pct < 75) setCurrentStep(2);
      else if (pct < 98) setCurrentStep(3);
      else setCurrentStep(4);

      if (pct >= 100) {
        clearInterval(interval);
        tacticalAudio.playRadioSquelch();
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(onLoaded, 400);
        }, 350);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [networkPing, onLoaded]);

  const handleSkip = () => {
    tacticalAudio.playTacticalClick();
    setIsFinished(true);
    setTimeout(onLoaded, 200);
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100000] bg-[#070907] text-neutral-100 flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* Tactical Background Scanlines & Camo Grid */}
          <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none" />
          <div className="absolute inset-0 tactical-grid opacity-25 pointer-events-none" />

          {/* Top Bar Diagnostics */}
          <div className="relative z-10 flex items-center justify-between text-xs font-data text-neutral-400 border-b border-neutral-800/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white uppercase tracking-wider">
                USSF SECURE BOOTLOADER v4.8
              </span>
              <span className="text-neutral-600 hidden sm:inline">|</span>
              <span className="text-emerald-400 font-mono hidden sm:inline">
                GATEWAY PING: {networkPing}ms
              </span>
            </div>

            <button
              onClick={handleSkip}
              className="text-xs font-tactical font-bold uppercase tracking-wider text-neutral-400 hover:text-amber-400 border border-neutral-800 hover:border-amber-500/50 px-3 py-1 rounded bg-neutral-900/80 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>FAST INGRESS [ESC]</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Center Emblem & High-Tech HUD Load Sequence */}
          <div className="relative z-10 max-w-xl mx-auto w-full text-center space-y-6 my-auto">
            {/* Pulsing USSF Crest */}
            <div className="relative inline-block">
              <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl animate-pulse" />
              <USSFLogo size="xl" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-black font-tactical uppercase tracking-wider text-white">
                SPECIAL FORCES COMMAND
              </h2>
              <p className="text-xs font-data uppercase tracking-widest text-amber-400">
                CIT2 LAW GROUP · OPERATIONAL HEADQUARTERS
              </p>
            </div>

            {/* Progress Percentage Gauge */}
            <div className="space-y-3 pt-2">
              <div className="flex items-end justify-between font-data text-xs">
                <span className="text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>INITIALIZING TACTICAL SYSTEM</span>
                </span>
                <span className="text-2xl font-tactical font-black text-amber-400 tabular-nums">
                  {progress}%
                </span>
              </div>

              {/* Glowing High-Tech Progress Bar */}
              <div className="h-2 w-full bg-neutral-950 rounded-full border border-neutral-800 overflow-hidden relative p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.7)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Real-Time Step Diagnostic Log */}
              <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/80 font-data text-xs text-neutral-300 text-left flex items-center gap-3">
                {(() => {
                  const CurrentIcon = steps[currentStep]?.icon || Shield;
                  return <CurrentIcon className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />;
                })()}
                <span className="truncate">{steps[currentStep]?.text}</span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-data text-neutral-500 border-t border-neutral-800/80 pt-4 gap-2">
            <div>
              SAN ANDREAS DEFENSE NETWORK · CIT2 LAW JURISDICTION
            </div>
            <div className="font-mono text-neutral-400">
              MOTTO: "MAY GOD HAVE MERCY UPON OUR ENEMIES CAUSE WE WON'T"
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
