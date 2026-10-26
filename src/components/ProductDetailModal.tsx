import React from 'react';
import { TacticalProduct } from '../data/tacticalContent';
import { X, Shield, Zap, Clock, Droplets, Compass, ShoppingBag } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

interface ProductDetailModalProps {
  product: TacticalProduct | null;
  onClose: () => void;
  onRequisition: (product: TacticalProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequisition
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div>
            <div className="text-xs font-data text-amber-400 uppercase font-semibold">
              {product.categoryLabel}
            </div>
            <h3 className="text-xl font-bold font-tactical uppercase text-neutral-100 mt-0.5">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-data bg-neutral-950 p-4 rounded-lg border border-neutral-800">
            <div>
              <span className="text-neutral-500 uppercase">PEAK LUMENS:</span>
              <div className="text-amber-400 font-bold text-sm">{product.lumens} Lumens</div>
            </div>
            <div>
              <span className="text-neutral-500 uppercase">MAX RUNTIME:</span>
              <div className="text-sky-400 font-bold text-sm">{product.runtime}</div>
            </div>
            <div>
              <span className="text-neutral-500 uppercase">WATERPROOF RATING:</span>
              <div className="text-emerald-400 font-bold">{product.waterproofRating}</div>
            </div>
            <div>
              <span className="text-neutral-500 uppercase">BEAM THROW DISTANCE:</span>
              <div className="text-neutral-200 font-bold">{product.beamDistance}</div>
            </div>
            <div>
              <span className="text-neutral-500 uppercase">SYSTEM WEIGHT:</span>
              <div className="text-neutral-200">{product.weight}</div>
            </div>
            <div>
              <span className="text-neutral-500 uppercase">MOUNT COMPATIBILITY:</span>
              <div className="text-neutral-200">{product.mountType}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-data text-amber-400 uppercase font-bold mb-2">
              OUTPUT WAVELENGTH MODES:
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-data">
              {product.modes.map((mode) => (
                <span
                  key={mode}
                  className="rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-neutral-300"
                >
                  {mode}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <div className="text-lg font-bold font-data text-neutral-100">
              ${product.price} <span className="text-xs text-neutral-400">USD</span>
            </div>

            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onRequisition(product);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-amber-500 text-neutral-950 font-tactical font-bold text-xs uppercase hover:bg-amber-400 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>REQUEST REQUISITION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
