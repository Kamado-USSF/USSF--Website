import React, { useState } from 'react';
import { Shield, X, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { TacticalProduct } from '../data/tacticalContent';
import { tacticalAudio } from '../utils/audioSynth';

interface ProcurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: TacticalProduct | null;
}

export const ProcurementModal: React.FC<ProcurementModalProps> = ({
  isOpen,
  onClose,
  preselectedProduct
}) => {
  const [formData, setFormData] = useState({
    agency: '',
    officerName: '',
    email: '',
    callsign: '',
    unitQuantity: '12',
    deliveryTimeframe: 'immediate',
    missionNotes: preselectedProduct ? `Requisition inquiry for: ${preselectedProduct.name}` : ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agency || !formData.email || !formData.officerName) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');
    tacticalAudio.playTargetLock();
    tacticalAudio.playRadioSquelch();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-bold font-tactical uppercase text-neutral-100">
              DEPARTMENT REQUISITION & ARMORY ACCESS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-bold font-tactical uppercase text-neutral-100">
              TRANSMISSION RECEIVED // REQUISITION LOGGED
            </h4>
            <p className="text-xs font-sans text-neutral-300 max-w-md mx-auto leading-relaxed">
              Tactical Logistics Officer has logged requisition order for {formData.agency}. 
              Encrypted procurement invoice transmitted to <span className="text-amber-400 font-data">{formData.email}</span>.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded bg-amber-500 text-neutral-950 font-tactical font-bold text-xs uppercase hover:bg-amber-400 transition-colors"
              >
                RETURN TO SYSTEM
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-data">
            {errorMsg && (
              <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1 uppercase font-bold">
                  AGENCY / UNIT BRANCH *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5th SFG / SWAT / Border Guard"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 uppercase font-bold">
                  OFFICER / POC NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rank & Full Name"
                  value={formData.officerName}
                  onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1 uppercase font-bold">
                  OFFICIAL EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="officer@department.mil / gov"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 uppercase font-bold">
                  ESTIMATED UNIT QUANTITY
                </label>
                <select
                  value={formData.unitQuantity}
                  onChange={(e) => setFormData({ ...formData, unitQuantity: e.target.value })}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
                >
                  <option value="1">1 Evaluation Unit</option>
                  <option value="12">12 Group Pack</option>
                  <option value="50">50 Platoon Outfitting</option>
                  <option value="250">250+ Department Procurement</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 uppercase font-bold">
                OPERATIONAL REQUIREMENTS / NOTES
              </label>
              <textarea
                rows={3}
                placeholder="Include helmet mount specifications (ARC Rail, M-LOK, Ops-Core), IR beacon codes, or mission timeline."
                value={formData.missionNotes}
                onChange={(e) => setFormData({ ...formData, missionNotes: e.target.value })}
                className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-neutral-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded bg-amber-500 text-neutral-950 font-tactical font-bold text-xs uppercase hover:bg-amber-400 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>SUBMIT REQUISITION</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
