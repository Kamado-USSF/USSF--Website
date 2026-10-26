import React, { useState } from 'react';
import { X, Send, Shield, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { FieldReport, USSFMember } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';

interface USSFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: FieldReport) => void;
  currentUser?: USSFMember | null;
}

export const USSFReportModal: React.FC<USSFReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Patrol' | 'Training' | 'Combat'>('Patrol');
  const [hostName, setHostName] = useState(currentUser?.name || '');
  const [hostCid, setHostCid] = useState(currentUser?.cid || '');
  const [participantsText, setParticipantsText] = useState('');
  const [durationHours, setDurationHours] = useState('1.5');
  const [summary, setSummary] = useState('');
  const [proofLink, setProofLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.isApplicant || currentUser.isMember === false) {
      setErrorMsg('Unauthorized: Only verified active USSF members are authorized to file official field reports.');
      tacticalAudio.playAlertWarning();
      return;
    }
    if (!title || !summary) {
      setErrorMsg('Please enter a report title and summary.');
      return;
    }

    const participants = participantsText
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const newReport: FieldReport = {
      id: `rep-${Date.now()}`,
      title,
      type,
      hostName,
      hostCid,
      participants,
      durationHours: parseFloat(durationHours) || 1.0,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved',
      summary,
      proofLink: proofLink || 'https://sf.cit2.internal/reports/verified'
    };

    tacticalAudio.playRadioSquelch();
    tacticalAudio.playTargetLock();
    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold font-tactical uppercase text-neutral-100">
              PUBLISH FIELD OPERATIONS REPORT
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-data">
          {errorMsg && (
            <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-neutral-400 mb-1 uppercase font-bold">
              OPERATION TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Night Sweep Alpha / CQB Clearance Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1 uppercase font-bold">
                OPERATION TYPE
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none uppercase"
              >
                <option value="Patrol">Patrol</option>
                <option value="Training">Training</option>
                <option value="Combat">Combat Operation</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 uppercase font-bold">
                DURATION (HOURS)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 uppercase font-bold">
              HOST OPERATOR NAME
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="e.g. Ghost or SF-Operator"
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 uppercase font-bold">
              PARTICIPANTS (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 uppercase font-bold">
              OPERATIONAL LOG SUMMARY *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Outline mission objectives achieved, tactics rehearsed, and attendance verification."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 uppercase font-bold">
              PROOF / SCREENSHOT LINK
            </label>
            <input
              type="text"
              placeholder="https://imgur.com/... or internal screenshot log"
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded bg-neutral-100 text-neutral-950 font-tactical font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>PUBLISH REPORT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
