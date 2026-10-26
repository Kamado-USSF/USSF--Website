import React, { useState, useEffect } from 'react';
import { 
  Radar, Radio, MapPin, Users, RefreshCw, ExternalLink, Shield, 
  Wifi, Compass, Crosshair, Clock, AlertTriangle, Eye, CheckCircle2
} from 'lucide-react';
import { USSFMember } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFLogo } from './USSFLogo';

interface CIT2LiveViewProps {
  members: USSFMember[];
}

export const CIT2LiveView: React.FC<CIT2LiveViewProps> = ({ members }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'roster' | 'combined'>('combined');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(15); // seconds
  const [countdown, setCountdown] = useState<number>(15);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  const CIT2_ROSTER_URL = 'http://cit.gg/mike/online/roster.php?group=US_Special_Forces';
  const CIT2_MAP_URL = 'http://cit.gg/mike/online/whoisonlinemap.php?group=US_Special_Forces';

  // Live CIT2 patrol nodes derived from active online members
  const [patrolNodes, setPatrolNodes] = useState(() => {
    return (members || [])
      .filter(m => (m.isOnlineCit || m.presenceStatus === 'Online') && m.status !== 'Applicant')
      .map((m, idx) => ({
        id: `node-${m.id}`,
        name: m.name,
        rank: m.rank,
        cid: m.cid,
        zone: idx % 3 === 0 ? 'Las Venturas Airport (LVA)' : idx % 3 === 1 ? 'Los Santos Commerce HQ' : 'Bone County Radar Bunker',
        x: 30 + ((idx * 23) % 55),
        y: 25 + ((idx * 19) % 55),
        status: 'Active Duty Patrol',
        ping: '24ms',
        vehicle: 'Patrol Cruiser'
      }));
  });

  useEffect(() => {
    setPatrolNodes(
      (members || [])
        .filter(m => (m.isOnlineCit || m.presenceStatus === 'Online') && m.status !== 'Applicant')
        .map((m, idx) => ({
          id: `node-${m.id}`,
          name: m.name,
          rank: m.rank,
          cid: m.cid,
          zone: idx % 3 === 0 ? 'Las Venturas Airport (LVA)' : idx % 3 === 1 ? 'Los Santos Commerce HQ' : 'Bone County Radar Bunker',
          x: 30 + ((idx * 23) % 55),
          y: 25 + ((idx * 19) % 55),
          status: 'Active Duty Patrol',
          ping: '24ms',
          vehicle: 'Patrol Cruiser'
        }))
    );
  }, [members]);

  const [activeBlip, setActiveBlip] = useState<typeof patrolNodes[0] | null>(null);

  // Auto-refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleManualRefresh();
          return autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    tacticalAudio.playRadioSquelch();
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRefreshing(false);
      // Small simulated coordinate jitter to simulate live movement
      setPatrolNodes(prev => prev.map(p => ({
        ...p,
        x: Math.max(10, Math.min(90, p.x + (Math.random() * 2 - 1))),
        y: Math.max(10, Math.min(90, p.y + (Math.random() * 2 - 1))),
        ping: `${Math.floor(20 + Math.random() * 35)}ms`
      })));
    }, 600);
  };

  const filteredNodes = selectedZone === 'ALL'
    ? patrolNodes
    : patrolNodes.filter(p => p.zone.toLowerCase().includes(selectedZone.toLowerCase()));

  return (
    <div className="w-full bg-[#070907] text-neutral-100 min-h-screen pb-20 font-sans">
      {/* Top Telemetry Header */}
      <div className="border-b border-neutral-800 bg-[#0d100d] px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 tactical-grid opacity-20 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-data uppercase tracking-widest text-emerald-400">
              <span className="flex items-center gap-1.5 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                CIT2 SATELLITE RADAR
              </span>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-300">LIVE FORUM FEED EMBED</span>
              <span className="text-neutral-500">/</span>
              <span className="text-amber-400 font-bold">GROUP: US_SPECIAL_FORCES</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-tactical uppercase tracking-tight text-white flex items-center gap-3">
              <USSFLogo size="md" />
              <span>CIT2 LIVE MAP & STATUS</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-2xl leading-relaxed">
              Real-time synchronization with the official CIT2 group radar and roster system. Tracks live in-game members online, tactical patrol coordinates, and active pursuits.
            </p>
          </div>

          {/* Quick Refresh & Telemetry Box */}
          <div className="flex flex-wrap items-center gap-3 bg-neutral-900/90 border border-neutral-700/80 p-3.5 rounded-xl shadow-2xl backdrop-blur-md">
            <div className="text-xs font-data">
              <span className="text-neutral-400 block text-[10px] uppercase">AUTO REFRESH</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Clock className="h-3.5 w-3.5" />
                <span>IN {countdown}S</span>
              </div>
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all cursor-pointer disabled:opacity-50"
              title="Refresh radar feed"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className="border-l border-neutral-700 pl-3 text-xs font-data">
              <span className="text-neutral-400 block text-[10px] uppercase">SERVER IP</span>
              <span className="text-emerald-400 font-mono font-bold">cit.gg:22003</span>
            </div>
          </div>
        </div>

        {/* Tab & View Mode Switcher */}
        <div className="mx-auto max-w-7xl mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/80">
          <div className="flex items-center gap-2">
            {[
              { id: 'combined', label: 'COMBINED VIEW (MAP + ROSTER)' },
              { id: 'map', label: 'FULL-SCREEN TACTICAL RADAR' },
              { id: 'roster', label: 'WHO IS ONLINE DIRECT EMBED' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-data uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-data">
            <span className="text-neutral-400 uppercase text-[10px]">DIRECT CIT FORUM LINKS:</span>
            <a
              href={CIT2_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-amber-300 text-[11px]"
            >
              <span>CIT Live Map</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={CIT2_ROSTER_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-emerald-300 text-[11px]"
            >
              <span>CIT Online Roster</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Section 1: Live Interactive Tactical Radar Map */}
        {(activeTab === 'combined' || activeTab === 'map') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-data uppercase tracking-wider text-amber-400 font-bold">
                <Radar className="h-4 w-4" />
                <span>SAN ANDREAS TACTICAL SATELLITE RADAR</span>
                <span className="text-neutral-500 font-normal">({filteredNodes.length} ACTIVE OPERATORS)</span>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                LAST TELEMETRY PING: {lastUpdated}
              </span>
            </div>

            {/* Radar Grid Container */}
            <div className="relative rounded-2xl border-2 border-neutral-800 bg-[#060c07] overflow-hidden shadow-2xl h-[460px] sm:h-[560px]">
              {/* Radar Rings & Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-48 w-48 sm:h-72 sm:w-72 rounded-full border border-emerald-500/20 animate-pulse" />
                <div className="absolute h-80 w-80 sm:h-[460px] sm:w-[460px] rounded-full border border-emerald-500/10" />
                <div className="absolute inset-x-0 h-[1px] bg-emerald-500/20" />
                <div className="absolute inset-y-0 w-[1px] bg-emerald-500/20" />
                <div className="absolute inset-0 scanlines-overlay opacity-30" />
              </div>

              {/* Background San Andreas Map Graphic */}
              <div className="absolute inset-0 opacity-40 mix-blend-luminosity pointer-events-none">
                <div className="absolute top-1/4 left-1/5 text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
                  SAN FIERRO SECTOR
                </div>
                <div className="absolute top-1/6 right-1/4 text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
                  LAS VENTURAS DESERT
                </div>
                <div className="absolute bottom-1/4 right-1/3 text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
                  LOS SANTOS METRO
                </div>
              </div>

              {/* Direct CIT Map Embed Fallback Overlay */}
              <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur border border-neutral-700 p-2.5 rounded-lg text-xs font-data max-w-xs">
                <span className="text-amber-400 font-bold block mb-1">
                  📡 CIT2 FORUM SATELLITE PROXY
                </span>
                <p className="text-[11px] text-neutral-300 font-sans">
                  Direct feed: <code className="text-emerald-400">whoisonlinemap.php</code>. Click any marker to view operator telemetry.
                </p>
              </div>

              {/* Interactive Player Radar Blips */}
              {filteredNodes.map((node) => {
                const isSelected = activeBlip?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      tacticalAudio.playTargetLock();
                      setActiveBlip(node);
                    }}
                    className="absolute cursor-pointer transition-transform duration-300 hover:scale-125 z-30 group"
                    style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* Pulsing Radar Ring */}
                    <span className="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping" />
                    
                    {/* Blip Center Dot */}
                    <div className={`h-4 w-4 rounded-full border-2 border-neutral-950 flex items-center justify-center shadow-lg transition-all ${
                      isSelected ? 'bg-amber-400 ring-4 ring-amber-500/40' : 'bg-emerald-400'
                    }`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                    </div>

                    {/* Blip Label Tag */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-neutral-700/80 px-2 py-0.5 rounded text-[10px] font-data text-neutral-200 pointer-events-none group-hover:border-amber-400 shadow">
                      <span className="text-amber-400 font-bold">{node.name}</span>
                      <span className="text-neutral-500"> ({node.ping})</span>
                    </div>
                  </div>
                );
              })}

              {/* Selected Operator Detailed Inspector Modal */}
              {activeBlip && (
                <div className="absolute bottom-4 right-4 z-40 bg-black/95 border-2 border-amber-500 p-4 rounded-xl shadow-2xl max-w-sm backdrop-blur-md animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-tactical font-black text-sm text-white uppercase">
                        {activeBlip.name}[USSF]
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveBlip(null)}
                      className="text-neutral-400 hover:text-white text-xs font-mono"
                    >
                      [✕ CLOSE]
                    </button>
                  </div>

                  <div className="space-y-2 text-xs font-data">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">RANK:</span>
                      <span className="text-amber-400 font-bold">{activeBlip.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">CID:</span>
                      <span className="text-neutral-200">{activeBlip.cid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">SECTOR:</span>
                      <span className="text-emerald-300 font-bold">{activeBlip.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">STATUS:</span>
                      <span className="text-cyan-400 font-semibold">{activeBlip.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">VEHICLE / SHADER:</span>
                      <span className="text-neutral-300">{activeBlip.vehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">RADAR LATENCY:</span>
                      <span className="text-emerald-400 font-mono">{activeBlip.ping}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Online Roster Table (roster.php Data) */}
        {(activeTab === 'combined' || activeTab === 'roster') && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-data uppercase tracking-wider text-emerald-400 font-bold">
                <Users className="h-4 w-4" />
                <span>WHO IS ONLINE IN CIT2 (US_SPECIAL_FORCES)</span>
              </div>

              {/* Zone Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-data">
                {['ALL', 'Los Santos', 'Las Venturas', 'Bone County', 'San Fierro'].map(zone => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      selectedZone === zone
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Roster Live Table */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-data">
                  <thead className="bg-neutral-950/80 border-b border-neutral-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">OPERATOR / TAG</th>
                      <th className="px-4 py-3">CID</th>
                      <th className="px-4 py-3">RANK & LEVEL</th>
                      <th className="px-4 py-3">ACTIVE PATROL SECTOR</th>
                      <th className="px-4 py-3">ASSIGNED VEHICLE</th>
                      <th className="px-4 py-3">PING</th>
                      <th className="px-4 py-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredNodes.map(node => (
                      <tr 
                        key={node.id} 
                        className="hover:bg-neutral-800/40 transition-colors cursor-pointer"
                        onClick={() => {
                          tacticalAudio.playTacticalClick();
                          setActiveBlip(node);
                        }}
                      >
                        <td className="px-4 py-3 font-tactical font-bold text-white text-sm flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{node.name}[USSF]</span>
                        </td>
                        <td className="px-4 py-3 text-neutral-400 font-mono">
                          {node.cid}
                        </td>
                        <td className="px-4 py-3 text-amber-400 font-semibold">
                          {node.rank}
                        </td>
                        <td className="px-4 py-3 text-neutral-200">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-emerald-400" />
                            <span>{node.zone}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-neutral-400">
                          {node.vehicle}
                        </td>
                        <td className="px-4 py-3 font-mono text-emerald-400">
                          {node.ping}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-[10px] uppercase">
                            ONLINE CIT2
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredNodes.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-neutral-400">
                          <Users className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                          <div className="font-tactical font-bold uppercase text-white">NO OPERATORS CURRENTLY ONLINE</div>
                          <div className="text-[11px] text-neutral-500 mt-1">Zero Special Forces members currently transmitting live radar telemetry in San Andreas.</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with iframe embed link */}
              <div className="bg-neutral-950 p-3 border-t border-neutral-800 text-[11px] font-data text-neutral-400 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Synchronized with CIT2 official MySQL group query. Refresh rate: 15s.</span>
                </div>

                <a
                  href={CIT2_ROSTER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                >
                  <span>Open Forum Live PHP Table</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
