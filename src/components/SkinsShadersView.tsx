import React, { useState } from 'react';
import { 
  Shirt, Car, Sparkles, Eye, X, Shield, 
  Layers, Search, CheckCircle2, ChevronRight, FileText,
  Crosshair, Radio, Gauge, Zap
} from 'lucide-react';
import { USSFAssetItem, INITIAL_SKINS_AND_SHADERS } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFLogo } from './USSFLogo';

interface SkinsShadersViewProps {
  assets?: USSFAssetItem[];
}

export const SkinsShadersView: React.FC<SkinsShadersViewProps> = ({
  assets = INITIAL_SKINS_AND_SHADERS
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'SKIN' | 'VEHICLE_SHADER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<USSFAssetItem | null>(null);

  const filtered = assets.filter(item => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.codeOrId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-16 font-sans">
      {/* Header Banner */}
      <div className="border-b border-neutral-800 bg-[#0d100d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>CIT2 LAW GROUP // SPECIAL FORCES ARMORY & MOTOR POOL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-tactical uppercase text-white flex items-center gap-3">
              <span>TACTICAL SKINS & VEHICLE SHADERS</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-1 max-w-2xl">
              Official camouflage uniforms and interceptor liveries authorized for United States Special Forces on CIT2. Technical specifications, variant loadouts, and tactical motor pool directives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/80 text-xs font-data flex items-center gap-3">
              <USSFLogo size="md" />
              <div>
                <span className="text-white font-bold block">OFFICIAL UNIFORMS & SHADERS</span>
                <span className="text-emerald-400 font-bold">{assets.length} REGISTERED ASSETS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Skin ID (e.g. 39, 164), shader name, or description..."
              className="w-full rounded-lg bg-neutral-950 border border-neutral-800 pl-9 pr-4 py-2 text-xs font-data text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Assets', icon: Layers },
              { id: 'SKIN', label: 'Skins Only', icon: Shirt },
              { id: 'VEHICLE_SHADER', label: 'Vehicle Shaders', icon: Car }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    setFilterType(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tactical uppercase transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tactical Specification Cards Grid (Without Images) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => {
            const isSkin = item.type === 'SKIN';
            return (
              <div
                key={item.id}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setSelectedAsset(item);
                }}
                className={`group rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-2xl ${
                  isSkin
                    ? 'border-neutral-800 hover:border-amber-500/80 bg-[#0d100d] hover:shadow-amber-500/10'
                    : 'border-neutral-800 hover:border-cyan-500/80 bg-[#0c1012] hover:shadow-cyan-500/10'
                }`}
              >
                {/* Tactical Armory Card Header (Vector HUD) */}
                <div className={`p-6 border-b transition-colors ${
                  isSkin
                    ? 'bg-gradient-to-br from-amber-950/30 via-neutral-950 to-neutral-950 border-neutral-800 group-hover:border-amber-500/40'
                    : 'bg-gradient-to-br from-cyan-950/30 via-neutral-950 to-neutral-950 border-neutral-800 group-hover:border-cyan-500/40'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shadow-inner ${
                        isSkin 
                          ? 'bg-amber-950/60 border-amber-500/50 text-amber-400' 
                          : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                      }`}>
                        {isSkin ? <Shirt className="h-6 w-6" /> : <Car className="h-6 w-6" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            isSkin
                              ? 'bg-amber-950/90 border-amber-500/60 text-amber-300'
                              : 'bg-cyan-950/90 border-cyan-500/60 text-cyan-300'
                          }`}>
                            {item.codeOrId}
                          </span>
                          {item.variantCount && item.variantCount > 1 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
                              {item.variantCount} VARIANTS
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-data text-neutral-400 uppercase tracking-widest mt-1 block">
                          {isSkin ? 'TACTICAL UNIFORM' : 'INTERCEPTOR SHADER'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-data font-bold uppercase text-neutral-400 tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className={`text-base font-tactical font-black uppercase transition-colors ${
                      isSkin ? 'text-white group-hover:text-amber-300' : 'text-white group-hover:text-cyan-300'
                    }`}>
                      {item.title}
                    </h3>

                    <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Micro Specs Indicators */}
                  <div className="pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-[11px] font-data">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">CIT2 Law Certified</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Crosshair className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Active In-Game</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-3 border-t border-neutral-800/80 bg-neutral-950/60 flex items-center justify-between text-xs font-data text-neutral-400">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">TECHNICAL SPECIFICATIONS</span>
                  <span className={`font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
                    isSkin ? 'text-amber-400' : 'text-cyan-400'
                  }`}>
                    <span>VIEW SPECS</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <FileText className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="font-tactical font-bold text-neutral-300 uppercase">No matching skins or shaders</h3>
            <p className="text-xs text-neutral-500 mt-1">Try adjusting your search criteria or switch to All Assets.</p>
          </div>
        )}
      </div>

      {/* Technical Specification Inspector Modal (Clean Vector UI - No Image) */}
      {selectedAsset && (
        <div 
          onClick={() => setSelectedAsset(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#0c0f0c] border-2 border-amber-500/80 rounded-2xl overflow-hidden shadow-2xl space-y-5 p-6 sm:p-8"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shadow-inner ${
                  selectedAsset.type === 'SKIN' 
                    ? 'bg-amber-950/70 border-amber-500/60 text-amber-400' 
                    : 'bg-cyan-950/70 border-cyan-500/60 text-cyan-400'
                }`}>
                  {selectedAsset.type === 'SKIN' ? <Shirt className="h-6 w-6" /> : <Car className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold text-xs font-mono">
                      {selectedAsset.codeOrId}
                    </span>
                    {selectedAsset.variantCount && selectedAsset.variantCount > 1 && (
                      <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs font-mono">
                        {selectedAsset.variantCount} TACTICAL VARIANTS
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-data text-neutral-400 uppercase tracking-widest mt-1 block">
                    SPECIAL FORCES ARMORY SPECIFICATION
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAsset(null)}
                className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Title & Description */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-tactical font-black uppercase text-white">
                {selectedAsset.title}
              </h2>

              <p className="text-sm font-sans text-neutral-300 leading-relaxed">
                {selectedAsset.description}
              </p>
            </div>

            {/* In-Depth Tactical Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-data">
              <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] block">CATEGORY & DOMAIN</span>
                <span className="text-amber-400 font-bold">{selectedAsset.category} Deployment</span>
                <span className="text-[10px] text-neutral-400 block">San Andreas Sector 1 - 7</span>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] block">CIT2 AUTHORIZATION</span>
                <span className="text-emerald-400 font-bold">Official Law Group Approved</span>
                <span className="text-[10px] text-neutral-400 block">USSF Special Forces Group</span>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] block">EQUIPMENT INTEGRATION</span>
                <span className="text-neutral-200 font-medium">
                  {selectedAsset.type === 'SKIN' ? 'Kevlar Vest, Ballistic Shield, Radio Harness' : 'Police Siren, Thermal Camera, EMP Jammer'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-1">
                <span className="text-neutral-500 uppercase text-[10px] block">OPERATIONAL PROTOCOL</span>
                <span className="text-neutral-200 font-medium">
                  {selectedAsset.type === 'SKIN' ? 'Authorized for Patrol & Tactical Raids' : 'Authorized for High-Speed Intercepts & APB'}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex justify-end gap-3 border-t border-neutral-800">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-6 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-tactical font-bold text-xs uppercase cursor-pointer transition-colors"
              >
                CLOSE SPECIFICATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
