import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Eye, EyeOff, Shield, Globe, 
  Volume2, VolumeX, Moon, Sun, MousePointer, Lock, RefreshCw, 
  Compass, CheckCircle2, User, Sparkles, Terminal
} from 'lucide-react';
import { USSFMember } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';

interface USSFSettingsViewProps {
  currentUser: USSFMember | null;
  activeTheme: 'dark' | 'nvg' | 'day';
  onThemeToggle: () => void;
  currentLanguage: string;
  onOpenLanguageModal: () => void;
  onOpenTutorial: () => void;
  onUpdateProfile: (updated: Partial<USSFMember>) => void;
  onOpenAuth: () => void;
  ambientAudioEnabled?: boolean;
  onToggleAmbientAudio?: () => void;
  isTutorialEnabled?: boolean;
  onToggleTutorial?: () => void;
}

export const USSFSettingsView: React.FC<USSFSettingsViewProps> = ({
  currentUser,
  activeTheme,
  onThemeToggle,
  currentLanguage,
  onOpenLanguageModal,
  onOpenTutorial,
  onUpdateProfile,
  onOpenAuth,
  ambientAudioEnabled = false,
  onToggleAmbientAudio,
  isTutorialEnabled = true,
  onToggleTutorial
}) => {
  // Visitor & System Settings
  const [autoTutorialEnabled, setAutoTutorialEnabled] = useState(() => {
    return localStorage.getItem('ussf_tutorial_disabled') !== 'true';
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientAudio, setAmbientAudio] = useState(ambientAudioEnabled);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Member Privacy & Presence Settings
  const [presenceStatus, setPresenceStatus] = useState<string>(currentUser?.presenceStatus || 'Online');
  const [hideCountry, setHideCountry] = useState(() => localStorage.getItem('ussf_hide_country') === 'true');
  const [hideAge, setHideAge] = useState(() => localStorage.getItem('ussf_hide_age') === 'true');
  const [hidePlaytime, setHidePlaytime] = useState(() => localStorage.getItem('ussf_hide_playtime') === 'true');
  const [appearOffline, setAppearOffline] = useState(() => currentUser ? !currentUser.isOnlineCit : false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleToggleTutorial = () => {
    const next = !autoTutorialEnabled;
    setAutoTutorialEnabled(next);
    if (next) {
      localStorage.setItem('ussf_tutorial_disabled', 'false');
    } else {
      localStorage.setItem('ussf_tutorial_disabled', 'true');
      localStorage.setItem('ussf_tutorial_seen', 'true');
    }
    onToggleTutorial?.();
    tacticalAudio.playTacticalClick();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleSaveSettings = () => {
    tacticalAudio.playTargetLock();
    localStorage.setItem('ussf_hide_country', String(hideCountry));
    localStorage.setItem('ussf_hide_age', String(hideAge));
    localStorage.setItem('ussf_hide_playtime', String(hidePlaytime));
    if (currentUser) {
      onUpdateProfile({
        isOnlineCit: !appearOffline,
        presenceStatus: appearOffline ? 'Offline' : (presenceStatus as any)
      });
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-16 font-sans">
      {/* Banner */}
      <div className="border-b border-neutral-800 bg-[#0d100d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400 mb-1">
              <SettingsIcon className="h-4 w-4" />
              <span>TERMINAL CONFIGURATION // OPERATOR & VISITOR PREFERENCES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-tactical uppercase text-white">
              COMMAND SETTINGS & PRIVACY
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-1">
              Configure system display, 150+ language preferences, guided tutorial status, and operator privacy controls.
            </p>
          </div>

          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase transition-colors cursor-pointer shadow-md"
          >
            <Compass className="h-4 w-4" />
            <span>REPLAY OPERATOR TOUR</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {savedMsg && (
          <div className="p-4 rounded-xl border border-emerald-500/60 bg-emerald-950/40 text-emerald-300 text-xs font-data flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>Settings and privacy preferences updated successfully!</span>
          </div>
        )}

        {/* SECTION 1: VISITOR & GENERAL DISPLAY SETTINGS */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-sm font-tactical uppercase font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>VISITOR & SYSTEM PREFERENCES</span>
            </h3>
            <span className="text-[10px] font-data text-neutral-400">APPLIES TO ALL USERS</span>
          </div>

          <div className="space-y-4 text-xs font-data">
            {/* Tutorial On/Off */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">AUTOMATIC GUIDED TUTORIAL TOUR</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Automatically show step-by-step interactive onboarding tour when entering the website.
                </span>
              </div>
              <button
                onClick={handleToggleTutorial}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors cursor-pointer ${
                  autoTutorialEnabled
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {autoTutorialEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">INTERNATIONAL LANGUAGE (150+ SUPPORTED)</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Current Language Code: <strong className="text-amber-400 uppercase">{currentLanguage}</strong>
                </span>
              </div>
              <button
                onClick={onOpenLanguageModal}
                className="px-3.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold uppercase border border-neutral-700 cursor-pointer"
              >
                CHOOSE FROM 150+ LANGUAGES
              </button>
            </div>

            {/* Dark / NVG / Camo Theme */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">TACTICAL NIGHT VISION & THEME</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Switch between OLED Dark, Phosphor NVG Green, and Desert Day Camo.
                </span>
              </div>
              <button
                onClick={onThemeToggle}
                className="px-3.5 py-1.5 rounded bg-amber-500 text-neutral-950 text-xs font-bold uppercase cursor-pointer"
              >
                CURRENT: {activeTheme.toUpperCase()}
              </button>
            </div>

            {/* Audio Effects */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">TACTICAL SATELLITE AUDIO & RADIO</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Realistic military click synthesizer, squelch radio, and target lock sounds.
                </span>
              </div>
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  tacticalAudio.setMuted(!next);
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {soundEnabled ? 'AUDIO ON' : 'MUTED'}
              </button>
            </div>

            {/* Ambient Tactical Drone & Radio Chatter */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">AMBIENT TACTICAL RADIO & SUB-BASS DRONE</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Continuous atmospheric military drone and intermittent background tactical radio squelch.
                </span>
              </div>
              <button
                onClick={() => {
                  const next = !ambientAudio;
                  setAmbientAudio(next);
                  if (onToggleAmbientAudio) {
                    onToggleAmbientAudio();
                  } else {
                    if (next) tacticalAudio.startAmbientDrone();
                    else tacticalAudio.stopAmbientDrone();
                  }
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors cursor-pointer ${
                  ambientAudio
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {ambientAudio ? 'AMBIENT ON' : 'AMBIENT OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: MEMBER PRIVACY SETTINGS */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-sm font-tactical uppercase font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>MEMBER PRESENCE & ROSTER CONTROLS</span>
            </h3>
            {currentUser ? (
              <span className="text-[10px] font-data text-emerald-400 font-bold">LOGGED IN OPERATOR</span>
            ) : (
              <span className="text-[10px] font-data text-amber-400">LOGIN TO CUSTOMIZE</span>
            )}
          </div>

          <div className="space-y-4 text-xs font-data">
            {/* Presence Status Selector: Online, Idle, DND, Offline */}
            <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
              <label className="font-bold text-neutral-100 block font-tactical uppercase text-xs">
                OPERATIONAL PRESENCE STATUS (ONLINE / IDLE / DND / OFFLINE)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Online', label: 'Online', desc: 'Active & Ready', color: 'bg-emerald-500', activeClass: 'border-emerald-500 bg-emerald-950/40 text-emerald-300' },
                  { id: 'Idle', label: 'Idle / Away', desc: 'AFK or On Standby', color: 'bg-amber-400', activeClass: 'border-amber-500 bg-amber-950/40 text-amber-300' },
                  { id: 'DND', label: 'Do Not Disturb', desc: 'In Combat / Patrol', color: 'bg-rose-500', activeClass: 'border-rose-500 bg-rose-950/40 text-rose-300' },
                  { id: 'Offline', label: 'Offline / Invisible', desc: 'Stealth Recon', color: 'bg-neutral-600', activeClass: 'border-neutral-600 bg-neutral-900 text-neutral-300' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setPresenceStatus(item.id);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      presenceStatus === item.id
                        ? item.activeClass
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="font-tactical font-bold text-xs">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Hide Country */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">HIDE COUNTRY FROM PUBLIC ROSTER</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Redact your real-world geographic country from the personnel dossier view.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hideCountry}
                onChange={(e) => setHideCountry(e.target.checked)}
                className="h-5 w-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Hide Age */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">HIDE AGE FROM PUBLIC ROSTER</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Keep operator age confidential on official member dossiers.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hideAge}
                onChange={(e) => setHideAge(e.target.checked)}
                className="h-5 w-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Hide Playtime */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">HIDE TOTAL CIT2 PLAYTIME HOURS</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Mask in-game playtime metrics on public key statistics cards.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hidePlaytime}
                onChange={(e) => setHidePlaytime(e.target.checked)}
                className="h-5 w-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Appear Offline */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div>
                <span className="font-bold text-neutral-100 block font-tactical">STEALTH MODE (APPEAR OFFLINE)</span>
                <span className="text-neutral-400 font-sans text-xs">
                  Do not broadcast active web session indicator on roster list.
                </span>
              </div>
              <input
                type="checkbox"
                checked={appearOffline}
                onChange={(e) => setAppearOffline(e.target.checked)}
                className="h-5 w-5 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase cursor-pointer shadow-md"
            >
              SAVE SETTINGS & PREFERENCES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
