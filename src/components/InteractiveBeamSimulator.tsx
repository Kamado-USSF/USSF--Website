import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Zap, Eye, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

type BeamMode = 'flood' | 'spot' | 'red' | 'ir' | 'strobe';

interface BeamConfig {
  id: BeamMode;
  name: string;
  lumens: string;
  spectrum: string;
  color: string;
  beamRadius: number;
  coneAngle: number;
  description: string;
}

const BEAM_MODES: BeamConfig[] = [
  {
    id: 'flood',
    name: '1,200 LM HIGH FLOOD',
    lumens: '1,200 Lumens',
    spectrum: 'Pure Neutral White (5000K)',
    color: '#ffffff',
    beamRadius: 260,
    coneAngle: 0.85,
    description: 'Expansive 120-degree wall-of-light for room clearing, dynamic search, and perimeter awareness.'
  },
  {
    id: 'spot',
    name: 'FOCUS TARGET SPOT',
    lumens: '650 Lumens (450m Throw)',
    spectrum: 'High-Candela Collimated (6000K)',
    color: '#fef08a',
    beamRadius: 360,
    coneAngle: 0.35,
    description: 'Pinpoint collimated beam cutting through dust, smoke, and tint for long-range target positive ID.'
  },
  {
    id: 'red',
    name: 'COVERT RED NAVIGATION',
    lumens: '45 Lumens',
    spectrum: '625nm Deep Red',
    color: '#ef4444',
    beamRadius: 180,
    coneAngle: 0.9,
    description: 'Maintains human eye dark-adaptation (rhodopsin protection) and avoids accidental light detection.'
  },
  {
    id: 'ir',
    name: '850nm COVERT IR BEACON',
    lumens: 'Invisible (NVG Only)',
    spectrum: '850nm Infrared',
    color: '#22c55e',
    beamRadius: 240,
    coneAngle: 0.75,
    description: 'Undetectable by unaided human vision; floods the target sector exclusively for Night Vision Goggles.'
  },
  {
    id: 'strobe',
    name: '18Hz TACTICAL STROBE',
    lumens: '1,200 LM Pulsed',
    spectrum: 'Disorienting Flash',
    color: '#ffffff',
    beamRadius: 280,
    coneAngle: 0.8,
    description: 'High-frequency disorienting flash designed to disrupt threat peripheral vision during CQB entry.'
  }
];

