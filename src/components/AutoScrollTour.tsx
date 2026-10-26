import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, X, Compass, ChevronDown } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

interface AutoScrollTourProps {
  isActive: boolean;
  onClose: () => void;
}

export const AutoScrollTour: React.FC<AutoScrollTourProps> = ({ isActive, onClose }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);

  const TOUR_DURATION = 15; // 15 seconds

  useEffect(() => {
    if (!isActive) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      startTimeRef.current = null;
      setSecondsRemaining(15);
      return;
    }

    tacticalAudio.playRadioSquelch();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const startScrollY = window.scrollY;

    const scrollLoop = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      if (isPaused) {
        animRef.current = requestAnimationFrame(scrollLoop);
        return;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const progress = Math.min(1, elapsed / TOUR_DURATION);
      const remaining = Math.max(0, TOUR_DURATION - elapsed);
      setSecondsRemaining(remaining);

      // Smooth cubic-bezier-like easing
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startScrollY + (maxScroll - startScrollY) * easeProgress);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(scrollLoop);
      } else {
        tacticalAudio.playTargetLock();
        onClose();
      }
    };

    animRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isActive, isPaused, onClose]);

  if (!isActive) return null;

  const progressPercent = ((TOUR_DURATION - secondsRemaining) / TOUR_DURATION) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg rounded-xl border border-amber-500/80 bg-neutral-950/95 p-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800 rounded-t-xl overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-xs font-data">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/20 text-amber-400 animate-pulse">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
              <span>15s CINEMATIC TOUR</span>
              <span className="text-amber-400 tabular-nums">
                ({secondsRemaining.toFixed(1)}s LEFT)
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 font-sans">
              Auto-navigating tactical systems & operational modules
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setIsPaused(!isPaused);
            }}
            className="flex items-center justify-center h-8 w-8 rounded border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white"
            title={isPaused ? 'Resume 15s Tour' : 'Pause Tour'}
          >
            {isPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
          </button>

          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              onClose();
            }}
            className="flex items-center justify-center h-8 w-8 rounded border border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white"
            title="Exit Tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
