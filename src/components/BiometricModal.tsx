import React, { useState, useEffect } from 'react';
import { Fingerprint, ShieldCheck, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tacticalAudio } from '../utils/audioSynth';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle
}) => {
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setScanStep('idle');
      setScanProgress(0);
    }
  }, [isOpen]);

  const handleStartScan = () => {
    tacticalAudio.playRadioSquelch();
    setScanStep('scanning');
    setScanProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setScanStep('verified');
        tacticalAudio.playTargetLock();
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setScanProgress(current);
      }
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-xl border border-emerald-500/50 bg-[#0d120e] p-6 shadow-2xl text-neutral-100 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-data text-emerald-400 uppercase tracking-widest font-bold">
                MIL-SPEC BIOMETRIC GATEWAY
              </div>
              <h3 className="text-sm font-tactical uppercase tracking-wider text-neutral-200">
                Identity Authentication
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-xs font-data px-2 py-1 border border-neutral-800 rounded cursor-pointer"
          >
            CANCEL
          </button>
        </div>

        {/* Action description */}
        <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-lg mb-6 text-xs text-neutral-300">
          <span className="text-neutral-500 font-data uppercase block text-[10px] mb-1">
            AUTHORIZED PROTOCOL
          </span>
          <p className="font-semibold text-neutral-100">{actionTitle}</p>
          <p className="text-[11px] text-neutral-400 mt-1">
            End-to-End Encrypted (AES-256). Biometric signature required to prevent unauthorized financial disbursement or credentials alteration.
          </p>
        </div>

        {/* Fingerprint / Facial Scanner UI */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring animation */}
            <div className={`absolute -inset-4 rounded-full border-2 border-dashed transition-all duration-500 ${
              scanStep === 'scanning' 
                ? 'border-emerald-400 animate-spin-slow opacity-100' 
                : scanStep === 'verified'
                ? 'border-emerald-500 opacity-60'
                : 'border-neutral-700 opacity-30'
            }`} />

            <div 
              onClick={scanStep === 'idle' ? handleStartScan : undefined}
              className={`h-24 w-24 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                scanStep === 'scanning'
                  ? 'bg-emerald-950/60 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                  : scanStep === 'verified'
                  ? 'bg-emerald-900/60 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.7)]'
                  : 'bg-neutral-900 border border-neutral-700 hover:border-amber-400 hover:bg-neutral-800'
              }`}
            >
              {scanStep === 'verified' ? (
                <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-in zoom-in" />
              ) : (
                <Fingerprint className={`h-12 w-12 transition-colors ${
                  scanStep === 'scanning' ? 'text-emerald-400 animate-pulse' : 'text-neutral-300'
                }`} />
              )}
            </div>
          </div>

          {/* Progress / Status */}
          <div className="mt-5 text-center font-data text-xs">
            {scanStep === 'idle' && (
              <p className="text-amber-400">Click sensor to scan Touch ID / Biometric Key</p>
            )}
            {scanStep === 'scanning' && (
              <div className="space-y-1">
                <p className="text-emerald-400 font-bold">Verifying Biometric Hash ({scanProgress}%)...</p>
                <div className="w-48 bg-neutral-800 h-1.5 rounded-full overflow-hidden mx-auto mt-2">
                  <div 
                    className="bg-emerald-400 h-full transition-all duration-150"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
            {scanStep === 'verified' && (
              <p className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>ACCESS GRANTED · IDENTITY CONFIRMED</span>
              </p>
            )}
          </div>
        </div>

        {/* Manual Prompt button */}
        {scanStep === 'idle' && (
          <button
            onClick={handleStartScan}
            className="w-full mt-3 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-tactical font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
          >
            AUTHENTICATE WITH BIOMETRICS
          </button>
        )}
      </div>
    </div>
  );
};
