import React, { useState } from 'react';
import { Globe, Search, Check, X } from 'lucide-react';
import { ALL_150_LANGUAGES, LanguageInfo } from '../utils/translations';
import { tacticalAudio } from '../utils/audioSynth';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = ALL_150_LANGUAGES.filter(lang => 
    lang.label.toLowerCase().includes(query.toLowerCase()) ||
    lang.native.toLowerCase().includes(query.toLowerCase()) ||
    lang.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-neutral-700 bg-[#0d100d] p-6 shadow-2xl text-neutral-100 font-sans flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 text-amber-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-data text-amber-400 uppercase tracking-widest font-bold">
                INTERNATIONAL TACTICAL COMMUNICATIONS
              </div>
              <h3 className="text-base font-tactical font-black uppercase text-white">
                SELECT LANGUAGE ({ALL_150_LANGUAGES.length}+ WORLD LANGUAGES)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search language name, native script, or country..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs font-data text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Languages Grid */}
        <div className="overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-data">
          {filtered.map(lang => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 text-amber-300 font-bold shadow-md'
                    : 'border-neutral-800 bg-neutral-950/70 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{lang.flag}</span>
                  <div className="truncate">
                    <span className="block truncate font-semibold">{lang.label}</span>
                    <span className="text-[10px] text-neutral-500 block truncate">{lang.native}</span>
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 mt-4 text-[10px] font-data text-neutral-500 flex justify-between shrink-0">
          <span>SHOWING {filtered.length} OF {ALL_150_LANGUAGES.length} LANGUAGES</span>
          <span>SPECIAL FORCES (USSF)</span>
        </div>
      </div>
    </div>
  );
};
