import React, { useState } from 'react';
import { TACTICAL_PRODUCTS, TacticalProduct } from '../data/tacticalContent';
import { Shield, Zap, Clock, Droplets, ChevronRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

interface GearCatalogProps {
  onSelectProduct: (product: TacticalProduct) => void;
  activeCategoryFilter?: string;
  onAddToCart?: (product: TacticalProduct) => void;
}

export const GearCatalog: React.FC<GearCatalogProps> = ({ 
  onSelectProduct, 
  activeCategoryFilter = 'all',
  onAddToCart 
}) => {
  const [filter, setFilter] = useState<string>(activeCategoryFilter);

  const categories = [
    { id: 'all', label: 'ALL GEAR' },
    { id: 'helmet', label: 'MPLS HELMET LIGHTS' },
    { id: 'headlamp', label: 'HEADLAMPS' },
    { id: 'weapon', label: 'WEAPON ILLUMINATORS' },
    { id: 'subsurface', label: 'SUB-SURFACE AMPHIBIOUS' }
  ];

  const filteredProducts = filter === 'all'
    ? TACTICAL_PRODUCTS
    : TACTICAL_PRODUCTS.filter(p => p.category === filter);

  return (
    <section id="tactical-gear" className="relative w-full py-16 bg-neutral-950 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400 mb-2">
              <Shield className="h-3.5 w-3.5" />
              <span>PRINCETON-TEC TACTICAL CATALOG</span>
              <span aria-hidden="true" className="text-neutral-600">/</span>
              <span className="text-neutral-400">MISSION READY SYSTEMS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-tactical uppercase tracking-tight text-neutral-100">
              TACTICAL LIGHTING & GEAR SOLUTIONS
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Curated equipment designed for frontline operators, special missions, and hazardous duty environments. 
              Submersible, shockproof, and multi-spectrum enabled.
            </p>
          </div>

          {/* Interactive Filter Tabs (functional segmented control buttons) */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900/80 p-1 text-xs font-tactical tracking-wider">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setFilter(cat.id);
                }}
                className={`px-3 py-1.5 rounded transition-all whitespace-nowrap uppercase ${
                  filter === cat.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 transition-all hover:border-neutral-700 hover:bg-neutral-900/80 shadow-md"
            >
              {/* Top Category & Price */}
              <div>
                <div className="flex items-center justify-between text-xs font-data mb-3">
                  <span className="text-amber-400 font-semibold tracking-wide">
                    {product.categoryLabel}
                  </span>
                  <span className="text-neutral-200 font-bold tabular-nums">
                    ${product.price} USD
                  </span>
                </div>

                {/* Product Title */}
                <h3 className="text-lg font-bold font-tactical uppercase tracking-wide text-neutral-100 group-hover:text-amber-300 transition-colors">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-neutral-400 font-sans leading-relaxed">
                  {product.description}
                </p>

                {/* Tactical Specs Table */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3 text-xs font-data text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>{product.lumens} LUMENS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span>{product.runtime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{product.waterproofRating}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500 font-bold">THROW:</span>
                    <span>{product.beamDistance}</span>
                  </div>
                </div>

                {/* Modes unboxed metadata */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-data text-neutral-400">
                  <span className="text-neutral-500 font-bold">MODES:</span>
                  {product.modes.map((mode, idx) => (
                    <React.Fragment key={mode}>
                      <span>{mode}</span>
                      {idx < product.modes.length - 1 && <span aria-hidden="true" className="text-neutral-700">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    onSelectProduct(product);
                  }}
                  className="text-xs font-tactical tracking-wider text-neutral-300 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <span>FULL SPEC SHEET</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    if (onAddToCart) onAddToCart(product);
                  }}
                  className="px-3 py-1.5 text-xs font-tactical tracking-wider font-semibold text-neutral-950 bg-[#d8c3a5] hover:bg-[#cbb596] rounded active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>REQUISITION</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