export const InteractiveBeamSimulator: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<BeamMode>('flood');
  const [powerActive, setPowerActive] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 300, y: 180 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);

  const activeConfig = BEAM_MODES.find(b => b.id === selectedMode) || BEAM_MODES[0];

  const handleModeChange = (mode: BeamMode) => {
    tacticalAudio.playTacticalClick();
    if (mode === 'ir') {
      tacticalAudio.playNvgPower();
    } else if (mode === 'strobe') {
      tacticalAudio.playTargetLock();
    }
    setSelectedMode(mode);
  };

  const togglePower = () => {
    tacticalAudio.playTacticalClick();
    setPowerActive(!powerActive);
  };

  // Render interactive darkroom target sector
  const drawBeam = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Base pitch-black tactical room
    ctx.fillStyle = '#060606';
    ctx.fillRect(0, 0, width, height);

    // Draw background hidden tactical objects (crates, target silhouette, door frame)
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    // Crates
    ctx.strokeRect(80, height - 120, 100, 100);
    ctx.strokeRect(width - 160, height - 140, 110, 120);
    // Doorway
    ctx.strokeRect(width / 2 - 50, height - 180, 100, 160);
    // Silhouette target
    ctx.beginPath();
    ctx.arc(width / 2, height - 140, 18, 0, Math.PI * 2); // Head
    ctx.stroke();
    ctx.strokeRect(width / 2 - 25, height - 120, 50, 70); // Torso

    if (powerActive) {
      const { x, y } = mousePos;

      // Strobe blinking logic
      let shouldDrawLight = true;
      if (selectedMode === 'strobe') {
        shouldDrawLight = Math.floor(timestamp / 55) % 2 === 0;
      }

      if (shouldDrawLight) {
        ctx.save();

        // Beam gradient
        const radius = activeConfig.beamRadius;
        const grad = ctx.createRadialGradient(x, y, 10, x, y, radius);

        if (selectedMode === 'flood') {
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          grad.addColorStop(0.3, 'rgba(255, 255, 240, 0.6)');
          grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (selectedMode === 'spot') {
          grad.addColorStop(0, 'rgba(254, 240, 138, 1)');
          grad.addColorStop(0.2, 'rgba(250, 204, 21, 0.7)');
          grad.addColorStop(0.5, 'rgba(234, 179, 8, 0.15)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (selectedMode === 'red') {
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.95)');
          grad.addColorStop(0.4, 'rgba(220, 38, 38, 0.5)');
          grad.addColorStop(0.8, 'rgba(185, 28, 28, 0.15)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (selectedMode === 'ir') {
          // NVG Phosphor Green
          grad.addColorStop(0, 'rgba(34, 197, 94, 0.85)');
          grad.addColorStop(0.4, 'rgba(22, 163, 74, 0.45)');
          grad.addColorStop(0.8, 'rgba(21, 128, 61, 0.1)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (selectedMode === 'strobe') {
          grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
          grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight illuminated target details under light
        ctx.strokeStyle = activeConfig.color;
        ctx.lineWidth = 2;
        // If beam hits center silhouette
        const distToTarget = Math.hypot(x - width / 2, y - (height - 120));
        if (distToTarget < radius * 0.7) {
          ctx.strokeRect(width / 2 - 25, height - 120, 50, 70);
          ctx.beginPath();
          ctx.arc(width / 2, height - 140, 18, 0, Math.PI * 2);
          ctx.stroke();

          // Target reticle
          ctx.strokeStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(width / 2, height - 110, 12, 0, Math.PI * 2);
          ctx.moveTo(width / 2 - 16, height - 110);
          ctx.lineTo(width / 2 + 16, height - 110);
          ctx.moveTo(width / 2, height - 126);
          ctx.lineTo(width / 2, height - 94);
          ctx.stroke();

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('TARGET LOCK // 18m', width / 2 - 40, height - 165);
        }

        ctx.restore();
      }
    }

    // Grid marks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 80) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }

    animRef.current = requestAnimationFrame(drawBeam);
  }, [mousePos, powerActive, selectedMode, activeConfig]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(drawBeam);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [drawBeam]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    setMousePos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    setMousePos({
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    });
  };

  return (
    <section id="beam-simulator" className="relative w-full py-16 bg-neutral-950 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400 mb-2">
            <Zap className="h-3.5 w-3.5" />
            <span>OPTICAL ENGINEERING & TESTING</span>
            <span aria-hidden="true" className="text-neutral-600">/</span>
            <span className="text-neutral-400">TACTICAL BEAM SIMULATOR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-tactical uppercase tracking-tight text-neutral-100">
            INTERACTIVE BEAM & WAVELENGTH LAB
          </h2>

          <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
            Test Princeton-Tec-class tactical emitters in real-time. Drag your cursor across the zero-light CQB sector 
            to test beam throw, peripheral spill, covert red spectrum, and NVG-safe infrared illuminations.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Canvas Screen */}
          <div className="lg:col-span-8 rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-data">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${powerActive ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
                <span className="text-neutral-300 font-bold uppercase">{activeConfig.name}</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-400">{activeConfig.lumens}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePower}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border transition-colors ${
                    powerActive 
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300' 
                      : 'border-neutral-700 bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {powerActive ? 'BEAM ON' : 'BEAM OFF'}
                </button>
                <span className="hidden sm:inline text-neutral-500">MOVE CURSOR TO AIM</span>
              </div>
            </div>

            <div className="relative aspect-video w-full cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="h-full w-full object-cover"
              />

              {!isHovered && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="rounded border border-neutral-700 bg-neutral-900/80 px-3 py-1.5 text-xs font-data text-neutral-300 backdrop-blur-sm">
                    AIM CURSOR HERE TO SWEEP LIGHT BEAM
                  </div>
                </div>
              )}
            </div>

            {/* Live Beam Telemetry Footer */}
            <div className="border-t border-neutral-800 bg-neutral-900/60 px-4 py-3 text-xs font-data text-neutral-400 flex flex-wrap items-center justify-between gap-4">
              <div>SPECTRUM: <span className="text-neutral-200">{activeConfig.spectrum}</span></div>
              <div>BEAM ANGLE: <span className="text-neutral-200">{(activeConfig.coneAngle * 100).toFixed(0)}° SPREAD</span></div>
              <div>DARK ADAPTATION: <span className={selectedMode === 'red' || selectedMode === 'ir' ? 'text-emerald-400' : 'text-neutral-200'}>
                {selectedMode === 'red' ? '100% PRESERVED' : selectedMode === 'ir' ? 'ZERO SIGNATURE' : 'HIGH INTENSITY'}
              </span></div>
            </div>
          </div>

          {/* Right: Mode Selector & Technical Details */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-tactical uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-amber-400" />
              <span>SELECT EMITTER BEAM MODE</span>
            </h3>

            <div className="space-y-2">
              {BEAM_MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-neutral-100 shadow-sm ring-1 ring-amber-500/50'
                        : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-data mb-1">
                      <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-neutral-300'}`}>
                        {mode.name}
                      </span>
                      <span className="text-neutral-500">{mode.lumens}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-normal">
                      {mode.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Tactical Pro-Tip Box */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-xs font-sans text-neutral-400 space-y-2">
              <div className="font-data text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>FIELD DOCTRINE TIP</span>
              </div>
              <p>
                In high-threat environments, avoid toggling white light first. Our MPLS helmet systems are engineered to always initialize in covert red or IR wavelengths unless purposefully override-toggled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
