/**
 * Client-side Web Audio Tactical Sound Synthesizer
 * Generates realistic military radio squelch, NVG tube whine, target lock chirps,
 * and cinematic bass drops without external audio file dependencies.
 */

class TacticalSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientNoiseNode: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientTimer: any = null;
  private isAmbientRunning: boolean = false;

  constructor() {
    // AudioContext will be lazily initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
    }
    if (muted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.ambientGain && this.ctx && this.isAmbientRunning) {
      this.ambientGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Start ambient tactical low-frequency drone & intermittent radio chatter
   */
  public startAmbientDrone() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isAmbientRunning) return;

    try {
      this.isAmbientRunning = true;
      const now = this.ctx.currentTime;

      // Create dedicated ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.07, now + 2.5);
      this.ambientGain.connect(this.masterGain);

      // Low-pass filter for muffled command room atmospheric rumble
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(95, now);
      this.ambientFilter.Q.setValueAtTime(1.5, now);
      this.ambientFilter.connect(this.ambientGain);

      // Dual Sub-harmonic drone oscillators (48Hz and 53Hz create binaural tactical drone)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(48, now);
      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc1.start(now);

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(53.2, now);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientOsc2.start(now);

      // Periodic subtle radio chatter burst loop (every 18-28 seconds)
      const scheduleChatter = () => {
        if (!this.isAmbientRunning) return;
        const delay = 18000 + Math.random() * 10000;
        this.ambientTimer = setTimeout(() => {
          if (this.isAmbientRunning && !this.isMuted) {
            this.playAmbientRadioBurst();
          }
          scheduleChatter();
        }, delay);
      };
      scheduleChatter();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Stop ambient tactical drone & radio chatter
   */
  public stopAmbientDrone() {
    if (!this.isAmbientRunning) return;
    this.isAmbientRunning = false;

    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }

    if (this.ambientGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
        setTimeout(() => {
          try {
            this.ambientOsc1?.stop();
            this.ambientOsc2?.stop();
            this.ambientOsc1?.disconnect();
            this.ambientOsc2?.disconnect();
            this.ambientFilter?.disconnect();
            this.ambientGain?.disconnect();
          } catch {}
          this.ambientOsc1 = null;
          this.ambientOsc2 = null;
          this.ambientFilter = null;
          this.ambientGain = null;
        }, 1300);
      } catch {
        this.ambientGain = null;
      }
    }
  }

  public isAmbientOn(): boolean {
    return this.isAmbientRunning;
  }

  /**
   * Subtle ambient tactical radio burst (low volume, muffled squad radio comms)
   */
  public playAmbientRadioBurst() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.4;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1800, now);
      bandpass.Q.setValueAtTime(4.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.18);
    } catch {}
  }

  /**
   * Military radio squelch burst (burst of shaped white noise + high frequency chirp)
   */
  public playRadioSquelch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // White noise buffer
      const bufferSize = this.ctx.sampleRate * 0.12; // 120ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter for authentic radio walkie-talkie effect
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2200, now);
      bandpass.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      whiteNoise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.12);

      // Roger beep tone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1750, now + 0.08);
      oscGain.gain.setValueAtTime(0.08, now + 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now + 0.08);
      osc.stop(now + 0.17);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Night Vision Goggle (NVG) capacitor power-up whine
   */
  public playNvgPower() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch ramp up from 1.2kHz to 6.8kHz like genuine tube night vision
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(6800, now + 0.45);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {
      // Ignore
    }
  }

  /**
   * Tactical laser target lock confirmation chirp
   */
  public playTargetLock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Double chirp
      [0, 0.08].forEach(offset => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(2400, now + offset);
        gain.gain.setValueAtTime(0.06, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.06);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Cinematic Sub-bass drop / impact on scene cut
   */
  public playImpactDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.6);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch {
      // Ignore
    }
  }

  /**
   * Tactical switch click
   */
  public playTacticalClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }

  /**
   * Tactical warning buzzer / alert tone
   */
  public playAlertWarning() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(240, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }
}

export const tacticalAudio = new TacticalSoundEngine();
