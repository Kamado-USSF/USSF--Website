import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, 
  Eye, Download, Crosshair, ShieldAlert, Radio, Compass, Sparkles
} from 'lucide-react';
import { VIDEO_SCENES, VideoScene } from '../data/tacticalContent';
import { tacticalAudio } from '../utils/audioSynth';

export type VisionMode = 'standard' | 'nvg' | 'flir' | 'mono';

interface VideoPlayer15sProps {
  onTimeUpdate?: (currentTime: number) => void;
  autoPlayOnMount?: boolean;
}

export const VideoPlayer15s: React.FC<VideoPlayer15sProps> = ({ 
  onTimeUpdate,
  autoPlayOnMount = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlayOnMount);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [visionMode, setVisionMode] = useState<VisionMode>('standard');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showHud, setShowHud] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});

  // Animation frame reference
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const activeSceneIndexRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Preload scene images
  useEffect(() => {
    const images: Record<string, HTMLImageElement> = {};
    let loadedCount = 0;

    VIDEO_SCENES.forEach((scene) => {
      const img = new Image();
      img.src = scene.imageSrc;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        images[scene.id] = img;
        loadedCount++;
        if (loadedCount === VIDEO_SCENES.length) {
          setLoadedImages(images);
        }
      };
      img.onerror = () => {
        // Fallback placeholder if image load fails
        loadedCount++;
        if (loadedCount === VIDEO_SCENES.length) {
          setLoadedImages(images);
        }
      };
    });

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Determine current active scene
  const currentScene = VIDEO_SCENES.find(
    s => currentTime >= s.startTime && currentTime <= s.endTime
  ) || VIDEO_SCENES[0];

  const currentSceneIndex = VIDEO_SCENES.findIndex(s => s.id === currentScene.id);

  // Play audio cues when scene changes
  useEffect(() => {
    if (isPlaying && currentSceneIndex !== activeSceneIndexRef.current) {
      activeSceneIndexRef.current = currentSceneIndex;
      tacticalAudio.playRadioSquelch();
      tacticalAudio.playImpactDrop();
    }
  }, [currentSceneIndex, isPlaying]);

  // Main canvas render loop
  const renderFrame = useCallback((now: number) => {
    const delta = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    if (isPlaying) {
      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= 32.0) {
          // Loop seamlessly across all 8 operational scenes
          tacticalAudio.playRadioSquelch();
          return 0;
        }
        if (onTimeUpdate) {
          onTimeUpdate(next);
        }
        return next;
      });
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        // Find current scene
        const scene = VIDEO_SCENES.find(
          s => currentTime >= s.startTime && currentTime <= s.endTime
        ) || VIDEO_SCENES[0];

        const sceneProgress = Math.max(0, Math.min(1, (currentTime - scene.startTime) / (scene.endTime - scene.startTime)));
        const img = loadedImages[scene.id];

        ctx.save();

        // 1. Camera Motion (Pan, Zoom, Tilt)
        let scale = 1.0;
        let offsetX = 0;
        let offsetY = 0;

        if (scene.cameraMotion === 'push-in') {
          scale = 1.05 + sceneProgress * 0.12;
        } else if (scene.cameraMotion === 'pan-left') {
          scale = 1.15;
          offsetX = -sceneProgress * 40;
        } else if (scene.cameraMotion === 'drift-up') {
          scale = 1.12;
          offsetY = -sceneProgress * 35;
        } else if (scene.cameraMotion === 'dolly-zoom') {
          scale = 1.02 + Math.sin(sceneProgress * Math.PI) * 0.08;
        }

        ctx.translate(width / 2, height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-width / 2 + offsetX, -height / 2 + offsetY);

        // Draw image with proper aspect-ratio preserving cover calculation so images never stretch or squash
        if (img && img.complete && img.naturalWidth > 0) {
          const imgRatio = img.naturalWidth / img.naturalHeight;
          const canvasRatio = width / height;
          let drawW = width;
          let drawH = height;
          let dx = 0;
          let dy = 0;
          if (imgRatio > canvasRatio) {
            drawW = height * imgRatio;
            dx = (width - drawW) / 2;
          } else {
            drawH = width / imgRatio;
            dy = (height - drawH) / 2;
          }
          ctx.drawImage(img, dx, dy, drawW, drawH);
        } else {
          // Stylish fallback gradient if image loading
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#1c1917');
          grad.addColorStop(1, '#0a0a0a');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.restore();

        // 2. Scene-Specific Dynamic Visual FX
        if (scene.id === 'swamp-ops') {
          // Swamp Rain Effect
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 1;
          const seed = Math.floor(now / 50);
          for (let i = 0; i < 60; i++) {
            const rx = (Math.sin(i * 99 + seed) * 0.5 + 0.5) * width;
            const ry = ((i * 37 + now * 0.8) % height);
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx - 4, ry + 16);
            ctx.stroke();
          }

          // Red Infrared Laser Targeting Line (Reference Image 3)
          const laserY = height * 0.55 + Math.sin(now * 0.003) * 6;
          const laserPulse = 0.7 + Math.sin(now * 0.015) * 0.3;
          ctx.strokeStyle = `rgba(239, 68, 68, ${laserPulse * 0.85})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, laserY);
          ctx.lineTo(width * 0.78, laserY - 10);
          ctx.stroke();

          // Laser impact dot glow
          const dotX = width * 0.78;
          const dotY = laserY - 10;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
          ctx.beginPath();
          ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.beginPath();
          ctx.arc(dotX, dotY, 14, 0, Math.PI * 2);
          ctx.fill();
        } else if (scene.id === 'cqb-breach') {
          // Sweeping tactical weapon light cone (Reference Image 2)
          const sweepAngle = Math.sin(now * 0.002) * 0.15;
          const grad = ctx.createRadialGradient(
            width * 0.45, height * 0.6, 10,
            width * 0.45 + sweepAngle * 200, height * 0.6, width * 0.6
          );
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
          grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.08)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        } else if (scene.id === 'nvg-recon') {
          // Night Vision Noise & Target Crosshair Box (Reference Image 4)
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.75)';
          ctx.lineWidth = 1.5;
          const boxX = width * 0.52;
          const boxY = height * 0.44;
          const boxSize = 70;
          // Reticle brackets
          ctx.strokeRect(boxX - boxSize / 2, boxY - boxSize / 2, boxSize, boxSize);
          ctx.beginPath();
          ctx.moveTo(boxX - 10, boxY);
          ctx.lineTo(boxX + 10, boxY);
          ctx.moveTo(boxX, boxY - 10);
          ctx.lineTo(boxX, boxY + 10);
          ctx.stroke();

          // Range readout
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#22c55e';
          ctx.fillText('RNG 342m', boxX + boxSize / 2 + 8, boxY);
          ctx.fillText('TRK LOCK', boxX + boxSize / 2 + 8, boxY + 14);
        } else if (scene.id === 'skyward-exfil') {
          // Extraction Beacon Strobe Pulse (Reference Image 1)
          const strobe = (Math.sin(now * 0.01) > 0.75) ? 0.35 : 0.05;
          ctx.fillStyle = `rgba(245, 158, 11, ${strobe})`;
          ctx.fillRect(0, 0, width, height);
        }

        // 3. Vision Mode Color Transformation
        if (visionMode === 'nvg') {
          // Green Phosphor Night Vision
          ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
          ctx.globalCompositeOperation = 'color';
          ctx.fillRect(0, 0, width, height);

          // Phosphor tube circular vignette
          ctx.globalCompositeOperation = 'multiply';
          const tubeVignette = ctx.createRadialGradient(
            width / 2, height / 2, width * 0.28,
            width / 2, height / 2, width * 0.65
          );
          tubeVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
          tubeVignette.addColorStop(1, 'rgba(0, 20, 5, 0.95)');
          ctx.fillStyle = tubeVignette;
          ctx.fillRect(0, 0, width, height);

          // Reset composite operation
          ctx.globalCompositeOperation = 'source-over';
        } else if (visionMode === 'flir') {
          // FLIR White-Hot Thermal
          ctx.globalCompositeOperation = 'difference';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fillRect(0, 0, width, height);
          ctx.globalCompositeOperation = 'source-over';
        } else if (visionMode === 'mono') {
          // Monochromatic High Contrast
          ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
          ctx.globalCompositeOperation = 'saturation';
          ctx.fillRect(0, 0, width, height);
          ctx.globalCompositeOperation = 'source-over';
        }

        // 4. Subtle Scanlines & Film Vignette
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 1.5);
        }

        // Corner Cinematic Vignette
        const vignette = ctx.createRadialGradient(
          width / 2, height / 2, width * 0.35,
          width / 2, height / 2, width * 0.72
        );
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
      }
    }

    animFrameRef.current = requestAnimationFrame(renderFrame);
  }, [isPlaying, currentTime, visionMode, loadedImages, onTimeUpdate]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [renderFrame]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!isPlaying) {
      tacticalAudio.playTacticalClick();
      tacticalAudio.playRadioSquelch();
    }
    setIsPlaying(!isPlaying);
  };

  // Jump to specific scene
  const handleSceneSelect = (startTime: number) => {
    tacticalAudio.playTacticalClick();
    tacticalAudio.playImpactDrop();
    setCurrentTime(startTime);
  };

  // Switch vision mode
  const handleVisionSelect = (mode: VisionMode) => {
    tacticalAudio.playTacticalClick();
    if (mode === 'nvg') {
      tacticalAudio.playNvgPower();
    } else if (mode === 'flir') {
      tacticalAudio.playTargetLock();
    }
    setVisionMode(mode);
  };

  // Toggle Audio
  const toggleAudio = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    tacticalAudio.setMuted(nextState);
    if (!nextState) {
      tacticalAudio.playRadioSquelch();
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Export 15-second Video Clip using Canvas Stream & MediaRecorder
  const handleExportVideo = async () => {
    if (!canvasRef.current) return;
    try {
      tacticalAudio.playRadioSquelch();
      setIsRecording(true);
      setRecordingProgress(0);
      recordedChunksRef.current = [];

      // Jump to start
      setCurrentTime(0);
      setIsPlaying(true);

      const stream = canvasRef.current.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
        ? 'video/webm; codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Special_Forces_15s_Mission_Reel_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        tacticalAudio.playTargetLock();
      };

      recorder.start();

      // Monitor 15 seconds
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setRecordingProgress(Math.min(100, Math.round((elapsed / 15) * 100)));
        if (elapsed >= 15.0) {
          clearInterval(interval);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, 100);
    } catch {
      setIsRecording(false);
    }
  };

  // Formatted timestamp
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none' : ''
      }`}
    >
      {/* Aspect Ratio Box for 16:9 Canvas */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="h-full w-full object-cover"
        />

        {/* Tactical HUD Overlay (Corner Brackets, Crosshairs, Telemetry) */}
        {showHud && (
          <div className="pointer-events-none absolute inset-0 p-4 md:p-6 font-data flex flex-col justify-between text-xs text-neutral-300">
            {/* Top Bar HUD */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-red-500 font-bold uppercase tracking-wider">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  REC
                </span>
                <span className="text-neutral-300 tabular-nums">
                  {formatTime(currentTime)} / 00:15.00
                </span>
                <span className="hidden sm:inline-block text-neutral-500">|</span>
                <span className="hidden sm:inline-block text-amber-400 font-semibold">
                  SCENE {currentScene.sceneNumber}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline-flex items-center gap-1 text-neutral-400">
                  <Radio className="h-3.5 w-3.5 text-emerald-400" />
                  MIL-STD-810H
                </span>
                <span className="border border-neutral-700 bg-neutral-900/80 px-2 py-0.5 uppercase tracking-wider text-[11px] text-neutral-300">
                  {visionMode.toUpperCase()} FEED
                </span>
              </div>
            </div>

            {/* Center Crosshair & Corner Target Brackets */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative h-44 w-44 md:h-64 md:w-64 border border-dashed border-white/20">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-amber-400" />
                <Crosshair className="absolute inset-0 m-auto h-6 w-6 text-white/40" />
              </div>
            </div>

            {/* Bottom HUD Telemetry & Radio Briefing */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
              <div className="max-w-md">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm tracking-wide">
                  <ShieldAlert className="h-4 w-4" />
                  <span>{currentScene.title}</span>
                </div>
                <div className="text-[11px] text-neutral-300 mt-0.5 line-clamp-1">
                  {currentScene.subtitle}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 italic font-sans flex items-center gap-1.5">
                  <span className="text-emerald-400 font-data not-italic">COMMS:</span>
                  &ldquo;{currentScene.radioChatter}&rdquo;
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-neutral-400 text-right">
                <div>COORD: <span className="text-neutral-200 tabular-nums">{currentScene.telemetry.lat}</span></div>
                <div>AZIMUTH: <span className="text-neutral-200">{currentScene.telemetry.azimuth}</span></div>
                <div>RANGE: <span className="text-neutral-200">{currentScene.telemetry.range}</span></div>
                <div>OPTIC: <span className="text-emerald-400">{currentScene.telemetry.opticalMode}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Video Scrubber Timeline Bar (0 to 32s) */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-900 cursor-pointer group">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-75 relative"
            style={{ width: `${(currentTime / 32.0) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md border border-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Scene Split Tick Marks across 8 scenes */}
          <div className="absolute top-0 bottom-0 left-[12.5%] w-[1px] bg-white/40" />
          <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-white/40" />
          <div className="absolute top-0 bottom-0 left-[37.5%] w-[1px] bg-white/40" />
          <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-white/40" />
          <div className="absolute top-0 bottom-0 left-[62.5%] w-[1px] bg-white/40" />
          <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-white/40" />
          <div className="absolute top-0 bottom-0 left-[87.5%] w-[1px] bg-white/40" />
        </div>
      </div>

      {/* Control Console */}
      <div className="border-t border-neutral-800 bg-neutral-900/90 p-3 md:p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Playback & Audio Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center h-9 w-9 rounded-md bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play 15-second video'}
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setCurrentTime(0);
              }}
              className="flex items-center justify-center h-9 w-9 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
              aria-label="Restart video from 0s"
              title="Restart 15s sequence"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={toggleAudio}
              className={`flex items-center justify-center h-9 w-9 rounded-md border transition-colors ${
                isAudioMuted 
                  ? 'border-neutral-700 bg-neutral-800 text-neutral-400' 
                  : 'border-emerald-600/50 bg-emerald-950/30 text-emerald-400'
              }`}
              aria-label={isAudioMuted ? 'Unmute tactical radio & SFX' : 'Mute tactical SFX'}
              title="Tactical Radio Comms & Synthesizer"
            >
              {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setShowHud(!showHud)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-data transition-colors ${
                showHud 
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' 
                  : 'border-neutral-700 bg-neutral-800 text-neutral-400'
              }`}
              title="Toggle Tactical HUD"
            >
              <Crosshair className="h-3.5 w-3.5" />
              <span>HUD</span>
            </button>
          </div>

          {/* Middle: 4 Scene Quick Jumps */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {VIDEO_SCENES.map((scene, idx) => {
              const isActive = currentScene.id === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => handleSceneSelect(scene.startTime)}
                  className={`px-2.5 py-1 text-xs font-tactical whitespace-nowrap rounded border transition-all ${
                    isActive
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-[10px] text-neutral-500 mr-1">0{idx + 1}</span>
                  {scene.title.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Right: Vision Modes, Download Clip & Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Vision Mode Selector */}
            <div className="flex items-center rounded-md border border-neutral-700 bg-neutral-800/80 p-0.5 text-xs font-data">
              {(['standard', 'nvg', 'flir', 'mono'] as VisionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleVisionSelect(mode)}
                  className={`px-2 py-0.5 uppercase tracking-wider rounded transition-colors ${
                    visionMode === mode
                      ? mode === 'nvg'
                        ? 'bg-emerald-600 text-white font-bold'
                        : mode === 'flir'
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-neutral-200 text-neutral-900 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Export 15s Video Clip */}
            <button
              onClick={handleExportVideo}
              disabled={isRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                isRecording
                  ? 'border-red-500 bg-red-950/40 text-red-300 animate-pulse'
                  : 'border-neutral-700 bg-neutral-800 text-neutral-200 hover:border-amber-500/60 hover:text-amber-400'
              }`}
              title="Record and download this exact 15-second tactical video reel"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {isRecording ? `REC ${recordingProgress}%` : 'Export 15s WebM'}
              </span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center h-8 w-8 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Tactical Status Bar */}
        <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-data font-semibold">● SPECIAL FORCE TACTICAL HUD:</span>
            <span className="text-neutral-300 font-tactical uppercase tracking-wider">{currentScene.title}</span>
          </div>
          <div className="flex items-center gap-3 font-data">
            <span>CIT2 LAW FEED</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-500">SYNCHRONIZED SEQUENCE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
